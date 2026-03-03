"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dentalLabOrderSchema = exports.dentalSittingSchema = exports.dentalPlanSchema = void 0;
const zod_1 = require("zod");
exports.dentalPlanSchema = zod_1.z.object({
    patientId: zod_1.z.coerce.number(),
    patientName: zod_1.z.string().min(2),
    primaryConcern: zod_1.z.string().min(5),
    totalStages: zod_1.z.coerce.number().min(1).optional(),
});
exports.dentalSittingSchema = zod_1.z.object({
    procedureDone: zod_1.z.string().min(1),
    sittingNumber: zod_1.z.coerce.number().min(1),
    toothNumber: zod_1.z.string().optional().nullable(),
    materialUsed: zod_1.z.string().optional().nullable(),
    notes: zod_1.z.string().optional().nullable(),
    status: zod_1.z.enum(['Planned', 'Completed']).optional(),
});
exports.dentalLabOrderSchema = zod_1.z.object({
    patientName: zod_1.z.string().min(2),
    treatmentType: zod_1.z.string().min(2),
    labName: zod_1.z.string().optional().nullable(),
    caseType: zod_1.z.string().optional().nullable(),
    expectedReturn: zod_1.z.string().optional().nullable(), // date string
});
