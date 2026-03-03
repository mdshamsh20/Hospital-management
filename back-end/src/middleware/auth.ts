import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export interface AuthRequest extends Request {
  user?: {
      userId: number;
      role: string;
      email: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
      return res.status(401).json({ 
          success: false, 
          errorCode: 'UNAUTHORIZED', 
          message: 'Access token required' 
      });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
    if (err) {
        return res.status(403).json({ 
            success: false, 
            errorCode: 'FORBIDDEN', 
            message: 'Invalid or expired token' 
        });
    }
    req.user = decoded;
    next();
  });
};

export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                errorCode: 'INSUFFICIENT_PERMISSIONS', 
                message: `Required roles: [${roles.join(', ')}]. Found: ${req.user.role}` 
            });
        }
        next();
    };
};
