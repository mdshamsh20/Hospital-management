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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prismaClient_1 = __importDefault(require("../prismaClient"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// 1. Live Operations Monitor (Enhanced for Ops Admin)
router.get('/dashboard-monitor', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monthString = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    try {
        const [waitingQueue, inProcedure, reportsPendingReview, finalizedToday, monthlyCommission, sampleRevenueToday] = yield Promise.all([
            prismaClient_1.default.appointment.findMany({
                where: { date: { gte: today }, status: { in: ['Waiting', 'Registered', 'Arrived'] } },
                include: { patient: true, department: true, doctor: true }
            }),
            prismaClient_1.default.appointment.findMany({
                where: { date: { gte: today }, status: { in: ['In Procedure', 'With Doctor', 'Calling'] } },
                include: { patient: true, department: true, doctor: true }
            }),
            prismaClient_1.default.medicalReport.count({ where: { status: 'Under Review' } }),
            prismaClient_1.default.medicalReport.count({
                where: { status: 'Final', finalizedAt: { gte: today } }
            }),
            prismaClient_1.default.commissionRecord.aggregate({
                where: { month: monthString },
                _sum: { commissionAmount: true }
            }),
            prismaClient_1.default.sampleCollection.aggregate({
                where: { collectionDate: { gte: today } },
                _sum: { amountCollected: true }
            })
        ]);
        res.json({
            waitingQueue,
            inProcedure,
            kpis: {
                pendingReview: reportsPendingReview,
                finalizedToday: finalizedToday,
                monthlyCommission: monthlyCommission._sum.commissionAmount || 0,
                sampleRevenue: sampleRevenueToday._sum.amountCollected || 0
            }
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
router.get('/payroll', (0, auth_1.authorize)('SUPER_ADMIN'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const monthString = now.toLocaleString('default', { month: 'long', year: 'numeric' });
        // Define start and end of current month
        const startOfMonth = new Date(currentYear, currentMonth, 1);
        const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);
        const staff = yield prismaClient_1.default.staff.findMany({
            include: {
                attendance: {
                    where: {
                        date: {
                            gte: startOfMonth,
                            lte: endOfMonth
                        },
                        status: 'Present'
                    }
                },
                salaries: {
                    where: {
                        month: monthString
                    }
                }
            }
        });
        const payroll = staff.map(member => {
            const daysPresent = member.attendance.length;
            const salaryPerDay = (member.salary || 0) / 30; // Rough calc
            const payable = daysPresent * salaryPerDay;
            const isPaid = member.salaries.length > 0;
            return {
                id: member.id,
                name: member.name,
                role: member.role,
                actualSalary: member.salary,
                daysPresent,
                payable: Math.round(payable),
                status: isPaid ? 'Paid' : 'Ready'
            };
        });
        res.json(payroll);
    }
    catch (error) {
        console.error('Payroll calculation error:', error);
        res.status(500).json({ error: 'Payroll calc failed' });
    }
}));
// 4. Process Payroll Payment
router.post('/payroll/process', (0, auth_1.authorize)('SUPER_ADMIN'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { staffId, month, amount } = req.body;
    const monthString = month || new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    try {
        if (staffId) {
            // Check if already paid
            const existing = yield prismaClient_1.default.salaryPayment.findFirst({
                where: { staffId: parseInt(staffId), month: monthString }
            });
            if (existing) {
                return res.status(400).json({ error: 'Salary already processed for this month' });
            }
            const payment = yield prismaClient_1.default.salaryPayment.create({
                data: {
                    staffId: parseInt(staffId),
                    month: monthString,
                    amount: parseFloat(amount)
                }
            });
            res.json(payment);
        }
        else {
            // Process all
            const staff = yield prismaClient_1.default.staff.findMany({
                include: {
                    attendance: {
                        where: {
                            date: {
                                gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                                lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
                            },
                            status: 'Present'
                        }
                    },
                    salaries: {
                        where: { month: monthString }
                    }
                }
            });
            const paymentsToCreate = staff
                .filter(member => member.salaries.length === 0)
                .map(member => {
                const daysPresent = member.attendance.length;
                const salaryPerDay = (member.salary || 0) / 30;
                const payable = Math.round(daysPresent * salaryPerDay);
                return {
                    staffId: member.id,
                    month: monthString,
                    amount: payable
                };
            })
                .filter(p => p.amount > 0);
            if (paymentsToCreate.length === 0) {
                return res.json({ message: 'No pending payments found' });
            }
            const result = yield prismaClient_1.default.salaryPayment.createMany({
                data: paymentsToCreate
            });
            res.json({ message: `Successfully processed ${result.count} payments`, count: result.count });
        }
    }
    catch (error) {
        console.error('Payment processing error:', error);
        res.status(500).json({ error: 'Payment processing failed' });
    }
}));
// 5. Clinic Settings
router.get('/settings', (0, auth_1.authorize)('SUPER_ADMIN'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let settings = yield prismaClient_1.default.clinicSettings.findFirst();
        if (!settings) {
            settings = yield prismaClient_1.default.clinicSettings.create({ data: {} });
        }
        res.json(settings);
    }
    catch (error) {
        res.status(500).json({ error: 'Settings fetch failed' });
    }
}));
router.patch('/settings', (0, auth_1.authorize)('SUPER_ADMIN'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updateData = req.body;
    try {
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
// 6. Sample Collection Tracking
router.get('/samples', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const samples = yield prismaClient_1.default.sampleCollection.findMany({
        orderBy: { collectionDate: 'desc' }
    });
    res.json(samples);
}));
router.post('/samples', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const sample = yield prismaClient_1.default.sampleCollection.create({
        data: Object.assign(Object.assign({}, data), { margin: (data.amountCollected || 0) - (data.labPayment || 0) })
    });
    res.json(sample);
}));
router.patch('/samples/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updated = yield prismaClient_1.default.sampleCollection.update({
        where: { id: parseInt(id) },
        data: req.body
    });
    res.json(updated);
}));
// 7. Commission Management
router.get('/commissions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { month } = req.query;
    const currentMonth = month || new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    const records = yield prismaClient_1.default.commissionRecord.findMany({
        where: { month: currentMonth },
        orderBy: { createdAt: 'desc' }
    });
    res.json(records);
}));
router.post('/commissions/approve', (0, auth_1.authorize)('ADMIN', 'SUPER_ADMIN'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ids } = req.body;
    const updated = yield prismaClient_1.default.commissionRecord.updateMany({
        where: { id: { in: ids } },
        data: { status: 'Approved', approvedAt: new Date() }
    });
    res.json({ message: `Approved ${updated.count} records` });
}));
// 8. System Access Control (Super Admin Only: Manage Users)
router.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Only Super Admin can view system users' });
    }
    const users = yield prismaClient_1.default.users.findMany({
        select: { id: true, email: true, role: true }
    });
    res.json(users);
}));
router.post('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Only Super Admin can create system users' });
    }
    const { email, password, role } = req.body;
    const existing = yield prismaClient_1.default.users.findUnique({ where: { email } });
    if (existing) {
        return res.status(400).json({ error: 'Email already exists' });
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const newUser = yield prismaClient_1.default.users.create({
        data: {
            email,
            password: hashedPassword,
            role: role || 'RECEPTIONIST'
        }
    });
    res.json({ id: newUser.id, email: newUser.email, role: newUser.role });
}));
router.delete('/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Only Super Admin can delete system users' });
    }
    const targetId = parseInt(req.params.id);
    if (targetId === req.user.userId) {
        return res.status(400).json({ error: 'You cannot delete your own account' });
    }
    yield prismaClient_1.default.users.delete({ where: { id: targetId } });
    res.json({ message: 'User removed successfully' });
}));
exports.default = router;
