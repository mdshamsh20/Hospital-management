"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumptionRecordSchema = exports.purchaseRecordSchema = exports.createInventoryItemSchema = void 0;
const zod_1 = require("zod");
exports.createInventoryItemSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Item name is required'),
        category: zod_1.z.string().optional(),
        stock: zod_1.z.coerce.number().int().min(0, 'Initial stock cannot be negative'),
        unit: zod_1.z.string().optional(),
        expiryDate: zod_1.z.string().optional().or(zod_1.z.date().optional()),
    }),
});
exports.purchaseRecordSchema = zod_1.z.object({
    body: zod_1.z.object({
        itemId: zod_1.z.coerce.number().int().positive(),
        quantity: zod_1.z.coerce.number().int().positive('Quantity must be positive'),
        cost: zod_1.z.coerce.number().positive('Cost must be positive'),
        date: zod_1.z.string().optional().or(zod_1.z.date().optional()),
    }),
});
exports.consumptionRecordSchema = zod_1.z.object({
    body: zod_1.z.object({
        itemId: zod_1.z.coerce.number().int().positive(),
        quantity: zod_1.z.coerce.number().int().positive('Quantity must be positive'),
        usedFor: zod_1.z.string().optional(),
        date: zod_1.z.string().optional().or(zod_1.z.date().optional()),
    }),
});
