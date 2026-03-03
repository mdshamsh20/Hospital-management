import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

import { validate } from '../middleware/validate';
import { staffSchema } from '../validations/staff';

const router = Router();
const prisma = new PrismaClient();

// Get all staff
router.get('/', async (req, res) => {
  const staff = await prisma.staff.findMany({
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
});

// Add staff
router.post('/', validate(staffSchema), async (req, res) => {
  const { name, role, contact, salary, joiningDate } = req.body;
  const staff = await prisma.staff.create({
    data: {
      name,
      role,
      contact,
      salary: parseFloat(salary),
      joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
    },
  });
  res.json({ success: true, data: staff });
});

// Update staff
router.put('/:id', validate(staffSchema), async (req, res) => {
  const { id } = req.params;
  const { name, role, contact, salary } = req.body;
  const staff = await prisma.staff.update({
    where: { id: parseInt(id as string) },
    data: {
      name,
      role,
      contact,
      salary: parseFloat(salary),
    },
  });
  res.json({ success: true, data: staff });
});

// Delete staff
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.staff.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Staff deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete staff' });
  }
});

// Mark Check-in
router.post('/attendance/check-in', async (req, res) => {
  const { staffId } = req.body;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    // Check if already checked in
    const existing = await prisma.attendance.findFirst({
      where: {
        staffId: parseInt(staffId),
        date: today
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'Already checked in today' });
    }

    const attendance = await prisma.attendance.create({
      data: {
        staffId: parseInt(staffId),
        date: today,
        checkIn: new Date(),
        status: 'Present'
      }
    });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to check in' });
  }
});

// Mark Check-out
router.post('/attendance/check-out', async (req, res) => {
  const { staffId } = req.body;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const attendance = await prisma.attendance.findFirst({
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
    const workingHours = (checkOutTime.getTime() - attendance.checkIn!.getTime()) / (1000 * 60 * 60);

    const updated = await prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        checkOut: checkOutTime,
        workingHours: parseFloat(workingHours.toFixed(2))
      }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to check out' });
  }
});

// Legacy Record Attendance (Manual)
router.post('/attendance', async (req, res) => {
  const { staffId, status, date } = req.body;
  try {
    const attendance = await prisma.attendance.create({
      data: {
        staffId: parseInt(staffId),
        status,
        date: new Date(date),
      },
    });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
});

// Record Salary Payment
router.post('/salaries', async (req, res) => {
  const { staffId, month, amount, date } = req.body;
  try {
    const salary = await prisma.salaryPayment.create({
      data: {
        staffId: parseInt(staffId),
        month,
        amount: parseFloat(amount),
        date: new Date(date),
      },
    });
    res.json(salary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to record salary' });
  }
});

export default router;
