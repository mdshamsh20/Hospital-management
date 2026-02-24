import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Radiology Cases
router.get('/radiology', async (req, res) => {
  try {
    const cases = await prisma.radiologyCase.findMany({
      orderBy: { date: 'desc' },
    });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch radiology cases' });
  }
});

router.patch('/radiology/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Draft, Typing, Completed, Delivered
  try {
    const radiologyCase = await prisma.radiologyCase.update({
      where: { id: parseInt(id) },
      data: { status },
    });
    res.json(radiologyCase);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update radiology status' });
  }
});

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

router.post('/lab-orders', async (req, res) => {
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

router.post('/dental', async (req, res) => {
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

export default router;
