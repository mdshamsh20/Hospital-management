import { Router } from 'express';
import prisma from '../prismaClient';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res) => {
  const doctors = await prisma.doctor.findMany();
  res.json(doctors);
});

router.post('/', authenticateToken, async (req, res) => {
  const { name } = req.body;
  const doc = await prisma.doctor.create({ data: { name } });
  res.json(doc);
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const id = Number(req.params.id);
  await prisma.doctor.delete({ where: { id } });
  res.sendStatus(204);
});

export default router;
