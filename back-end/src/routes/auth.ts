import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient';

import { validate } from '../middleware/validate';
import { registerSchema, loginSchema } from '../validations/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

router.post('/register', validate(registerSchema), async (req, res, next) => {
  const { email, password, role } = req.body;
  try {
      const existing = await prisma.users.findUnique({ where: { email } });
      if (existing) {
          return res.status(409).json({ 
              success: false, 
              errorCode: 'CONFLICT', 
              message: 'Email already registered' 
          });
      }

      // Security: Only allow RECEPTIONIST role from public registration
      // SUPER_ADMIN, ADMIN or DOCTOR roles should be created by an existing administrator
      const finalRole = (role === 'ADMIN' || role === 'DOCTOR' || role === 'SUPER_ADMIN') ? 'RECEPTIONIST' : (role || 'RECEPTIONIST');

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.users.create({
        // @ts-ignore
        data: { email, password: hashedPassword, role: finalRole },
      });
      res.json({ success: true, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
      next(error);
  }
});

router.post('/login', validate(loginSchema), async (req, res, next) => {
  const { email, password } = req.body;
  try {
      const user = await prisma.users.findUnique({ where: { email } });
      
      if (!user || !user.password) {
        return res.status(401).json({ 
          success: false, 
          errorCode: 'INVALID_CREDENTIALS', 
          message: 'Invalid email or password' 
        });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ 
          success: false, 
          errorCode: 'INVALID_CREDENTIALS', 
          message: 'Invalid email or password' 
        });
      }

      const token = jwt.sign(
          { userId: user.id, role: user.role, email: user.email }, 
          JWT_SECRET, 
          { expiresIn: '1d' }
      );
      res.json({ 
          success: true, 
          token, 
          user: { id: user.id, email: user.email, role: user.role } 
      });
  } catch (error) {
    next(error);
  }
});

export default router;
