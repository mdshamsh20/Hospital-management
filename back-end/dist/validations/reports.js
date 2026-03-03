"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.medicalReportSchema = exports.diagnosticOrderSchema = void 0;
const zod_1 = require("zod");
exports.diagnosticOrderSchema = zod_1.z.object({
    patientId: zod_1.z.coerce.number(),
    appointmentId: zod_1.z.coerce.number().optional().nullable(),
    type: zod_1.z.enum(['X-Ray', 'Ultrasound']),
    testName: zod_1.z.string().min(1),
    priority: zod_1.z.enum(['Normal', 'Urgent']).optional(),
    cost: zod_1.z.coerce.number().optional(),
});
exports.medicalReportSchema = zod_1.z.object({
    orderId: zod_1.z.coerce.number().optional().nullable(),
    patientId: zod_1.z.coerce.number(),
    serviceType: zod_1.z.string(),
    findings: zod_1.z.string().min(1),
    impression: zod_1.z.string().min(1),
    recommendations: zod_1.z.string().optional(),
    status: zod_1.z.enum(['Draft', 'Final']).optional(),
});
