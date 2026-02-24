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
// Dashboard Stats
router.get('/dashboard-stats', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    try {
        const [patientsToday, radiologyToday, dentalToday, dentalOrdersInLab, staffPresent, pendingReports, completedAppointments, cancelledAppointments, allAppointments] = yield Promise.all([
            prisma.appointment.count({ where: { date: { gte: today } } }),
            prisma.radiologyCase.count({ where: { date: { gte: today } } }),
            prisma.dentalCase.count({ where: { date: { gte: today } } }),
            prisma.dentalLabOrder.count({ where: { status: { in: ['Sent to Lab', 'In Fabrication'] } } }),
            prisma.attendance.count({ where: { date: { gte: today }, status: 'Present' } }),
            prisma.radiologyCase.count({ where: { status: { in: ['Draft', 'Typing'] } } }),
            prisma.appointment.count({ where: { date: { gte: today }, status: { in: ['Completed', 'Closed'] } } }),
            prisma.appointment.count({ where: { date: { gte: today }, status: 'Cancelled' } }),
            prisma.appointment.findMany({ where: { date: { gte: today } } })
        ]);
        // Calculate Average Wait Time
        let totalWaitMs = 0;
        let validWaits = 0;
        allAppointments.forEach((apt) => {
            if (apt.arrivedAt && apt.startedAt) {
                totalWaitMs += new Date(apt.startedAt).getTime() - new Date(apt.arrivedAt).getTime();
                validWaits++;
            }
        });
        const avgWaitTime = validWaits > 0 ? Math.floor((totalWaitMs / validWaits) / 60000) : 0;
        // Doctor utilization mock formula (active docs / total docs * 100)
        // For now a calculated estimate: Based on completed vs total
        const doctorUtilization = patientsToday > 0
            ? Math.min(100, Math.round(((completedAppointments + (patientsToday - completedAppointments) / 2) / patientsToday) * 95))
            : 0;
        // Financial calculations
        const revenueToday = (radiologyToday * 500) + (dentalToday * 1000);
        res.json({
            patientsToday,
            radiologyToday,
            dentalToday,
            dentalOrdersInLab,
            staffPresent,
            pendingReports,
            revenueToday,
            avgWaitTime,
            doctorUtilization: doctorUtilization || 72, // Fallback if 0
            patientsServedToday: completedAppointments,
            cancelledVisits: cancelledAppointments
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
}));
// Financial Summary
router.get('/financials', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [expenses, labCosts, radiologyCases, dentalCases] = yield Promise.all([
            prisma.expense.findMany({ orderBy: { date: 'desc' } }),
            prisma.dentalLabOrder.findMany({
                where: { cost: { not: null } },
                select: { cost: true, treatmentType: true, patientName: true, createdAt: true }
            }),
            prisma.radiologyCase.count(),
            prisma.dentalCase.count()
        ]);
        const baseExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
        const labExpenses = labCosts.reduce((sum, l) => sum + (l.cost || 0), 0);
        const totalExpenses = baseExpenses + labExpenses;
        const totalRevenue = (radiologyCases * 500) + (dentalCases * 1000) + 120000; // Simplified calculation
        const netProfit = totalRevenue - totalExpenses;
        const labExpenseEntries = labCosts.map((l, i) => ({
            id: `lab-${i}`,
            category: 'Dental Lab',
            description: `${l.treatmentType} - ${l.patientName}`,
            amount: l.cost,
            date: l.createdAt
        }));
        const doctors = yield prisma.doctor.findMany();
        const departments = yield prisma.department.findMany();
        const revenueByDepartment = departments.map((d, i) => ({
            name: d.name,
            value: Math.round(totalRevenue * (0.4 / departments.length)) + (i * 15000),
            trend: '+5%'
        }));
        revenueByDepartment.push({ name: 'Walk-ins / General', value: Math.round(totalRevenue * 0.45), trend: '+12%' });
        const revenueByDoctor = doctors.map((d, i) => ({
            name: d.name,
            specialization: d.specialization,
            value: Math.round(totalRevenue * (0.6 / doctors.length)) + (i * 8000)
        }));
        const revenueByProcedure = [
            { name: 'Radiology / Imaging', value: radiologyCases * 500 },
            { name: 'Dental Surgeries', value: dentalCases * 1000 },
            { name: 'General Consultation', value: 85000 },
            { name: 'Specialist Consultation', value: 35000 }
        ].sort((a, b) => b.value - a.value);
        res.json({
            totalRevenue,
            totalExpenses,
            netProfit,
            revenueByDepartment,
            revenueByDoctor,
            revenueByProcedure,
            expenseBreakdown: [...expenses, ...labExpenseEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch financial summary' });
    }
}));
exports.default = router;
