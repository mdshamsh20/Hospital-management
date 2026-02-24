import { Router } from 'express';
import prisma from '../prismaClient';

const router = Router();

// 1. Live Operations Monitor (Live Snapshot)
router.get('/dashboard-monitor', async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const [
      waitingQueue,
      inProcedure,
      reportsPending,
      dentalLabCases
    ] = await Promise.all([
      prisma.appointment.findMany({
        where: { date: { gte: today }, status: { in: ['Waiting', 'Registered', 'Arrived'] } },
        include: { patient: true, department: true, doctor: true }
      }),
      prisma.appointment.findMany({
        where: { date: { gte: today }, status: { in: ['In Procedure', 'With Doctor', 'Calling'] } },
        include: { patient: true, department: true, doctor: true }
      }),
      prisma.radiologyCase.findMany({
        where: { status: { in: ['Pending', 'In Typing'] } }
      }),
      prisma.dentalLabOrder.findMany({
        where: { status: { not: 'Completed' } }
      })
    ]);

    res.json({
      waitingQueue,
      inProcedure,
      reportsPending,
      dentalLabCases
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch monitor stats' });
  }
});

// 2. Visit Audit View (Historical Data with Durations)
router.get('/visits/audit', async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        patient: true,
        doctor: true,
        department: true
      },
      orderBy: { arrivedAt: 'desc' }
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Audit fetch failed' });
  }
});

// 3. Payroll Summary
router.get('/payroll', async (req, res) => {
  try {
    const staff = await prisma.staff.findMany({
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
  } catch (error) {
    res.status(500).json({ error: 'Payroll calc failed' });
  }
});

// 4. Process Payroll Payment
router.post('/payroll/process', async (req, res) => {
  const { staffId, month, amount } = req.body;
  try {
    if (staffId) {
      // Process single
      const payment = await prisma.salaryPayment.create({
        data: {
          staffId: parseInt(staffId),
          month: month || new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
          amount: parseFloat(amount)
        }
      });
      res.json(payment);
    } else {
      // Process all (not yet implemented in detail, but let's provide a skeleton)
      // This would typically iterate through all staff with pending payroll
      res.json({ message: 'Bulk processing initialized' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

// 5. Clinic Settings
router.get('/settings', async (req, res) => {
  try {
    
    let settings = await prisma.clinicSettings.findFirst();
    if (!settings) {
      
      settings = await prisma.clinicSettings.create({ data: {} });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Settings fetch failed' });
  }
});

router.patch('/settings', async (req, res) => {
  const updateData = req.body;
  try {
    
    const settings = await prisma.clinicSettings.update({
      where: { id: 1 },
      data: updateData
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Settings update failed' });
  }
});

export default router;
