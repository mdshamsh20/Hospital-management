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
// Reception Dashboard Stats
router.get('/dashboard-stats', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const twentyMinsAgo = new Date(Date.now() - 20 * 60000);
    try {
        const [appointmentsToday, waitingQueue, reportsReady, dentalFollowUps, doctors, delayedCount] = yield Promise.all([
            prismaClient_1.default.appointment.findMany({
                where: { date: today },
                include: { patient: true }
            }),
            prismaClient_1.default.appointment.findMany({
                where: {
                    date: today,
                    status: { in: ['Registered', 'Waiting'] }
                },
                include: { patient: true },
                orderBy: { token: 'asc' }
            }),
            prismaClient_1.default.medicalReport.findMany({
                where: { status: 'Final' }
            }),
            prismaClient_1.default.dentalLabOrder.findMany({
                where: {
                    status: { in: ['Ready for Fit', 'Fabrication Scheduled'] },
                    expectedReturn: { lte: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
                }
            }),
            prismaClient_1.default.doctor.findMany(),
            prismaClient_1.default.appointment.count({
                where: {
                    date: today,
                    status: 'Waiting',
                    arrivedAt: { lte: twentyMinsAgo }
                }
            })
        ]);
        res.json({
            appointmentsToday,
            waitingQueue,
            reportsReady,
            dentalFollowUps,
            doctors,
            delayedCount
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch receptionist stats' });
    }
}));
// Call Next Patient (Token Calling)
router.post('/call-next', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    try {
        // Find first patient in 'Waiting' status
        const nextPatient = yield prismaClient_1.default.appointment.findFirst({
            where: { date: today, status: 'Waiting' },
            orderBy: { token: 'asc' }
        });
        if (!nextPatient) {
            return res.status(404).json({ message: 'No patients in waiting queue' });
        }
        // Update status to 'Calling' (which will eventually become 'With Doctor')
        const updated = yield prismaClient_1.default.appointment.update({
            where: { id: nextPatient.id },
            data: { status: 'Calling' }
        });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ error: 'Token call failed' });
    }
}));
// Update Doctor Availability
router.patch('/doctors/:id/availability', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { availability } = req.body; // Available, Busy, On Break
    try {
        const updated = yield prismaClient_1.default.doctor.update({
            where: { id: parseInt(id) },
            data: { availability }
        });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update availability' });
    }
}));
// Update Radiology Report Delivery (Receptionist Action)
router.patch('/reports/:id/deliver', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const updated = yield prismaClient_1.default.medicalReport.update({
            where: { id: parseInt(id) },
            data: { status: 'Delivered' }
        });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ error: 'Delivery update failed' });
    }
}));
// Update Dental Lab Order Action (Receptionist Action)
router.patch('/dental-orders/:id/action', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { action, followUpDate } = req.body;
    try {
        const updated = yield prismaClient_1.default.dentalLabOrder.update({
            where: { id: parseInt(id) },
            data: {
                receptionAction: action,
                followUpDate: followUpDate ? new Date(followUpDate) : undefined
            }
        });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ error: 'Action update failed' });
    }
}));
exports.default = router;
