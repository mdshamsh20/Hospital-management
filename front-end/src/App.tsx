import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import BookAppointment from './pages/BookAppointment';
import Error404 from './pages/Error404';

// Admin Pages Layout & Components
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminDoctors from './pages/admin/AdminDoctors';
import AdminDepartments from './pages/admin/AdminDepartments';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminStaff from './pages/admin/AdminStaff';
import AdminInventory from './pages/admin/AdminInventory';
import AdminExpenses from './pages/admin/AdminExpenses';
import AdminRadiology from './pages/admin/AdminRadiology';
import AdminDental from './pages/admin/AdminDental';
import AdminFinancials from './pages/admin/AdminFinancials';
import AdminReports from './pages/admin/AdminReports';
import AdminMonitor from './pages/admin/AdminMonitor';
import AdminPayroll from './pages/admin/AdminPayroll';
import AdminSettings from './pages/admin/AdminSettings';

// Receptionist Pages Layout & Components
import ReceptionistLayout from './layouts/ReceptionistLayout';
import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard';
import ReceptionistLogin from './pages/receptionist/ReceptionistLogin';
import ReceptionistAppointments from './pages/receptionist/ReceptionistAppointments';
import ReceptionistDoctors from './pages/receptionist/ReceptionistDoctors';
import ReceptionistInquiries from './pages/receptionist/ReceptionistInquiries';
import ReceptionistDentalFollowUps from './pages/receptionist/ReceptionistDentalFollowUps';
import ReceptionistReportsDesk from './pages/receptionist/ReceptionistReportsDesk';
import ReceptionistCalendar from './pages/receptionist/ReceptionistCalendar';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"


const PublicLayout = () => {
  return (
    <TooltipProvider>
      {/* Top Info Bar */}
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

      {/* Main Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
      <Toaster />
    </TooltipProvider>
  );
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen font-sans">
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

          {/* Admin Auth Route (No layout) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes (AdminLayout) */}
          <Route path="/admin" element={<AdminLayout />}>
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
      </div>
    </Router>
  );
}

export default App;
