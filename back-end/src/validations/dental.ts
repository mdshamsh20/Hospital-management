import { z } from 'zod';

export const dentalPlanSchema = z.object({
  patientId: z.coerce.number(),
  patientName: z.string().min(2),
  primaryConcern: z.string().min(5),
  totalStages: z.coerce.number().min(1).optional(),
});

export const dentalSittingSchema = z.object({
  procedureDone: z.string().min(1),
  sittingNumber: z.coerce.number().min(1),
  toothNumber: z.string().optional().nullable(),
  materialUsed: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  status: z.enum(['Planned', 'Completed']).optional(),
});

export const dentalLabOrderSchema = z.object({
  patientName: z.string().min(2),
  treatmentType: z.string().min(2),
  labName: z.string().optional().nullable(),
  caseType: z.string().optional().nullable(),
  expectedReturn: z.string().optional().nullable(), // date string
});
