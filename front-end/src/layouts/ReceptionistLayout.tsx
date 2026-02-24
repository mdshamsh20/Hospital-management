import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, Mail, LogOut, Activity, FlaskConical, Printer, Search } from 'lucide-react';
import { Input } from "@/components/ui/input"

const ReceptionistLayout = () => {
    const location = useLocation();

    // In a real app, you'd check authentication status here
    // const isAuthenticated = localStorage.getItem('receptionistToken') !== null;

    const navItems = [
        { path: '/receptionist', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/receptionist/appointments', icon: <Calendar size={20} />, label: 'Patient Queue & Registration' },
        { path: '/receptionist/dental-followups', icon: <FlaskConical size={20} />, label: 'Dental Follow-Ups' },
        { path: '/receptionist/reports-desk', icon: <Printer size={20} />, label: 'Reports Desk' },
        { path: '/receptionist/calendar', icon: <Calendar size={20} />, label: 'Follow-Up Calendar' },
        { path: '/receptionist/doctors', icon: <Users size={20} />, label: 'Doctors Directory' },
        { path: '/receptionist/inquiries', icon: <Mail size={20} />, label: 'Patient Inquiries' },
    ];

    const isActive = (path: string) => {
        if (path === '/receptionist' && location.pathname !== '/receptionist') return false;
        return location.pathname.startsWith(path);
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col z-20 shrink-0">
                <div className="h-20 flex items-center px-6 border-b border-white/10 shrink-0">
                    <div className="flex items-center space-x-2">
                        <Activity className="w-6 h-6 text-indigo-400" />
                        <span className="text-xl font-bold text-white tracking-tight">Medi<span className="text-indigo-400">Care</span></span>
                    </div>
                </div>

                <div className="p-6 border-b border-white/5 flex items-center space-x-3 shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/20">
                        FD
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Front Desk</p>
                        <p className="text-sm font-bold text-white leading-none mt-1">Receptionist</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar-dark">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition duration-200 text-sm font-medium ${isActive(item.path)
                                ? 'bg-indigo-500/10 text-indigo-400'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <span className={isActive(item.path) ? 'text-indigo-400' : 'text-slate-400'}>
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <Link
                        to="/receptionist/login"
                        className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-rose-500/10 hover:text-rose-400 transition text-sm font-medium text-slate-400"
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Top Header */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-[30]">
                    <div className="flex-1 flex items-center">
                        <div className="relative w-full max-w-xl group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors z-10">
                                <Search size={18} />
                            </div>
                            <Input
                                placeholder="Search Patient Name, Doctor ID, or Token..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-5 pl-12 pr-4 text-sm focus-visible:ring-1 focus-visible:ring-indigo-600 focus-visible:border-indigo-600 focus-visible:bg-white transition-all outline-none text-slate-700 placeholder:text-slate-400 shadow-sm"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 space-x-1.5 hidden md:flex">
                                <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-400 shadow-sm">CTRL</span>
                                <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-400 shadow-sm">K</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-5 ml-8">
                        <div className="flex flex-col items-end">
                            <h2 className="text-xs font-semibold text-indigo-600 mb-0.5">Role: Front Desk</h2>
                            <p className="text-sm font-bold text-slate-900 leading-none">Radiance Reception</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm transition-transform cursor-pointer">
                            R
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default ReceptionistLayout;
