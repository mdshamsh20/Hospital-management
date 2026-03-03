import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    Users,
    Building2,
    MessageSquare,
    LogOut,
    Menu,
    X,
    Activity,
    IndianRupee,
    ClipboardList,
    Briefcase,
    Boxes,
    Stethoscope,
    FileText,
    Shield
} from 'lucide-react';

const SuperAdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const isAuthenticated = localStorage.getItem('token') !== null;
    const userRole = localStorage.getItem('role');
    const isAuthorized = userRole === 'super_admin';

    useEffect(() => {
        if (!isAuthenticated || !isAuthorized) {
            navigate('/super-admin/login');
        }
    }, [isAuthenticated, isAuthorized, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/super-admin/login');
    };

    const navItems = [
        { path: '/super-admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/super-admin/monitor', icon: <Activity size={20} />, label: 'Operations Monitor' },
        { path: '/super-admin/financials', icon: <ClipboardList size={20} />, label: 'Financial Summary' },
        { path: '/super-admin/appointments', icon: <Calendar size={20} />, label: 'Appointment Audit' },
        { path: '/super-admin/samples', icon: <Boxes size={20} />, label: 'Sample Collection' },
        { path: '/super-admin/commissions', icon: <IndianRupee size={20} />, label: 'Referral Commissions' },
        { path: '/super-admin/reports', icon: <FileText size={20} />, label: 'Clinical Reports' },
        { path: '/super-admin/staff', icon: <Briefcase size={20} />, label: 'Staff & Attendance' },
        { path: '/super-admin/payroll', icon: <IndianRupee size={20} />, label: 'Payroll' },
        { path: '/super-admin/inventory', icon: <Boxes size={20} />, label: 'Inventory & Usage' },
        { path: '/super-admin/expenses', icon: <IndianRupee size={20} />, label: 'Expenses' },
        { path: '/super-admin/radiology', icon: <Activity size={20} />, label: 'Radiology Control' },
        { path: '/super-admin/dental', icon: <Stethoscope size={20} />, label: 'Dental cases' },
        { path: '/super-admin/doctors', icon: <Users size={20} />, label: 'Doctors' },
        { path: '/super-admin/departments', icon: <Building2 size={20} />, label: 'Departments' },
        { path: '/super-admin/inquiries', icon: <MessageSquare size={20} />, label: 'Inquiries' },
        { path: '/super-admin/settings', icon: <Menu size={20} />, label: 'Clinic Settings' },
        { path: '/super-admin/users', icon: <Shield size={20} />, label: 'System Access' },
    ];

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
            <aside
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 border-r border-slate-800 text-slate-300 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex items-center justify-between h-20 px-6 bg-slate-950 shrink-0 border-b border-slate-900">
                    <span className="text-xl font-bold tracking-tight text-white flex items-center">
                        <span className="text-indigo-400 mr-2">Owner</span>Panel
                    </span>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar-dark">
                    <div className="flex items-center space-x-3 mb-8 px-2 py-3 bg-black/20 rounded-xl border border-white/5">
                        <Shield size={32} className="text-indigo-400" />
                        <div>
                            <p className="text-sm font-bold text-white tracking-wide">Super Admin</p>
                            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5 max-w-[120px] truncate">{localStorage.getItem('email') || 'Executive Account'}</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path || (item.path !== '/super-admin' && location.pathname.startsWith(item.path));
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all ${isActive
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                        }`}
                                >
                                    <span className="mr-3">{item.icon}</span>
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-800 shrink-0">
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center font-bold tracking-wider uppercase text-xs w-full px-4 py-3 text-rose-400 rounded-xl hover:bg-rose-500/10 transition-colors border border-transparent hover:border-rose-500/20"
                    >
                        <LogOut size={16} className="mr-3" />
                        Secure Logout
                    </button>
                </div>
            </aside>

            <div className="flex flex-col flex-1 overflow-hidden relative">
                <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200 lg:justify-end shadow-sm">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-slate-500 hover:text-slate-700 focus:outline-none lg:hidden"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center">
                        <span className="text-sm font-bold tracking-wide text-slate-800 mr-4">
                            Executive Portal
                        </span>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold bg-indigo-600 shadow-sm border border-indigo-700">
                            S
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 md:p-8 relative z-10 bg-slate-50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default SuperAdminLayout;
