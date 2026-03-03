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
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Get all expenses
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expenses = yield prisma.expense.findMany({
            orderBy: { date: 'desc' },
        });
        res.json(expenses);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
}));
// Add expense
router.post('/', (0, auth_1.authorize)('SUPER_ADMIN'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, description, amount, date } = req.body;
    try {
        const expense = yield prisma.expense.create({
            data: {
                category,
                description,
                amount: parseFloat(amount),
                date: new Date(date),
            },
        });
        res.json(expense);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to record expense' });
    }
}));
// Delete expense
router.delete('/:id', (0, auth_1.authorize)('SUPER_ADMIN'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.expense.delete({
            where: { id: parseInt(id) },
        });
        res.json({ message: 'Expense deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete expense' });
    }
}));
exports.default = router;
