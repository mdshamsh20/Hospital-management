"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffSchema = void 0;
const zod_1 = require("zod");
exports.staffSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
        role: zod_1.z.string().min(1, 'Role is required'),
        contact: zod_1.z.string().min(10, 'Contact must be at least 10 digits'),
        salary: zod_1.z.coerce.number().positive('Salary must be a positive number'),
        joiningDate: zod_1.z.string().optional().or(zod_1.z.date().optional()),
    }),
});
