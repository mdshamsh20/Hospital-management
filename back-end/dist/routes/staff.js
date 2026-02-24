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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Get all staff
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const staff = yield prisma.staff.findMany({
            include: {
                attendance: {
                    where: {
                        date: {
                            gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        },
                    },
                },
            },
        });
        res.json(staff);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch staff' });
    }
}));
// Add staff
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, role, contact, salary, joiningDate } = req.body;
    try {
        const staff = yield prisma.staff.create({
            data: {
                name,
                role,
                contact,
                salary: parseFloat(salary),
                joiningDate: new Date(joiningDate),
            },
        });
        res.json(staff);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create staff' });
    }
}));
// Update staff
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, role, contact, salary } = req.body;
    try {
        const staff = yield prisma.staff.update({
            where: { id: parseInt(id) },
            data: {
                name,
                role,
                contact,
                salary: parseFloat(salary),
            },
        });
        res.json(staff);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update staff' });
    }
}));
// Delete staff
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.staff.delete({
            where: { id: parseInt(id) },
        });
        res.json({ message: 'Staff deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete staff' });
    }
}));
// Mark Check-in
router.post('/attendance/check-in', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { staffId } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    try {
        // Check if already checked in
        const existing = yield prisma.attendance.findFirst({
            where: {
                staffId: parseInt(staffId),
                date: today
            }
        });
        if (existing) {
            return res.status(400).json({ error: 'Already checked in today' });
        }
        const attendance = yield prisma.attendance.create({
            data: {
                staffId: parseInt(staffId),
                date: today,
                checkIn: new Date(),
                status: 'Present'
            }
        });
        res.json(attendance);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to check in' });
    }
}));
// Mark Check-out
router.post('/attendance/check-out', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { staffId } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    try {
        const attendance = yield prisma.attendance.findFirst({
            where: {
                staffId: parseInt(staffId),
                date: today,
                checkOut: null
            }
        });
        if (!attendance) {
            return res.status(400).json({ error: 'No active check-in found' });
        }
        const checkOutTime = new Date();
        const workingHours = (checkOutTime.getTime() - attendance.checkIn.getTime()) / (1000 * 60 * 60);
        const updated = yield prisma.attendance.update({
            where: { id: attendance.id },
            data: {
                checkOut: checkOutTime,
                workingHours: parseFloat(workingHours.toFixed(2))
            }
        });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to check out' });
    }
}));
// Legacy Record Attendance (Manual)
router.post('/attendance', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { staffId, status, date } = req.body;
    try {
        const attendance = yield prisma.attendance.create({
            data: {
                staffId: parseInt(staffId),
                status,
                date: new Date(date),
            },
        });
        res.json(attendance);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to mark attendance' });
    }
}));
// Record Salary Payment
router.post('/salaries', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { staffId, month, amount, date } = req.body;
    try {
        const salary = yield prisma.salaryPayment.create({
            data: {
                staffId: parseInt(staffId),
                month,
                amount: parseFloat(amount),
                date: new Date(date),
            },
        });
        res.json(salary);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to record salary' });
    }
}));
exports.default = router;
