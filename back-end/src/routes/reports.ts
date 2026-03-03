import { Router } from 'express';
import prisma from '../prismaClient';
import { validate } from '../middleware/validate';
import { authorize } from '../middleware/auth';
import { diagnosticOrderSchema, medicalReportSchema } from '../validations/reports';
import { sendSuccess } from '../utils/response';

const router = Router();

// --- Diagnostic Orders ---

// Create a new diagnostic order (X-Ray / Ultrasound)
router.post('/orders', validate(diagnosticOrderSchema), async (req, res) => {
  const data = req.body;
  const order = await prisma.diagnosticOrder.create({
    data: {
      patientId: data.patientId,
      appointmentId: data.appointmentId,
      type: data.type,
      testName: data.testName,
      priority: data.priority || 'Normal',
      cost: data.cost || 0,
      status: 'Pending'
    },
    include: { patient: true }
  });
  sendSuccess(res, order, 'Diagnostic Order Initiated');
});

// Get all orders (for technician view)
router.get('/orders', async (req, res) => {
  const orders = await prisma.diagnosticOrder.findMany({
    include: { 
      patient: true,
      report: true
    },
    orderBy: { createdAt: 'desc' }
  });
  sendSuccess(res, orders);
});

// Update order status (In Progress, Completed)
router.patch('/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, technicianName, notes } = req.body;
  const updated = await prisma.diagnosticOrder.update({
    where: { id: parseInt(id) },
    data: { status, technicianName, notes }
  });
  sendSuccess(res, updated, `Workflow: Order marked as ${status}`);
});

// --- Medical Reports ---

// Get all finalized reports (for Reports module)
router.get('/', async (req, res) => {
  const reports = await prisma.medicalReport.findMany({
    include: { 
      patient: true,
      order: true
    },
    orderBy: { createdAt: 'desc' }
  });
  sendSuccess(res, reports);
});

// Create/Update draft report
router.post('/', validate(medicalReportSchema), async (req, res) => {
  const data = req.body;
  const report = await prisma.medicalReport.upsert({
    where: { orderId: data.orderId || -1 },
    update: {
      findings: data.findings,
      impression: data.impression,
      recommendations: data.recommendations,
      status: data.status || 'Under Review', // Default to Under Review for Admin check
      finalizedAt: data.status === 'Final' ? new Date() : null
    },
    create: {
      orderId: data.orderId,
      patientId: data.patientId,
      serviceType: data.serviceType,
      findings: data.findings,
      impression: data.impression,
      recommendations: data.recommendations,
      status: data.status || 'Under Review'
    }
  });
  sendSuccess(res, report, data.status === 'Final' ? "Report Finalized." : "Report Submitted for Review.");
});

// Admin-only: Finalize report
router.patch('/:id/finalize', authorize('ADMIN', 'SUPER_ADMIN'), async (req, res) => {
  const { id } = req.params;
  const { finalizedBy } = req.body;
  const updated = await prisma.medicalReport.update({
    where: { id: parseInt(id as string) },
    data: { 
      status: 'Final', 
      finalizedAt: new Date(),
      finalizedBy: finalizedBy || 'Admin'
    }
  });
  sendSuccess(res, updated, 'Report marked as Final');
});

// Super Admin-only: Reopen a finalized report
router.patch('/:id/reopen', authorize('SUPER_ADMIN'), async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  
  const updated = await prisma.medicalReport.update({
    where: { id: parseInt(id as string) },
    data: {
      status: 'Under Review',
      finalizedAt: null,
      finalizedBy: null,
      // Ideally log reason in audit or comments if schema supported it
    }
  });
  sendSuccess(res, updated, 'Report reopened and returned to Review state');
});

// Delete a report
router.delete('/:id', authorize('SUPER_ADMIN'), async (req, res) => {
  const { id } = req.params;
  await prisma.medicalReport.delete({ where: { id: parseInt(id as string) } });
  sendSuccess(res, null, 'Report deleted');
});

export default router;
