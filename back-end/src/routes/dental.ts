import { Router } from 'express';
import prisma from '../prismaClient';
import { validate } from '../middleware/validate';
import { dentalPlanSchema, dentalSittingSchema, dentalLabOrderSchema } from '../validations/dental';
import { sendSuccess } from '../utils/response';

const router = Router();

// --- Dental Treatment Plans ---

// Create a new treatment plan
router.post('/plans', validate(dentalPlanSchema), async (req, res) => {
  const data = req.body;
  const plan = await prisma.dentalTreatmentPlan.create({
    data: {
      patientId: data.patientId,
      patientName: data.patientName,
      primaryConcern: data.primaryConcern,
      totalStages: data.totalStages || 1,
      status: 'Active'
    }
  });
  sendSuccess(res, plan, 'Dental Treatment Plan Initiated');
});

// Get all treatment plans
router.get('/plans', async (req, res) => {
  const plans = await prisma.dentalTreatmentPlan.findMany({
    include: { 
      sittings: true,
      patient: true 
    },
    orderBy: { createdAt: 'desc' }
  });
  sendSuccess(res, plans);
});

// --- Dental Sittings ---

// Add a sitting to a plan
router.post('/plans/:id/sittings', validate(dentalSittingSchema), async (req, res) => {
  const id = req.params.id as string;
  const data = req.body;
  const sitting = await prisma.dentalSitting.create({
    data: {
      planId: parseInt(id),
      sittingNumber: data.sittingNumber,
      procedureDone: data.procedureDone,
      toothNumber: data.toothNumber,
      materialUsed: data.materialUsed,
      notes: data.notes,
      status: data.status || 'Completed'
    }
  });
  sendSuccess(res, sitting, 'Sitting Committed: Record added to treatment plan.');
});

// Update a sitting
router.patch('/sittings/:id', async (req, res) => {
  const { id } = req.params;
  const { procedureDone, toothNumber, materialUsed, notes, status } = req.body;
  const updated = await prisma.dentalSitting.update({
    where: { id: parseInt(id) },
    data: { procedureDone, toothNumber, materialUsed, notes, status }
  });
  sendSuccess(res, updated);
});

// --- Dental Lab Orders ---
router.post('/lab-orders', validate(dentalLabOrderSchema), async (req, res) => {
  const data = req.body;
  const labOrder = await (prisma.dentalLabOrder as any).create({
    data: {
      patientName: data.patientName,
      treatmentType: data.treatmentType,
      labName: data.labName || 'Internal Lab',
      caseType: data.caseType || 'Generic',
      expectedReturn: data.expectedReturn ? new Date(data.expectedReturn) : null,
      status: 'Sent to Lab'
    }
  });
  sendSuccess(res, labOrder, 'Lab Order Initiated successfully.');
});

export default router;
