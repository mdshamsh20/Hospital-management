import { Router } from 'express';
import prisma from '../prismaClient';
import { authenticateToken, authorize } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res) => {
  const departments = await prisma.department.findMany();
  res.json(departments);
});

router.post('/', authenticateToken, authorize('SUPER_ADMIN'), async (req, res) => {
  const { name } = req.body;
  const dept = await prisma.department.create({ data: { name } });
  res.json(dept);
});

router.delete('/:id', authenticateToken, authorize('SUPER_ADMIN'), async (req, res) => {
  const id = Number(req.params.id);
  await prisma.department.delete({ where: { id } });
  res.sendStatus(204);
});

export default router;
