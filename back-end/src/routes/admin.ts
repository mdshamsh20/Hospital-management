import { Router, Request } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../prismaClient';
import { authorize } from '../middleware/auth';

// Custom type based on how we attached it in auth.ts
interface AuthRequest extends Request {
  user?: { userId: number; role: string; email: string };
}

const router = Router();

// 1. Live Operations Monitor (Enhanced for Ops Admin)
router.get('/dashboard-monitor', async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monthString = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  try {
    const [
      waitingQueue,
      inProcedure,
      reportsPendingReview,
      finalizedToday,
      monthlyCommission,
      sampleRevenueToday
    ] = await Promise.all([
      prisma.appointment.count({
        where: { date: { gte: today }, status: { in: ['Waiting', 'Registered', 'Arrived'] } }
      }),
      prisma.appointment.count({
        where: { date: { gte: today }, status: { in: ['In Procedure', 'With Doctor', 'Calling'] } }
      }),
      prisma.medicalReport.count({ where: { status: 'Under Review' } }),
      prisma.medicalReport.count({ 
        where: { status: 'Final', finalizedAt: { gte: today } } 
      }),
      prisma.commissionRecord.aggregate({
        where: { month: monthString },
        _sum: { commissionAmount: true }
      }),
      prisma.sampleCollection.aggregate({
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
router.get('/payroll', authorize('SUPER_ADMIN'), async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const monthString = now.toLocaleString('default', { month: 'long', year: 'numeric' });

    // Define start and end of current month
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

    const staff = await prisma.staff.findMany({
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
  } catch (error) {
    console.error('Payroll calculation error:', error);
    res.status(500).json({ error: 'Payroll calc failed' });
  }
});

// 4. Process Payroll Payment
router.post('/payroll/process', authorize('SUPER_ADMIN'), async (req, res) => {
  const { staffId, month, amount } = req.body;
  const monthString = month || new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  try {
    if (staffId) {
      // Check if already paid
      const existing = await prisma.salaryPayment.findFirst({
        where: { staffId: parseInt(staffId), month: monthString }
      });

      if (existing) {
        return res.status(400).json({ error: 'Salary already processed for this month' });
      }

      const payment = await prisma.salaryPayment.create({
        data: {
          staffId: parseInt(staffId),
          month: monthString,
          amount: parseFloat(amount)
        }
      });
      res.json(payment);
    } else {
      // Process all
      const staff = await prisma.staff.findMany({
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

      const result = await prisma.salaryPayment.createMany({
        data: paymentsToCreate
      });

      res.json({ message: `Successfully processed ${result.count} payments`, count: result.count });
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

// 5. Clinic Settings
router.get('/settings', authorize('SUPER_ADMIN'), async (req, res) => {
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

router.patch('/settings', authorize('SUPER_ADMIN'), async (req, res) => {
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

// 6. Sample Collection Tracking
router.get('/samples', async (req, res) => {
  const samples = await prisma.sampleCollection.findMany({
    orderBy: { collectionDate: 'desc' }
  });
  res.json(samples);
});

router.post('/samples', async (req, res) => {
  const data = req.body;
  const sample = await prisma.sampleCollection.create({
    data: {
      ...data,
      margin: (data.amountCollected || 0) - (data.labPayment || 0)
    }
  });
  res.json(sample);
});

router.patch('/samples/:id', async (req, res) => {
  const { id } = req.params;
  const updated = await prisma.sampleCollection.update({
    where: { id: parseInt(id) },
    data: req.body
  });
  res.json(updated);
});

// 7. Commission Management
router.get('/commissions', async (req, res) => {
  const { month } = req.query;
  const currentMonth = month as string || new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  
  const records = await prisma.commissionRecord.findMany({
    where: { month: currentMonth },
    orderBy: { createdAt: 'desc' }
  });
  res.json(records);
});

router.post('/commissions/approve', authorize('ADMIN', 'SUPER_ADMIN'), async (req, res) => {
  const { ids } = req.body;
  const updated = await prisma.commissionRecord.updateMany({
    where: { id: { in: ids } },
    data: { status: 'Approved', approvedAt: new Date() }
  });
  res.json({ message: `Approved ${updated.count} records` });
});

// 8. System Access Control (Super Admin Only: Manage Users)
router.get('/users', async (req: AuthRequest, res: any) => {
  if (req.user?.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Only Super Admin can view system users' });
  }
  const users = await prisma.users.findMany({
    select: { id: true, email: true, role: true }
  });
  res.json(users);
});

router.post('/users', async (req: AuthRequest, res: any) => {
  if (req.user?.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Only Super Admin can create system users' });
  }

  const { email, password, role } = req.body;
  
  const existing = await prisma.users.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newUser = await prisma.users.create({
    data: {
      email,
      password: hashedPassword,
      role: role || 'RECEPTIONIST'
    } as any
  });
  
  res.json({ id: newUser.id, email: newUser.email, role: newUser.role });
});

router.delete('/users/:id', async (req: AuthRequest, res: any) => {
  if (req.user?.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Only Super Admin can delete system users' });
  }
  
  const targetId = parseInt(req.params.id as string);
  
  if (targetId === req.user.userId) {
    return res.status(400).json({ error: 'You cannot delete your own account' });
  }
  
  await prisma.users.delete({ where: { id: targetId } });
  res.json({ message: 'User removed successfully' });
});

export default router;
