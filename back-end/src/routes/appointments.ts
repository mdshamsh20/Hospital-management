import { Router } from 'express';
import prisma from '../prismaClient';

const router = Router();

// Get all appointments with patient details
router.get('/', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // @ts-ignore - Prisma client needs to be regenerated to see new fields
    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: today
        }
      },
      include: {
        // @ts-ignore
        patient: true
      },
      orderBy: {
        // @ts-ignore
        token: 'asc'
      }
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Register new patient and/or book appointment
router.post('/register', async (req, res) => {
  const { 
    name, age, gender, phone, 
    departmentId, doctorId, visitType, 
    priority, referredBy, isWalkIn,
    message, serviceCharge, notes 
  } = req.body;

  try {
    // 1. Find or create patient
    // @ts-ignore
    let patient = await prisma.patient.findUnique({
      where: { phone }
    });

    if (!patient) {
      // @ts-ignore
      patient = await prisma.patient.create({
        data: {
          name,
          age: age ? parseInt(age) : null,
          gender: gender || null,
          phone
        }
      });
    }

    // 2. Generate token for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // @ts-ignore
    const lastAppt = await prisma.appointment.findFirst({
      where: { date: today },
      // @ts-ignore
      orderBy: { token: 'desc' }
    });
    const nextToken = ((lastAppt as any)?.token || 0) + 1;

    // 3. Create appointment
    // @ts-ignore
    const appointment = await prisma.appointment.create({
      data: {
        // @ts-ignore
        patientId: patient.id,
        departmentId: departmentId ? parseInt(departmentId) : null,
        doctorId: doctorId ? parseInt(doctorId) : null,
        // @ts-ignore
        visitType: visitType || 'Consultation',
        // @ts-ignore
        priority: priority || 'Normal',
        // @ts-ignore
        referredBy,
        // @ts-ignore
        isWalkIn: isWalkIn ?? true,
        // @ts-ignore
        notes,
        message,
        // @ts-ignore
        serviceCharge: serviceCharge ? parseFloat(serviceCharge) : 0,
        // @ts-ignore
        token: nextToken,
        date: today,
        // @ts-ignore
        status: 'Registered'
      }, // @ts-ignore
      include: { patient: true }
    });

    // 4. Audit Log
    // @ts-ignore
    await prisma.auditLog.create({
      data: {
        action: 'Patient Registered',
        module: 'Reception',
        details: `Token ${nextToken} issued for ${name}`
      }
    });

    res.json(appointment);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed', details: error instanceof Error ? error.message : String(error) });
  }
});

// Update appointment status (Granular Lifecycle)
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const now = new Date();
  
  let data: any = { status };
  
  // Logic: Registered -> Waiting -> With Doctor -> Procedure -> Completed -> Billing -> Closed
  if (status === 'With Doctor' || status === 'Procedure') {
    data.startedAt = now;
  } else if (status === 'Completed') {
    data.completedAt = now;
  }

  try {
    const updated = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data
    });

    // Automatically decrement inventory if status is 'Procedure' and type is specified?
    // This could be a future enhancement.

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Update billing
router.patch('/:id/billing', async (req, res) => {
  const { id } = req.params;
  const { paymentStatus, serviceCharge } = req.body;
  try {
    const updated = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: { 
        // @ts-ignore
        paymentStatus,
        // @ts-ignore
        serviceCharge: serviceCharge ? parseFloat(serviceCharge) : undefined 
      }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Billing update failed' });
  }
});

export default router;
