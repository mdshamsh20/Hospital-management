import { z } from 'zod';

export const staffSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.string().min(1, 'Role is required'),
  contact: z.string().min(10, 'Contact must be at least 10 digits'),
  salary: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Salary must be a positive number',
  }),
  joiningDate: z.string().min(1, 'Joining date is required'),
});

export type StaffSchema = z.infer<typeof staffSchema>;

export const appointmentSchema = z.object({
  name: z.string().min(2, 'Patient name is required'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: 'Age must be a positive number',
  }),
  gender: z.enum(['Male', 'Female', 'Other']),
  departmentId: z.string().min(1, 'Please select department'),
  doctorId: z.string().min(1, 'Please select doctor'),
  visitType: z.string().optional().nullable(),
  priority: z.enum(['Normal', 'Urgent']).optional().default('Normal'),
  isWalkIn: z.boolean().optional().default(true),
  message: z.string().optional().nullable(),
});

export type AppointmentSchema = z.infer<typeof appointmentSchema>;

export const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Invalid phone number'),
  email: z.string().email().optional().nullable().or(z.literal('')),
  departmentId: z.string().min(1, 'Please select department'),
  doctorId: z.string().optional().nullable(),
  preferredDate: z.string().min(1, 'Please select a date'),
  preferredTime: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type BookingSchema = z.infer<typeof bookingSchema>;

// Radiology/Diagnostics
export const diagnosticOrderSchema = z.object({
  patientName: z.string().min(2, "Patient name is required"),
  type: z.enum(['X-Ray', 'Ultrasound']),
  testName: z.string().min(1, "Specific test name is required"),
  priority: z.enum(['Normal', 'Urgent']),
  patientId: z.number().optional().default(1),
});

export type DiagnosticOrderSchema = z.infer<typeof diagnosticOrderSchema>;

export const medicalReportSchema = z.object({
  findings: z.string().min(10, "Findings must be detailed"),
  impression: z.string().min(5, "Impression is required"),
  recommendations: z.string().optional(),
  status: z.enum(['Draft', 'Final']),
  orderId: z.number(),
  patientId: z.number(),
  serviceType: z.string(),
});

export type MedicalReportSchema = z.infer<typeof medicalReportSchema>;

// Dental
export const dentalPlanSchema = z.object({
  patientId: z.number(),
  patientName: z.string().min(2),
  primaryConcern: z.string().min(5),
  totalStages: z.number().min(1),
});

export type DentalPlanSchema = z.infer<typeof dentalPlanSchema>;

export const dentalSittingSchema = z.object({
  procedureDone: z.string().min(1, "Procedure is required"),
  toothNumber: z.string().optional(),
  materialUsed: z.string().optional(),
  notes: z.string().min(5, "Clinical notes are required"),
  status: z.enum(['Planned', 'Completed']).default('Completed'),
});

export type DentalSittingSchema = z.infer<typeof dentalSittingSchema>;

export const dentalLabOrderSchema = z.object({
  patientName: z.string().min(2, "Patient Name is required"),
  treatmentType: z.string().min(2, "Treatment Type is required"),
  labName: z.string().optional(),
  caseType: z.string().optional(),
  expectedReturn: z.string().optional(), // date string
});

export type DentalLabOrderSchema = z.infer<typeof dentalLabOrderSchema>;
