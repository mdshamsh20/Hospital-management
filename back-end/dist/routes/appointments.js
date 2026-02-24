"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prismaClient_1 = __importDefault(require("../prismaClient"));
const router = (0, express_1.Router)();
// Get all appointments with patient details
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // @ts-ignore - Prisma client needs to be regenerated to see new fields
        const appointments = yield prismaClient_1.default.appointment.findMany({
            where: {
                date: {
                    gte: today
                }
            },
            include: {
                // @ts-ignore
                patient: true
            },
            orderBy: {
                // @ts-ignore
                token: 'asc'
            }
        });
        res.json(appointments);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
}));
// Register new patient and/or book appointment
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, age, gender, phone, departmentId, doctorId, visitType, priority, referredBy, isWalkIn, message, serviceCharge, notes } = req.body;
    try {
        // 1. Find or create patient
        // @ts-ignore
        let patient = yield prismaClient_1.default.patient.findUnique({
            where: { phone }
        });
        if (!patient) {
            // @ts-ignore
            patient = yield prismaClient_1.default.patient.create({
                data: {
                    name,
                    age: parseInt(age),
                    gender,
                    phone
                }
            });
        }
        // 2. Generate token for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // @ts-ignore
        const lastAppt = yield prismaClient_1.default.appointment.findFirst({
            where: { date: today },
            // @ts-ignore
            orderBy: { token: 'desc' }
        });
        const nextToken = ((lastAppt === null || lastAppt === void 0 ? void 0 : lastAppt.token) || 0) + 1;
        // 3. Create appointment
        // @ts-ignore
        const appointment = yield prismaClient_1.default.appointment.create({
            data: {
                // @ts-ignore
                patientId: patient.id,
                departmentId: departmentId ? parseInt(departmentId) : null,
                doctorId: doctorId ? parseInt(doctorId) : null,
                // @ts-ignore
                visitType: visitType || 'Consultation',
                // @ts-ignore
                priority: priority || 'Normal',
                // @ts-ignore
                referredBy,
                // @ts-ignore
                isWalkIn: isWalkIn !== null && isWalkIn !== void 0 ? isWalkIn : true,
                // @ts-ignore
                notes,
                message,
                // @ts-ignore
                serviceCharge: serviceCharge ? parseFloat(serviceCharge) : 0,
                // @ts-ignore
                token: nextToken,
                date: today,
                // @ts-ignore
                status: 'Registered'
            }, // @ts-ignore
            include: { patient: true }
        });
        // 4. Audit Log
        // @ts-ignore
        yield prismaClient_1.default.auditLog.create({
            data: {
                action: 'Patient Registered',
                module: 'Reception',
                details: `Token ${nextToken} issued for ${name}`
            }
        });
        res.json(appointment);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
}));
// Update appointment status (Granular Lifecycle)
router.patch('/:id/status', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    const now = new Date();
    let data = { status };
    // Logic: Registered -> Waiting -> With Doctor -> Procedure -> Completed -> Billing -> Closed
    if (status === 'With Doctor' || status === 'Procedure') {
        data.startedAt = now;
    }
    else if (status === 'Completed') {
        data.completedAt = now;
    }
    try {
        const updated = yield prismaClient_1.default.appointment.update({
            where: { id: parseInt(id) },
            data
        });
        // Automatically decrement inventory if status is 'Procedure' and type is specified?
        // This could be a future enhancement.
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update status' });
    }
}));
// Update billing
router.patch('/:id/billing', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { paymentStatus, serviceCharge } = req.body;
    try {
        const updated = yield prismaClient_1.default.appointment.update({
            where: { id: parseInt(id) },
            data: {
                // @ts-ignore
                paymentStatus,
                // @ts-ignore
                serviceCharge: serviceCharge ? parseFloat(serviceCharge) : undefined
            }
        });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ error: 'Billing update failed' });
    }
}));
exports.default = router;
