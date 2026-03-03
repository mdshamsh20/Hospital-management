import { Router } from 'express';
import prisma from '../prismaClient';
import { validate } from '../middleware/validate';
import { createAppointmentSchema } from '../validations/appointment';
import { sendSuccess } from '../utils/response';

const router = Router();

// Get all appointments with patient details
router.get('/', async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const appointments = await prisma.appointment.findMany({
    where: {
      date: {
        gte: today
      }
    },
    include: {
      patient: true
    },
    orderBy: {
      token: 'asc'
    }
  });
  res.json(appointments);
});

// Register new patient and/or book appointment
router.post('/register', validate(createAppointmentSchema), async (req, res) => {
  const { 
    name, age, gender, phone, 
    departmentId, doctorId, visitType, 
    priority, referredBy, isWalkIn,
    message, serviceCharge, notes 
  } = req.body;

  // 1. Find or create patient
  let patient = await prisma.patient.findUnique({
    where: { phone }
  });

  if (!patient) {
    patient = await prisma.patient.create({
      data: {
        name,
        age: age ? parseInt(age as string) : null,
        gender: gender || null,
        phone
      }
    });
  }

  // 2. Determine appointment date
  const apptDate = req.body.preferredDate || req.body.date ? new Date(req.body.preferredDate || req.body.date) : new Date();
  apptDate.setHours(0, 0, 0, 0);

  // 3. Generate token for the specific date
  const lastAppt = await prisma.appointment.findFirst({
    where: { date: apptDate },
    orderBy: { token: 'desc' }
  });
  const nextToken = ((lastAppt as any)?.token || 0) + 1;

  // 4. Create appointment
  const appointment = await prisma.appointment.create({
    data: {
      patientId: patient.id,
      departmentId: departmentId ? parseInt(departmentId as string) : null,
      doctorId: doctorId ? parseInt(doctorId as string) : null,
      visitType: visitType || 'Consultation',
      priority: priority || 'Normal',
      referredBy,
      isWalkIn: isWalkIn ?? true,
      notes,
      message,
      serviceCharge: serviceCharge ? parseFloat(serviceCharge as string) : 0,
      token: nextToken,
      date: apptDate,
      status: 'Registered'
    },
    include: { patient: true }
  });

  // 4. Audit Log
  await prisma.auditLog.create({
    data: {
      action: 'Patient Registered',
      module: 'Reception',
      details: `Token ${nextToken} issued for ${name}`
    }
  });

  sendSuccess(res, appointment, 'Appointment created successfully', 201);
});

// Update appointment status (Granular Lifecycle)
router.patch('/:id/status', async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  const now = new Date();
  
  let data: any = { status };
  
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
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// Update billing
router.patch('/:id/billing', async (req, res, next) => {
  const { id } = req.params;
  const { paymentStatus, serviceCharge } = req.body;
  try {
    const appointmentId = parseInt(id);
    const parsedCharge = serviceCharge ? parseFloat(serviceCharge) : undefined;
    
    const updated = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { 
        // @ts-ignore
        paymentStatus,
        serviceCharge: parsedCharge
      },
      include: { doctor: true, patient: true }
    });

    // Dynamic Commission Generation using Global Settings
    if (paymentStatus === 'Paid' && updated.doctorId && updated.serviceCharge) {
      const settings = await prisma.clinicSettings.findFirst() || { doctorComm: 60 };
      const percentage = settings.doctorComm;
      const commissionAmount = (updated.serviceCharge * percentage) / 100;
      const monthString = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

      await prisma.commissionRecord.upsert({
        where: { appointmentId },
        create: {
          appointmentId: appointmentId,
          doctorName: updated.doctor?.name || 'Unknown',
          patientName: updated.patient?.name || 'Unknown',
          totalBilling: updated.serviceCharge,
          commissionAmount: commissionAmount,
          percentage: percentage,
          type: 'Consultation',
          status: 'Pending',
          month: monthString
        },
        update: {
          totalBilling: updated.serviceCharge,
          commissionAmount: commissionAmount,
          percentage: percentage,
          status: 'Pending'
        }
      });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// Delete appointment
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    await prisma.appointment.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Appointment removed' });
  } catch (error) {
    next(error);
  }
});

// Update token number
router.patch('/:id/token', async (req, res, next) => {
  const { id } = req.params;
  const { token } = req.body;
  try {
    const updated = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: { token: parseInt(token) }
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

export default router;
