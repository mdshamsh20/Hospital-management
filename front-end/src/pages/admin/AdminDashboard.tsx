import { Activity, Calendar, Clock, UserCheck, IndianRupee, Stethoscope, Boxes } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useApiCache } from '@/hooks/useApiCache';

const AdminDashboard = () => {
    const { data: stats, loading, error } = useApiCache<any>('/analytics/dashboard-stats', 60000); // 1 minute TTL

    if (error) {
        return (
            <div className="p-8 text-center bg-rose-50 rounded-xl border border-rose-100">
                <p className="text-rose-600 font-semibold mb-2">Failed to load dashboard data</p>
                <p className="text-sm text-rose-500">{error.message}</p>
            </div>
        );
    }

    if (loading && !stats) return (
        <div className="space-y-6 pb-8 animate-pulse">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-48" />
                </div>
            </div>
            <Skeleton className="h-32 w-full rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(idx => (
                    <Skeleton key={idx} className="h-28 w-full rounded-xl" />
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(idx => (
                    <Skeleton key={idx} className="h-32 w-full rounded-xl" />
                ))}
            </div>
        </div>
    );

    const widgets = [
        { label: "Today's Patients", value: stats.patientsToday, icon: <Calendar className="w-6 h-6" />, color: 'bg-blue-50 text-blue-600', sub: 'Total Appointments' },
        { label: 'Radiology Today', value: stats.radiologyToday, icon: <Activity className="w-6 h-6" />, color: 'bg-indigo-50 text-indigo-600', sub: 'X-Ray & Ultrasound' },
        { label: 'Dental Today', value: stats.dentalToday, icon: <Stethoscope className="w-6 h-6" />, color: 'bg-purple-50 text-purple-600', sub: 'RCT & Extraction' },
        { label: 'Orders in Lab', value: stats.dentalOrdersInLab, icon: <Boxes className="w-6 h-6" />, color: 'bg-orange-50 text-orange-600', sub: 'Teeth under fabrication' },
        { label: 'Revenue Today', value: `₹${stats.revenueToday}`, icon: <IndianRupee className="w-6 h-6" />, color: 'bg-green-50 text-green-600', sub: 'Estimated Earnings' },
        { label: 'Pending Reports', value: stats.pendingReports, icon: <Clock className="w-6 h-6" />, color: 'bg-yellow-50 text-yellow-600', sub: 'Need Verification' },
        { label: 'Staff Present', value: stats.staffPresent, icon: <UserCheck className="w-6 h-6" />, color: 'bg-emerald-50 text-emerald-600', sub: 'Today Attendance' },
    ];

    const monitorWidgets = [
        { label: 'Waiting List', value: stats.waitingQueue || 0, color: 'text-blue-600', sub: 'Total Patients in Queue' },
        { label: 'In Procedure', value: stats.inProcedure || 0, color: 'text-purple-600', sub: 'Current Consultations' },
        { label: 'Reports Ready', value: stats.reportsReady || 0, color: 'text-indigo-600', sub: 'Radiology Delivery' },
        { label: 'Lab Orders', value: stats.labOrders || 0, color: 'text-orange-600', sub: 'Dental Fabrication' }
    ];

    return (
        <div className="space-y-6 pb-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Clinic Command Center</h1>
                    <p className="text-slate-500 mt-1">Real-time oversight of every patient & case.</p>
                </div>
                <div className="flex space-x-2">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                        Live Monitoring
                    </span>
                </div>
            </div>

            {/* Operational Health Banner */}
            <div className="bg-slate-900 rounded-xl p-6 text-white shadow-sm overflow-hidden relative border border-slate-800">
                <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                <h2 className="text-sm font-medium text-indigo-300 mb-6 flex items-center tracking-wide">
                    <Activity size={16} className="mr-2" />
                    Operational Health
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                    <div>
                        <p className="text-xs font-semibold text-slate-400 tracking-wide">Avg Wait Time</p>
                        <p className="text-3xl font-bold mt-1.5 text-white">{stats.avgWaitTime || 0} <span className="text-sm font-normal text-slate-400">min</span></p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 tracking-wide">Doctor Utilization</p>
                        <p className="text-3xl font-bold mt-1.5 text-white">{stats.doctorUtilization || 0} <span className="text-sm font-normal text-slate-400">%</span></p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 tracking-wide">Patients Served Today</p>
                        <p className="text-3xl font-bold mt-1.5 text-emerald-400">{stats.patientsServedToday || 0}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 tracking-wide">Cancelled Visits</p>
                        <p className="text-3xl font-bold mt-1.5 text-rose-400">{stats.cancelledVisits || 0}</p>
                    </div>
                </div>
            </div>

            {/* Live Operations Monitor Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {monitorWidgets.map((widget, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                        <p className="text-xs font-medium text-slate-500 tracking-wide">{widget.label}</p>
                        <p className={`text-3xl font-semibold mt-2 ${widget.color}`}>{widget.value}</p>
                        <p className="text-xs text-slate-500 mt-2">{widget.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {widgets.map((widget, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-slate-500">{widget.label}</h3>
                            <div className={`p-2 rounded-lg ${widget.color}`}>
                                {widget.icon}
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-2">{widget.value}</h3>
                        <p className="text-xs text-slate-500">{widget.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-base font-semibold text-slate-800 mb-6 flex items-center">
                        <Activity className="mr-2 text-indigo-600" size={18} />
                        Radiology Flow Monitor
                    </h2>
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-slate-50/50 border border-transparent hover:border-slate-200 transition">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                                        R{i}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Patient 00{i}</p>
                                        <p className="text-xs text-slate-500">X-Ray • Tech: Amit</p>
                                    </div>
                                </div>
                                <span className="bg-orange-100 text-orange-700 px-2.5 py-1 rounded-md text-xs font-semibold border border-orange-200">Typing</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-base font-semibold text-slate-900 mb-6 flex items-center">
                        <Boxes className="mr-2 text-indigo-600" size={20} />
                        Inventory Consumption
                    </h2>
                    <div className="space-y-3">
                        {['X-Ray Films', 'Gloves', 'Dental Putty'].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-slate-50/50 border border-transparent hover:border-slate-200 transition">
                                <div className="flex flex-col">
                                    <span className="font-semibold text-slate-900 text-sm">{item}</span>
                                    <span className="text-xs font-medium text-rose-500 mt-1">Reorder Required</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="text-right">
                                        <span className="text-sm font-bold text-slate-900">12%</span>
                                        <div className="w-16 h-1.5 bg-slate-200 rounded-full mt-1">
                                            <div className="w-[12%] h-full bg-rose-500 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

