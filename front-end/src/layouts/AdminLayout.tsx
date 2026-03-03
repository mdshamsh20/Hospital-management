import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    Users,
    MessageSquare,
    LogOut,
    Menu,
    X,
    UserCircle,
    Activity,
    IndianRupee,
    Briefcase,
    Boxes,
    Stethoscope,
    FileText
} from 'lucide-react';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const isAuthenticated = localStorage.getItem('token') !== null;
    const userRole = localStorage.getItem('role');
    const isAuthorized = userRole === 'admin';

    useEffect(() => {
        if (!isAuthenticated || !isAuthorized) {
            navigate('/admin/login');
        }
    }, [isAuthenticated, isAuthorized, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/admin/login');
    };

    const navItems = [
        { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/admin/monitor', icon: <Activity size={20} />, label: 'Operations Monitor' },
        { path: '/admin/appointments', icon: <Calendar size={20} />, label: 'Appointment Audit' },
        { path: '/admin/samples', icon: <Boxes size={20} />, label: 'Sample Collection' },
        { path: '/admin/commissions', icon: <IndianRupee size={20} />, label: 'Referral Commissions' },
        { path: '/admin/reports', icon: <FileText size={20} />, label: 'Clinical Reports' },
        { path: '/admin/staff', icon: <Briefcase size={20} />, label: 'Staff & Attendance' },
        { path: '/admin/inventory', icon: <Boxes size={20} />, label: 'Inventory & Usage' },
        { path: '/admin/expenses', icon: <IndianRupee size={20} />, label: 'Expenses' },
        { path: '/admin/radiology', icon: <Activity size={20} />, label: 'Radiology Control' },
        { path: '/admin/dental', icon: <Stethoscope size={20} />, label: 'Dental cases' },
        { path: '/admin/doctors', icon: <Users size={20} />, label: 'Doctors' },
        { path: '/admin/inquiries', icon: <MessageSquare size={20} />, label: 'Inquiries' },
    ];

    const filteredNavItems = navItems;

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 border-r border-slate-800 text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between h-20 px-6 bg-slate-950 shrink-0">
                    <span className="text-xl font-bold tracking-tight text-white flex items-center">
                        <span className="text-primary-500 mr-2">Operations</span>Panel
                    </span>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar-dark">
                    <div className="flex items-center space-x-3 mb-8 px-2 py-3 bg-slate-800 rounded-xl">
                        <UserCircle size={32} className="text-primary-400" />
                        <div>
                            <p className="text-sm font-medium capitalize">{userRole?.replace('_', ' ') || 'Administrator'}</p>
                            <p className="text-xs text-slate-400">{localStorage.getItem('email') || 'executive@medicare.com'}</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {filteredNavItems.map((item) => {
                            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${isActive
                                        ? 'bg-primary-600 text-white'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
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
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 rounded-xl hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut size={20} className="mr-3" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Top header */}
                <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200 lg:justify-end">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-slate-500 hover:text-slate-700 focus:outline-none lg:hidden"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center">
                        <span className="text-sm font-medium text-slate-700 mr-4 capitalize">
                            Operations Portal
                        </span>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold bg-primary-600">
                            A
                        </div>
                    </div>
                </header>

                {/* Main section */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
