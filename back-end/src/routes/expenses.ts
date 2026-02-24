import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { date: 'desc' },
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// Add expense
router.post('/', async (req, res) => {
  const { category, description, amount, date } = req.body;
  try {
    const expense = await prisma.expense.create({
      data: {
        category,
        description,
        amount: parseFloat(amount),
        date: new Date(date),
      },
    });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to record expense' });
  }
});

// Delete expense
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.expense.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

export default router;
