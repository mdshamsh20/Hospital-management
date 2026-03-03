import { Router } from 'express';
import prisma from '../prismaClient';

const router = Router();

// Reception Dashboard Stats
router.get('/dashboard-stats', async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const twentyMinsAgo = new Date(Date.now() - 20 * 60000);

  try {
    const [
      appointmentsTodayCount,
      waitingQueue,
      reportsReadyCount,
      dentalFollowUpsCount,
      doctors,
      delayedCount
    ] = await Promise.all([
      prisma.appointment.count({
        where: { date: today }
      }),
      prisma.appointment.findMany({
        where: { 
          date: today, 
          status: { in: ['Registered', 'Waiting'] } 
        },
        include: { patient: true },
        orderBy: { token: 'asc' }
      }),
      prisma.medicalReport.count({
        where: { status: 'Final' }
      }),
      (prisma.dentalLabOrder as any).count({
        where: { 
          status: { in: ['Ready for Fit', 'Fabrication Scheduled'] },
          expectedReturn: { lte: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
        }
      }),
      prisma.doctor.findMany(),
      prisma.appointment.count({
        where: { 
          date: today, 
          status: 'Waiting', 
          arrivedAt: { lte: twentyMinsAgo } 
        }
      })
    ]);

    res.json({
      appointmentsToday: { length: appointmentsTodayCount },
      waitingQueue,
      reportsReady: { length: reportsReadyCount },
      dentalFollowUps: { length: dentalFollowUpsCount },
      doctors,
      delayedCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch receptionist stats' });
  }
});

// Update Doctor Availability
router.patch('/doctors/:id/availability', async (req, res) => {
  const { id } = req.params;
  const { availability } = req.body; // Available, Busy, On Break
  try {
    const updated = await (prisma.doctor as any).update({
      where: { id: parseInt(id) },
      data: { availability }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update availability' });
  }
});

// Update Radiology Report Delivery (Receptionist Action)
router.patch('/reports/:id/deliver', async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await prisma.medicalReport.update({
      where: { id: parseInt(id) },
      data: { status: 'Delivered' }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Delivery update failed' });
  }
});

// Update Dental Lab Order Action (Receptionist Action)
router.patch('/dental-orders/:id/action', async (req, res) => {
  const { id } = req.params;
  const { action, followUpDate } = req.body;
  try {
    const updated = await (prisma.dentalLabOrder as any).update({
      where: { id: parseInt(id) },
      data: { 
        receptionAction: action,
        followUpDate: followUpDate ? new Date(followUpDate) : undefined
      }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Action update failed' });
  }
});

export default router;
