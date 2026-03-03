import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { validate } from '../middleware/validate';

const labOrderSchema = z.object({
  patientName: z.string().min(1, "Patient name is required"),
  treatmentType: z.string().min(1, "Treatment type is required"),
  expectedReturn: z.string().optional().nullable(),
  cost: z.number().or(z.string()).optional().nullable(),
  notes: z.string().optional().nullable()
});

const dentalCaseSchema = z.object({
  patientName: z.string().min(1, "Patient name is required"),
  type: z.string().min(1, "Type is required"),
  status: z.string().min(1, "Status is required"),
  date: z.string().optional().nullable()
});

const router = Router();
const prisma = new PrismaClient();

// Deprecated: Radiology routes removed and handled by reports.ts

// Dental Lab Orders (NEW)
router.get('/lab-orders', async (req, res) => {
  try {
    const orders = await prisma.dentalLabOrder.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lab orders' });
  }
});

router.post('/lab-orders', validate(labOrderSchema), async (req, res) => {
  const { patientName, treatmentType, expectedReturn, cost, notes } = req.body;
  try {
    const order = await prisma.dentalLabOrder.create({
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to create lab order' });
  }
});

router.patch('/lab-orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, actualReturn } = req.body;
  try {
    const order = await prisma.dentalLabOrder.update({
      where: { id: parseInt(id) },
      data: { 
        status,
        actualReturn: actualReturn ? new Date(actualReturn) : undefined,
        sentToLabDate: status === 'Sent to Lab' ? new Date() : undefined
      },
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update lab order status' });
  }
});

// Dental Cases
router.get('/dental', async (req, res) => {
  try {
    const cases = await prisma.dentalCase.findMany({
      orderBy: { date: 'desc' },
    });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dental cases' });
  }
});

router.post('/dental', validate(dentalCaseSchema), async (req, res) => {
  const { patientName, type, status, date } = req.body;
  try {
    const dentalCase = await prisma.dentalCase.create({
      data: {
        patientName,
        type,
        status,
        date: date ? new Date(date) : new Date(),
      },
    });
    res.json(dentalCase);
  } catch (error) {
    res.status(500).json({ error: 'Failed to record dental case' });
  }
});

// End of cases routes

export default router;
