import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import departmentRoutes from './routes/departments';
import doctorRoutes from './routes/doctors';
import appointmentRoutes from './routes/appointments';
import inquiryRoutes from './routes/inquiries';
import staffRoutes from './routes/staff';
import inventoryRoutes from './routes/inventory';
import expenseRoutes from './routes/expenses';
import caseRoutes from './routes/cases';
import analyticsRoutes from './routes/analytics';
import receptionRoutes from './routes/reception';
import adminRoutes from './routes/admin';
import reportsRoutes from './routes/reports';
import dentalRoutes from './routes/dental';

import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

// Basic Rate Limiting to prevent DoS
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

app.use('/api', apiLimiter);

import { authenticateToken, authorize } from './middleware/auth';

// ... (imports remain same)

// Routes
app.use('/api/auth', authRoutes);

// Protected Routes
app.use('/api/admin', authenticateToken, authorize('ADMIN', 'SUPER_ADMIN'), adminRoutes);
app.use('/api/staff', authenticateToken, authorize('ADMIN', 'SUPER_ADMIN'), staffRoutes);
app.use('/api/inventory', authenticateToken, authorize('ADMIN', 'SUPER_ADMIN'), inventoryRoutes);
app.use('/api/expenses', authenticateToken, authorize('ADMIN', 'SUPER_ADMIN'), expenseRoutes);
app.use('/api/analytics', authenticateToken, authorize('ADMIN', 'SUPER_ADMIN'), analyticsRoutes);

app.use('/api/appointments', authenticateToken, authorize('ADMIN', 'SUPER_ADMIN', 'RECEPTIONIST'), appointmentRoutes);
app.use('/api/reception', authenticateToken, authorize('RECEPTIONIST'), receptionRoutes);
app.use('/api/reports', authenticateToken, authorize('ADMIN', 'SUPER_ADMIN', 'RECEPTIONIST'), reportsRoutes);
app.use('/api/dental', authenticateToken, authorize('ADMIN', 'SUPER_ADMIN', 'RECEPTIONIST'), dentalRoutes);
app.use('/api/doctors', authenticateToken, authorize('ADMIN', 'SUPER_ADMIN', 'RECEPTIONIST'), doctorRoutes);
app.use('/api/departments', authenticateToken, authorize('ADMIN', 'SUPER_ADMIN', 'RECEPTIONIST'), departmentRoutes);
app.use('/api/inquiries', authenticateToken, authorize('ADMIN', 'SUPER_ADMIN', 'RECEPTIONIST'), inquiryRoutes);
app.use('/api/cases', authenticateToken, authorize('ADMIN', 'SUPER_ADMIN', 'RECEPTIONIST'), caseRoutes);

app.get('/', (req, res) => {
  res.send('Hospital API is running');
});

// Error handling - must be last
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
