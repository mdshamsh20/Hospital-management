import { z } from 'zod';

export const staffSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    role: z.string().min(1, 'Role is required'),
    contact: z.string().min(10, 'Contact must be at least 10 digits'),
    salary: z.coerce.number().positive('Salary must be a positive number'),
    joiningDate: z.string().optional().or(z.date().optional()),
  }),
});
