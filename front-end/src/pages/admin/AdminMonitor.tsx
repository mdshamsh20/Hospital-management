import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Clock, FlaskConical, Printer, Users, UserCheck, AlertTriangle } from 'lucide-react';

const AdminMonitor = () => {
    const [monitorData, setMonitorData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMonitorData();
        const interval = setInterval(fetchMonitorData, 15000); // 15s for admin
        return () => clearInterval(interval);
    }, []);

    const fetchMonitorData = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/admin/dashboard-monitor');
            setMonitorData(res.data);
        } catch (err) {
            console.error('Monitor fetch failed');
        } finally {
            setLoading(false);
        }
    };

    if (loading || !monitorData) return <div className="p-10 text-center font-black uppercase tracking-[0.2em] text-slate-400">Loading Clinic Monitor...</div>;

    const summaryCards = [
        { label: 'Live Queue', value: monitorData.waitingQueue.length, icon: <Users size={24} />, color: 'bg-blue-600', alert: monitorData.waitingQueue.length > 5 },
        { label: 'In Procedure', value: monitorData.inProcedure.length, icon: <UserCheck size={24} />, color: 'bg-indigo-600', alert: false },
        { label: 'Reports Pending', value: monitorData.reportsPending.length, icon: <Printer size={24} />, color: 'bg-purple-600', alert: monitorData.reportsPending.length > 3 },
        { label: 'Dental Lab', value: monitorData.dentalLabCases.length, icon: <FlaskConical size={24} />, color: 'bg-emerald-600', alert: false },
    ];

    // Compute Department Bottlenecks
    const deptStats: Record<string, any> = {};
    monitorData.waitingQueue.forEach((apt: any) => {
        const deptName = apt.department?.name || 'General';
        const docName = apt.doctor?.name || 'Unassigned';
        const waitMs = new Date().getTime() - new Date(apt.arrivedAt || new Date()).getTime();
        const key = `${deptName}-${docName}`;
        if (!deptStats[key]) {
            deptStats[key] = { department: deptName, doctor: docName, waiting: 0, totalWaitMs: 0 };
        }
        deptStats[key].waiting += 1;
        deptStats[key].totalWaitMs += waitMs;
    });

    const bottlenecks = Object.values(deptStats).map((d: any) => {
        const avgWaitMins = Math.floor((d.totalWaitMs / d.waiting) / 60000);
        const isOverloaded = d.waiting >= 5 || avgWaitMins > 30;
        return { ...d, avgWaitMins, isOverloaded };
    }).sort((a, b) => b.waiting - a.waiting);

    return (
        <div className="space-y-6 pb-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Operations Monitor</h1>
                    <p className="text-slate-500 mt-1 flex items-center">
                        <Activity className="mr-2 text-indigo-600" size={16} />
                        Real-time Clinical Flow & Bottleneck Tracking
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Telemetry</p>
                    <div className="flex items-center bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-200">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                        <span className="text-xs font-semibold text-emerald-800 uppercase">Live Sync</span>
                    </div>
                </div>
            </div>

            {/* Quick Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {summaryCards.map((card, i) => (
                    <div key={i} className={`p-6 rounded-xl text-white shadow-sm relative overflow-hidden ${card.color}`}>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex justify-between items-start">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    {card.icon}
                                </div>
                                {card.alert && (
                                    <div className="bg-rose-500/20 px-2 py-1 rounded-md border border-rose-400/30 flex items-center">
                                        <AlertTriangle size={12} className="text-rose-100 mr-1" />
                                        <span className="text-xs font-semibold text-white">Alert</span>
                                    </div>
                                )}
                            </div>
                            <div className="mt-6">
                                <h3 className="text-4xl font-bold">{card.value}</h3>
                                <p className="text-sm font-medium text-white/80 mt-1">{card.label}</p>
                            </div>
                        </div>
                        <div className="absolute -right-10 -bottom-10 bg-white/10 w-32 h-32 rounded-full blur-2xl"></div>
                        <div className="absolute -left-10 -top-10 bg-white/5 w-24 h-24 rounded-full blur-xl"></div>
                    </div>
                ))}
            </div>

            {/* Department Bottleneck View */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 bg-slate-50">
                    <h2 className="text-base font-semibold text-slate-900 flex items-center">
                        <Activity className="mr-2 text-rose-500" size={18} />
                        Department Flow Analysis
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                            <tr className="border-b border-slate-200">
                                <th className="px-6 py-4">Clinical Node</th>
                                <th className="px-6 py-4 text-center">Live Queue</th>
                                <th className="px-6 py-4 text-center">Avg Latency</th>
                                <th className="px-6 py-4">Assigned Physician</th>
                                <th className="px-6 py-4 text-right">Node Protocol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {bottlenecks.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <p className="text-sm text-slate-400">No Active Queues Detected</p>
                                    </td>
                                </tr>
                            )}
                            {bottlenecks.map((dept, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-semibold text-slate-900">{dept.department}</p>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`text-lg font-bold ${dept.waiting > 4 ? 'text-rose-600' : 'text-slate-900'}`}>{dept.waiting}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-sm font-medium text-slate-600">{dept.avgWaitMins}m</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">{dept.doctor}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {dept.isOverloaded ? (
                                            <span className="inline-flex items-center bg-rose-50 text-rose-700 px-2.5 py-1 rounded-md text-xs font-medium border border-rose-200">
                                                Overloaded
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-medium border border-emerald-200">
                                                Normal
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Waiting List Detail */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                        <h2 className="text-base font-semibold text-slate-900 flex items-center">
                            <Clock className="mr-2 text-indigo-600" size={18} />
                            Active Patients
                        </h2>
                        <span className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">Live List</span>
                    </div>
                    <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                        {monitorData.waitingQueue.map((appt: any) => (
                            <div key={appt.id} className="flex items-center justify-between p-4 rounded-lg bg-white border border-slate-200 shadow-sm hover:border-indigo-200 hover:shadow transition-all group">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xl border border-indigo-100">
                                        {appt.token || 'W'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 text-sm">{appt.patient?.name || appt.name}</p>
                                        <p className="text-xs text-slate-500 font-medium mt-1">Wait: {Math.floor((new Date().getTime() - new Date(appt.arrivedAt || new Date()).getTime()) / 60000)}m</p>
                                    </div>
                                </div>
                                <Activity size={18} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
                            </div>
                        ))}
                        {monitorData.waitingQueue.length === 0 && (
                            <div className="text-center py-8 opacity-50">
                                <p className="text-sm font-medium text-slate-500">No waiting patients</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Radiology Delay Monitor */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                        <h2 className="text-base font-semibold text-slate-900 flex items-center">
                            <Printer className="mr-2 text-indigo-600" size={18} />
                            Radiology Processing
                        </h2>
                        <span className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">Render</span>
                    </div>
                    <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                        {monitorData.reportsPending.map((report: any) => (
                            <div key={report.id} className="flex items-center justify-between p-4 rounded-lg bg-white border border-slate-200 shadow-sm hover:border-indigo-200 hover:shadow transition-all group">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-lg bg-white text-indigo-600 flex items-center justify-center font-bold text-xl border border-slate-200 shadow-sm">
                                        R
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 text-sm">{report.patientName}</p>
                                        <p className="text-xs text-slate-500 font-medium mt-1">{report.type} • {report.status}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-medium text-slate-500 text-right">SLA limit</p>
                                    <p className="text-sm font-semibold text-indigo-600 mt-1">4 hrs</p>
                                </div>
                            </div>
                        ))}
                        {monitorData.reportsPending.length === 0 && (
                            <div className="text-center py-8 opacity-50">
                                <p className="text-sm font-medium text-slate-500">All reports cleared</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMonitor;
