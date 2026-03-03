import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Phone, Mail, MapPin, Loader2 } from 'lucide-react';

// Loading Component
const PageLoading = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      <p className="text-sm font-medium text-slate-500 animate-pulse">Initializing Interface...</p>
    </div>
  </div>
);

// Pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Blog = lazy(() => import('./pages/Blog'));
const Contact = lazy(() => import('./pages/Contact'));
const BookAppointment = lazy(() => import('./pages/BookAppointment'));
const Error404 = lazy(() => import('./pages/Error404'));

// Admin Pages Layout & Components
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const SuperAdminLayout = lazy(() => import('./layouts/SuperAdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const OperationsAdminDashboard = lazy(() => import('./pages/admin/OperationsAdminDashboard'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const SuperAdminLogin = lazy(() => import('./pages/admin/SuperAdminLogin'));
const AdminAppointments = lazy(() => import('./pages/admin/AdminAppointments'));
const AdminDoctors = lazy(() => import('./pages/admin/AdminDoctors'));
const AdminDepartments = lazy(() => import('./pages/admin/AdminDepartments'));
const AdminInquiries = lazy(() => import('./pages/admin/AdminInquiries'));
const AdminStaff = lazy(() => import('./pages/admin/AdminStaff'));
const AdminInventory = lazy(() => import('./pages/admin/AdminInventory'));
const AdminExpenses = lazy(() => import('./pages/admin/AdminExpenses'));
const AdminRadiology = lazy(() => import('./pages/admin/AdminRadiology'));
const AdminDental = lazy(() => import('./pages/admin/AdminDental'));
const AdminFinancials = lazy(() => import('./pages/admin/AdminFinancials'));
const AdminReports = lazy(() => import('./pages/admin/AdminReports'));
const AdminMonitor = lazy(() => import('./pages/admin/AdminMonitor'));
const AdminPayroll = lazy(() => import('./pages/admin/AdminPayroll'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminCommissions = lazy(() => import('./pages/admin/AdminCommissions'));
const AdminSamples = lazy(() => import('./pages/admin/AdminSamples'));

// Receptionist Pages Layout & Components
const ReceptionistLayout = lazy(() => import('./layouts/ReceptionistLayout'));
const ReceptionistDashboard = lazy(() => import('./pages/receptionist/ReceptionistDashboard'));
const ReceptionistLogin = lazy(() => import('./pages/receptionist/ReceptionistLogin'));
const ReceptionistAppointments = lazy(() => import('./pages/receptionist/ReceptionistAppointments'));
const ReceptionistDoctors = lazy(() => import('./pages/receptionist/ReceptionistDoctors'));
const ReceptionistInquiries = lazy(() => import('./pages/receptionist/ReceptionistInquiries'));
const ReceptionistDentalFollowUps = lazy(() => import('./pages/receptionist/ReceptionistDentalFollowUps'));
const ReceptionistReportsDesk = lazy(() => import('./pages/receptionist/ReceptionistReportsDesk'));
const ReceptionistCalendar = lazy(() => import('./pages/receptionist/ReceptionistCalendar'));

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"


const PublicLayout = () => {
  return (
    <>
      <div className="bg-primary-900 text-white py-2 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex space-x-6">
            <span className="flex items-center"><Phone className="w-4 h-4 mr-2" /> +1 (234) 567-8900</span>
            <span className="flex items-center"><Mail className="w-4 h-4 mr-2" /> contact@medicare.com</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" /> 123 Health Avenue, Medical City
          </div>
        </div>
      </div>

      <Navbar />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen font-sans">
        <TooltipProvider>
          <Suspense fallback={<PageLoading />}>
            <Routes>
              {/* Public Routes with Navbar and Footer */}
              <Route element={<PublicLayout />}> {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/book" element={<BookAppointment />} />
                <Route path="*" element={<Error404 />} />
              </Route>

              {/* Operations Admin Route */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<OperationsAdminDashboard />} />
                <Route path="appointments" element={<AdminAppointments />} />
                <Route path="doctors" element={<AdminDoctors />} />
                <Route path="departments" element={<AdminDepartments />} />
                <Route path="inquiries" element={<AdminInquiries />} />
                <Route path="staff" element={<AdminStaff />} />
                <Route path="inventory" element={<AdminInventory />} />
                <Route path="expenses" element={<AdminExpenses />} />
                <Route path="radiology" element={<AdminRadiology />} />
                <Route path="dental" element={<AdminDental />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="monitor" element={<AdminMonitor />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="commissions" element={<AdminCommissions />} />
                <Route path="samples" element={<AdminSamples />} />
              </Route>

              {/* Super Admin Route */}
              <Route path="/super-admin/login" element={<SuperAdminLogin />} />
              <Route path="/super-admin" element={<SuperAdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="appointments" element={<AdminAppointments />} />
                <Route path="doctors" element={<AdminDoctors />} />
                <Route path="departments" element={<AdminDepartments />} />
                <Route path="inquiries" element={<AdminInquiries />} />
                <Route path="staff" element={<AdminStaff />} />
                <Route path="inventory" element={<AdminInventory />} />
                <Route path="expenses" element={<AdminExpenses />} />
                <Route path="radiology" element={<AdminRadiology />} />
                <Route path="dental" element={<AdminDental />} />
                <Route path="financials" element={<AdminFinancials />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="monitor" element={<AdminMonitor />} />
                <Route path="payroll" element={<AdminPayroll />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="commissions" element={<AdminCommissions />} />
                <Route path="samples" element={<AdminSamples />} />
              </Route>
              {/* Receptionist Auth Route */}
              <Route path="/receptionist/login" element={<ReceptionistLogin />} />

              {/* Protected Receptionist Routes */}
              <Route path="/receptionist" element={<ReceptionistLayout />}>
                <Route index element={<ReceptionistDashboard />} />
                <Route path="appointments" element={<ReceptionistAppointments />} />
                <Route path="dental-followups" element={<ReceptionistDentalFollowUps />} />
                <Route path="reports-desk" element={<ReceptionistReportsDesk />} />
                <Route path="calendar" element={<ReceptionistCalendar />} />
                <Route path="doctors" element={<ReceptionistDoctors />} />
                <Route path="inquiries" element={<ReceptionistInquiries />} />
              </Route>
            </Routes>
          </Suspense>
          <Toaster position="top-right" richColors closeButton />
        </TooltipProvider>
      </div>
    </Router>
  );
}

export default App;
