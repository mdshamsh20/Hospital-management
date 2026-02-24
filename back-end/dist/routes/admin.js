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
// 1. Live Operations Monitor (Live Snapshot)
router.get('/dashboard-monitor', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    try {
        const [waitingQueue, inProcedure, reportsPending, dentalLabCases] = yield Promise.all([
            prismaClient_1.default.appointment.findMany({
                where: { date: { gte: today }, status: { in: ['Waiting', 'Registered', 'Arrived'] } },
                include: { patient: true, department: true, doctor: true }
            }),
            prismaClient_1.default.appointment.findMany({
                where: { date: { gte: today }, status: { in: ['In Procedure', 'With Doctor', 'Calling'] } },
                include: { patient: true, department: true, doctor: true }
            }),
            prismaClient_1.default.radiologyCase.findMany({
                where: { status: { in: ['Pending', 'In Typing'] } }
            }),
            prismaClient_1.default.dentalLabOrder.findMany({
                where: { status: { not: 'Completed' } }
            })
        ]);
        res.json({
            waitingQueue,
            inProcedure,
            reportsPending,
            dentalLabCases
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch monitor stats' });
    }
}));
// 2. Visit Audit View (Historical Data with Durations)
router.get('/visits/audit', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointments = yield prismaClient_1.default.appointment.findMany({
            include: {
                patient: true,
                doctor: true,
                department: true
            },
            orderBy: { arrivedAt: 'desc' }
        });
        res.json(appointments);
    }
    catch (error) {
        res.status(500).json({ error: 'Audit fetch failed' });
    }
}));
// 3. Payroll Summary
router.get('/payroll', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const staff = yield prismaClient_1.default.staff.findMany({
            include: {
                attendance: true
            }
        });
        const payroll = staff.map(member => {
            const daysPresent = member.attendance.filter(a => a.status === 'Present').length;
            const salaryPerDay = (member.salary || 0) / 30; // Rough calc
            const payable = daysPresent * salaryPerDay;
            return {
                id: member.id,
                name: member.name,
                role: member.role,
                actualSalary: member.salary,
                daysPresent,
                payable: Math.round(payable)
            };
        });
        res.json(payroll);
    }
    catch (error) {
        res.status(500).json({ error: 'Payroll calc failed' });
    }
}));
// 4. Clinic Settings
router.get('/settings', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        let settings = yield prismaClient_1.default.clinicSettings.findFirst();
        if (!settings) {
            // @ts-ignore
            settings = yield prismaClient_1.default.clinicSettings.create({ data: {} });
        }
        res.json(settings);
    }
    catch (error) {
        res.status(500).json({ error: 'Settings fetch failed' });
    }
}));
router.patch('/settings', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updateData = req.body;
    try {
        // @ts-ignore
        const settings = yield prismaClient_1.default.clinicSettings.update({
            where: { id: 1 },
            data: updateData
        });
        res.json(settings);
    }
    catch (error) {
        res.status(500).json({ error: 'Settings update failed' });
    }
}));
exports.default = router;
