import { Router } from 'express';
import prisma from '../prismaClient';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res) => {
  const inquiries = await prisma.inquiry.findMany();
  res.json(inquiries);
});

router.post('/', async (req, res) => {
  const data = req.body;
  const inq = await prisma.inquiry.create({ data });
  res.json(inq);
});

export default router;
