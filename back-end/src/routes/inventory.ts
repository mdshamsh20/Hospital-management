import { Router } from 'express';
import prisma from '../prismaClient';
import { validate } from '../middleware/validate';
import { createInventoryItemSchema, purchaseRecordSchema, consumptionRecordSchema } from '../validations/inventory';

const router = Router();

// Get all inventory items
router.get('/', async (req, res) => {
  const items = await prisma.inventoryItem.findMany({
    include: {
      purchases: {
        orderBy: { date: 'desc' },
        take: 5
      },
      consumptions: {
        orderBy: { date: 'desc' },
        take: 10
      }
    }
  });
  res.json(items);
});

// Add inventory item
router.post('/', validate(createInventoryItemSchema), async (req, res) => {
  const { name, category, stock, unit, expiryDate } = req.body;
  const item = await prisma.inventoryItem.create({
    data: {
      name,
      category,
      stock: parseInt(stock as string),
      unit,
      expiryDate: expiryDate ? new Date(expiryDate as string) : null,
    },
  });
  res.json({ success: true, data: item });
});

// Update stock (Inventory Adjustment)
router.patch('/:id/stock', async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;
  const item = await prisma.inventoryItem.update({
    where: { id: parseInt(id as string) },
    data: {
      stock: parseInt(stock as string),
    },
  });
  res.json({ success: true, data: item });
});

// Record Purchase
router.post('/purchases', validate(purchaseRecordSchema), async (req, res) => {
  const { itemId, quantity, cost, date } = req.body;
  const [purchase, updatedItem] = await prisma.$transaction([
    prisma.purchaseRecord.create({
      data: {
        itemId: parseInt(itemId as string),
        quantity: parseInt(quantity as string),
        cost: parseFloat(cost as string),
        date: date ? new Date(date as string) : new Date(),
      },
    }),
    prisma.inventoryItem.update({
      where: { id: parseInt(itemId as string) },
      data: {
        stock: {
          increment: parseInt(quantity as string)
        }
      }
    })
  ]);
  res.json({ success: true, purchase, updatedItem });
});

// Record Consumption (Usage)
router.post('/consumptions', validate(consumptionRecordSchema), async (req, res) => {
  const { itemId, quantity, usedFor, date } = req.body;
  const [consumption, updatedItem] = await prisma.$transaction([
    prisma.materialConsumption.create({
      data: {
        itemId: parseInt(itemId as string),
        quantity: parseInt(quantity as string),
        usedFor,
        date: date ? new Date(date as string) : new Date(),
      },
    }),
    prisma.inventoryItem.update({
      where: { id: parseInt(itemId as string) },
      data: {
        stock: {
          decrement: parseInt(quantity as string)
        }
      }
    })
  ]);
  res.json({ success: true, consumption, updatedItem });
});

export default router;
