import { Router } from 'express';
import prisma from '../prismaClient';

const router = Router();

// Get all inventory items
router.get('/', async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// Add inventory item
router.post('/', async (req, res) => {
  const { name, category, stock, unit } = req.body;
  try {
    const item = await prisma.inventoryItem.create({
      data: {
        name,
        category,
        stock: parseInt(stock),
        unit,
      },
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create inventory item' });
  }
});

// Update stock (Inventory Adjustment)
router.patch('/:id/stock', async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;
  try {
    const item = await prisma.inventoryItem.update({
      where: { id: parseInt(id) },
      data: {
        stock: parseInt(stock),
      },
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update stock' });
  }
});

// Record Purchase
router.post('/purchases', async (req, res) => {
  const { itemId, quantity, cost, date } = req.body;
  try {
    const [purchase, updatedItem] = await prisma.$transaction([
      prisma.purchaseRecord.create({
        data: {
          itemId: parseInt(itemId),
          quantity: parseInt(quantity),
          cost: parseFloat(cost),
          date: new Date(date),
        },
      }),
      prisma.inventoryItem.update({
        where: { id: parseInt(itemId) },
        data: {
          stock: {
            increment: parseInt(quantity)
          }
        }
      })
    ]);
    res.json({ purchase, updatedItem });
  } catch (error) {
  }
});

// Record Consumption (Usage)
router.post('/consumptions', async (req, res) => {
  const { itemId, quantity, usedFor, date } = req.body;
  try {
    const [consumption, updatedItem] = await prisma.$transaction([
      prisma.materialConsumption.create({
        data: {
          itemId: parseInt(itemId),
          quantity: parseInt(quantity),
          usedFor,
          date: date ? new Date(date) : new Date(),
        },
      }),
      prisma.inventoryItem.update({
        where: { id: parseInt(itemId) },
        data: {
          stock: {
            decrement: parseInt(quantity)
          }
        }
      })
    ]);
    res.json({ consumption, updatedItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to record consumption' });
  }
});

export default router;
