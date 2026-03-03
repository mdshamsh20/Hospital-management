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
// Deprecated: Radiology routes removed and handled by reports.ts
// Dental Lab Orders (NEW)
router.get('/lab-orders', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield prisma.dentalLabOrder.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch lab orders' });
    }
}));
router.post('/lab-orders', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { patientName, treatmentType, expectedReturn, cost, notes } = req.body;
    try {
        const order = yield prisma.dentalLabOrder.create({
            data: {
                patientName,
                treatmentType,
                expectedReturn: expectedReturn ? new Date(expectedReturn) : null,
                cost: cost ? parseFloat(cost) : null,
                notes,
                status: 'Impression Taken'
            },
        });
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create lab order' });
    }
}));
router.patch('/lab-orders/:id/status', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status, actualReturn } = req.body;
    try {
        const order = yield prisma.dentalLabOrder.update({
            where: { id: parseInt(id) },
            data: {
                status,
                actualReturn: actualReturn ? new Date(actualReturn) : undefined,
                sentToLabDate: status === 'Sent to Lab' ? new Date() : undefined
            },
        });
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update lab order status' });
    }
}));
// Dental Cases
router.get('/dental', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cases = yield prisma.dentalCase.findMany({
            orderBy: { date: 'desc' },
        });
        res.json(cases);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch dental cases' });
    }
}));
router.post('/dental', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { patientName, type, status, date } = req.body;
    try {
        const dentalCase = yield prisma.dentalCase.create({
            data: {
                patientName,
                type,
                status,
                date: date ? new Date(date) : new Date(),
            },
        });
        res.json(dentalCase);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to record dental case' });
    }
}));
// End of cases routes
exports.default = router;
