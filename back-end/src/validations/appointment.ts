import { z } from 'zod';

export const createAppointmentSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().min(10, 'Phone must be at least 10 digits'),
    age: z.coerce.number().min(0).max(120),
    gender: z.enum(['Male', 'Female', 'Other']),
    departmentId: z.coerce.number().optional(),
    doctorId: z.coerce.number().optional(),
    visitType: z.string().optional(),
    priority: z.enum(['Normal', 'Urgent']).optional(),
    isWalkIn: z.boolean().optional(),
  }),
});

export const updateTokenSchema = z.object({
  body: z.object({
    token: z.number().int().positive(),
  }),
  params: z.object({
    id: z.string(),
  }),
});
