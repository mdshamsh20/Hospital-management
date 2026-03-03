"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTokenSchema = exports.createAppointmentSchema = void 0;
const zod_1 = require("zod");
exports.createAppointmentSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
        phone: zod_1.z.string().min(10, 'Phone must be at least 10 digits'),
        age: zod_1.z.coerce.number().min(0).max(120),
        gender: zod_1.z.enum(['Male', 'Female', 'Other']),
        departmentId: zod_1.z.coerce.number().optional(),
        doctorId: zod_1.z.coerce.number().optional(),
        visitType: zod_1.z.string().optional(),
        priority: zod_1.z.enum(['Normal', 'Urgent']).optional(),
        isWalkIn: zod_1.z.boolean().optional(),
    }),
});
exports.updateTokenSchema = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.number().int().positive(),
    }),
    params: zod_1.z.object({
        id: zod_1.z.string(),
    }),
});
