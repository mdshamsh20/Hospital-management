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
const validate_1 = require("../middleware/validate");
const appointment_1 = require("../validations/appointment");
const response_1 = require("../utils/response");
const router = (0, express_1.Router)();
// Get all appointments with patient details
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appointments = yield prismaClient_1.default.appointment.findMany({
        where: {
            date: {
                gte: today
            }
        },
        include: {
            patient: true
        },
        orderBy: {
            token: 'asc'
        }
    });
    res.json(appointments);
}));
// Register new patient and/or book appointment
router.post('/register', (0, validate_1.validate)(appointment_1.createAppointmentSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, age, gender, phone, departmentId, doctorId, visitType, priority, referredBy, isWalkIn, message, serviceCharge, notes } = req.body;
    // 1. Find or create patient
    let patient = yield prismaClient_1.default.patient.findUnique({
        where: { phone }
    });
    if (!patient) {
        patient = yield prismaClient_1.default.patient.create({
            data: {
                name,
                age: age ? parseInt(age) : null,
                gender: gender || null,
                phone
            }
        });
    }
    // 2. Determine appointment date
    const apptDate = req.body.preferredDate || req.body.date ? new Date(req.body.preferredDate || req.body.date) : new Date();
    apptDate.setHours(0, 0, 0, 0);
    // 3. Generate token for the specific date
    const lastAppt = yield prismaClient_1.default.appointment.findFirst({
        where: { date: apptDate },
        orderBy: { token: 'desc' }
    });
    const nextToken = ((lastAppt === null || lastAppt === void 0 ? void 0 : lastAppt.token) || 0) + 1;
    // 4. Create appointment
    const appointment = yield prismaClient_1.default.appointment.create({
        data: {
            patientId: patient.id,
            departmentId: departmentId ? parseInt(departmentId) : null,
            doctorId: doctorId ? parseInt(doctorId) : null,
            visitType: visitType || 'Consultation',
            priority: priority || 'Normal',
            referredBy,
            isWalkIn: isWalkIn !== null && isWalkIn !== void 0 ? isWalkIn : true,
            notes,
            message,
            serviceCharge: serviceCharge ? parseFloat(serviceCharge) : 0,
            token: nextToken,
            date: apptDate,
            status: 'Registered'
        },
        include: { patient: true }
    });
    // 4. Audit Log
    yield prismaClient_1.default.auditLog.create({
        data: {
            action: 'Patient Registered',
            module: 'Reception',
            details: `Token ${nextToken} issued for ${name}`
        }
    });
    (0, response_1.sendSuccess)(res, appointment, 'Appointment created successfully', 201);
}));
// Update appointment status (Granular Lifecycle)
router.patch('/:id/status', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    const now = new Date();
    let data = { status };
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
        res.json(updated);
    }
    catch (error) {
        next(error);
    }
}));
// Update billing
router.patch('/:id/billing', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        next(error);
    }
}));
// Delete appointment
router.delete('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prismaClient_1.default.appointment.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Appointment removed' });
    }
    catch (error) {
        next(error);
    }
}));
// Update token number
router.patch('/:id/token', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { token } = req.body;
    try {
        const updated = yield prismaClient_1.default.appointment.update({
            where: { id: parseInt(id) },
            data: { token: parseInt(token) }
        });
        res.json(updated);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
