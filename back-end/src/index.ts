import express from 'express';
import cors from 'cors';
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

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reception', receptionRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Hospital API is running');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
