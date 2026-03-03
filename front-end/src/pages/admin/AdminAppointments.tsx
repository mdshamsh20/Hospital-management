import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Activity, Zap } from 'lucide-react';

const AdminAppointments = () => {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [filterDept, setFilterDept] = useState('All');

    useEffect(() => {
        fetchAuditData();
    }, []);

    const fetchAuditData = async () => {
        try {
            const data: any = await api.get('/admin/visits/audit');
            setAppointments(data);
        } catch (err) {
            // Handled
        }
    };

    const calculateDuration = (start?: string, end?: string) => {
        if (!start || !end) return 'N/A';
        const duration = new Date(end).getTime() - new Date(start).getTime();
        return `${Math.floor(duration / 60000)}m`;
    };

    const formatTime = (isoString?: string) => {
        if (!isoString) return '--:--';
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const filteredAppointments = appointments.filter(apt =>
        filterDept === 'All' ? true : apt.department?.name === filterDept
    );

    return (
        <div className="space-y-6 pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Visit Audit Trail</h1>
                    <div className="flex items-center mt-1">
                        <Activity className="mr-2 text-indigo-600" size={16} />
                        <p className="text-slate-500 text-sm">Patient Journey Analytics & Efficiency Engine</p>
                    </div>
                </div>
                <div className="flex space-x-4">
                    <select
                        value={filterDept}
                        onChange={e => setFilterDept(e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition text-slate-700 w-[200px]"
                    >
                        <option value="All">All Departments</option>
                        <option value="Radiology">Radiology</option>
                        <option value="Dental">Dental</option>
                        <option value="General">General</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center">
                    <Zap className="mr-2 text-indigo-500 fill-indigo-500" size={16} />
                    <span className="text-base font-semibold text-slate-900">
                        Complete Audit Ledger
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                            <tr className="border-b border-slate-200">
                                <th className="px-6 py-4">Identity</th>
                                <th className="px-6 py-4">Timeline</th>
                                <th className="px-6 py-4">Durations</th>
                                <th className="px-6 py-4">Tags</th>
                                <th className="px-6 py-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredAppointments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">
                                        No appointments found.
                                    </td>
                                </tr>
                            ) : null}
                            {filteredAppointments.map((apt) => {
                                const waitTime = apt.arrivedAt && apt.startedAt ? Math.floor((new Date(apt.startedAt).getTime() - new Date(apt.arrivedAt).getTime()) / 60000) : 0;
                                const isDelayed = waitTime > 30;

                                return (
                                    <tr key={apt.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-semibold text-slate-900">{apt.patient?.name || apt.name}</p>
                                            <p className="text-xs text-slate-500 font-medium mt-1">
                                                {apt.doctor?.name || 'GEN'} • {apt.department?.name || 'Clinic Unit'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col space-y-1.5 min-w-[140px]">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-slate-500 uppercase tracking-wider">Arrival:</span>
                                                    <span className="text-xs font-semibold text-slate-900">{formatTime(apt.arrivedAt)}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-slate-500 uppercase tracking-wider">Started:</span>
                                                    <span className="text-xs font-semibold text-indigo-600">{formatTime(apt.startedAt)}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-slate-500 uppercase tracking-wider">Exit:</span>
                                                    <span className="text-xs font-semibold text-slate-600">{formatTime(apt.completedAt)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="text-center">
                                                    <p className={`text-sm font-semibold ${isDelayed ? 'text-rose-600' : 'text-slate-900'}`}>{calculateDuration(apt.arrivedAt, apt.startedAt)}</p>
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Wait</p>
                                                </div>
                                                <div className="w-px h-8 bg-slate-200"></div>
                                                <div className="text-center">
                                                    <p className="text-sm font-semibold text-slate-900">{calculateDuration(apt.startedAt, apt.completedAt)}</p>
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Consult</p>
                                                </div>
                                                <div className="w-px h-8 bg-slate-200"></div>
                                                <div className="text-center">
                                                    <p className="text-sm font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full shadow-sm border border-indigo-100">{calculateDuration(apt.arrivedAt, apt.completedAt)}</p>
                                                    <p className="text-[10px] text-indigo-500 uppercase tracking-wider mt-0.5">Total</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col items-start space-y-2">
                                                <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-1.5 rounded-md text-xs font-medium">
                                                    {apt.visitType}
                                                </span>
                                                {isDelayed && (
                                                    <span className="bg-rose-50 text-rose-600 border border-rose-200 px-2.5 py-1.5 rounded-md text-xs font-medium">
                                                        Delay Detected
                                                    </span>
                                                )}
                                                {apt.notes && (
                                                    <span className="text-xs text-amber-700 bg-amber-50 px-2 py-1.5 rounded-md border border-amber-200 truncate max-w-[150px]">
                                                        Note: {apt.notes}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right align-top">
                                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm border ${apt.status === 'Completed' || apt.status === 'Closed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                apt.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                                    'bg-amber-50 text-amber-700 border-amber-200'
                                                }`}>
                                                {apt.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminAppointments;
