import { z } from 'zod';

export const diagnosticOrderSchema = z.object({
  patientId: z.coerce.number(),
  appointmentId: z.coerce.number().optional().nullable(),
  type: z.enum(['X-Ray', 'Ultrasound']),
  testName: z.string().min(1),
  priority: z.enum(['Normal', 'Urgent']).optional(),
  cost: z.coerce.number().optional(),
});

export const medicalReportSchema = z.object({
  orderId: z.coerce.number().optional().nullable(),
  patientId: z.coerce.number(),
  serviceType: z.string(),
  findings: z.string().min(1),
  impression: z.string().min(1),
  recommendations: z.string().optional(),
  status: z.enum(['Draft', 'Final']).optional(),
});
