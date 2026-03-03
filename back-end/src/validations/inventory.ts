import { z } from 'zod';

export const createInventoryItemSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Item name is required'),
    category: z.string().optional(),
    stock: z.coerce.number().int().min(0, 'Initial stock cannot be negative'),
    unit: z.string().optional(),
    expiryDate: z.string().optional().or(z.date().optional()),
  }),
});

export const purchaseRecordSchema = z.object({
  body: z.object({
    itemId: z.coerce.number().int().positive(),
    quantity: z.coerce.number().int().positive('Quantity must be positive'),
    cost: z.coerce.number().positive('Cost must be positive'),
    date: z.string().optional().or(z.date().optional()),
  }),
});

export const consumptionRecordSchema = z.object({
  body: z.object({
    itemId: z.coerce.number().int().positive(),
    quantity: z.coerce.number().int().positive('Quantity must be positive'),
    usedFor: z.string().optional(),
    date: z.string().optional().or(z.date().optional()),
  }),
});
