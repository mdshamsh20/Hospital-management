import { Activity, Clock, UserCheck, IndianRupee, Users, AlertTriangle, CreditCard, Stethoscope } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useApiCache } from '@/hooks/useApiCache';

const OperationsAdminDashboard = () => {
    const { data: stats, loading, error } = useApiCache<any>('/analytics/operations-dashboard', 60000);

    if (error) {
        return (
            <div className="p-8 text-center bg-rose-50 rounded-xl border border-rose-100">
                <p className="text-rose-600 font-semibold mb-2">Failed to load operations data</p>
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
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map(idx => (
                    <Skeleton key={idx} className="h-28 w-full rounded-xl" />
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
            </div>
        </div>
    );

    return (
        <div className="space-y-6 pb-8 font-sans">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Operations Command Center</h1>
                    <p className="text-slate-500 mt-1">Real-time oversight of operations & clinical workflows.</p>
                </div>
                <div className="flex space-x-2">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                        Live Monitoring
                    </span>
                </div>
            </div>

            {/* KPI CARDS (TOP ROW) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Reports Pending</span>
                        <div className="p-1.5 bg-rose-50 text-rose-600 rounded-md">
                            <Clock size={16} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">{stats.kpis?.reportsPendingReview || 0}</h3>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Finalized Today</span>
                        <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md">
                            <UserCheck size={16} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">{stats.kpis?.reportsFinalizedToday || 0}</h3>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Commission (Month)</span>
                        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md">
                            <IndianRupee size={16} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">₹{(stats.kpis?.totalReferralCommission || 0).toLocaleString()}</h3>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Sample Rev (Today)</span>
                        <div className="p-1.5 bg-sky-50 text-sky-600 rounded-md">
                            <Activity size={16} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">₹{(stats.kpis?.sampleCollectionRevenue || 0).toLocaleString()}</h3>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">New : Repeat</span>
                        <div className="p-1.5 bg-amber-50 text-amber-600 rounded-md">
                            <Users size={16} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">{stats.kpis?.newVsRepeat || '0:0'}</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* OPERATION MONITOR PANEL */}
                <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-6 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                    <h2 className="text-sm font-semibold text-indigo-300 mb-6 flex items-center tracking-widest uppercase relative z-10">
                        <Activity size={16} className="mr-2" />
                        Operation Monitor Panel
                    </h2>
                    <div className="grid grid-cols-2 gap-6 relative z-10">
                        <div>
                            <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase">Active Doctors</p>
                            <p className="text-3xl font-bold mt-1.5 text-white">{stats.monitor?.activeDoctors || 0}</p>
                            <span className="text-xs text-slate-500">Currently on duty</span>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase">Patients Waiting</p>
                            <p className="text-3xl font-bold mt-1.5 text-amber-400">{stats.monitor?.waitingPatients || 0}</p>
                            <span className="text-xs text-slate-500">In reception hold</span>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase">Orders Pending</p>
                            <p className="text-3xl font-bold mt-1.5 text-sky-400">{stats.monitor?.diagnosticOrdersPending || 0}</p>
                            <span className="text-xs text-slate-500">Diagnostics queue</span>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase">Reports Under Review</p>
                            <p className="text-3xl font-bold mt-1.5 text-rose-400">{stats.monitor?.reportsUnderReview || 0}</p>
                            <span className="text-xs text-slate-500">Require finalization</span>
                        </div>
                    </div>
                </div>

                {/* ALERTS SECTION */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center mb-6">
                        <AlertTriangle size={16} className="text-amber-500 mr-2" />
                        Requires Intervention
                    </h2>
                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2">
                        {stats.alerts?.reportsPendingOver24h?.map((r: any, i: number) => (
                            <div key={`rep-${i}`} className="flex items-center justify-between p-3 rounded-lg border border-rose-100 bg-rose-50/50">
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">Delayed Report: {r.patient} ({r.type})</p>
                                    <p className="text-xs text-rose-500 mt-0.5 font-medium">Pending &gt; 24 hours</p>
                                </div>
                            </div>
                        ))}
                        {stats.alerts?.unapprovedCommissions?.map((c: any, i: number) => (
                            <div key={`com-${i}`} className="flex items-center justify-between p-3 rounded-lg border border-amber-100 bg-amber-50/50">
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">Unapproved Com: Dr. {c.doctor}</p>
                                    <p className="text-xs text-amber-600 mt-0.5 font-medium">₹{c.amount} pending approval</p>
                                </div>
                            </div>
                        ))}
                        {stats.alerts?.mismatchedSamples?.map((s: any, i: number) => (
                            <div key={`sam-${i}`} className="flex items-center justify-between p-3 rounded-lg border border-rose-100 bg-rose-50/50">
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">Margin Mismatch: {s.patient} ({s.test})</p>
                                    <p className="text-xs text-rose-500 mt-0.5 font-medium">Collected: ₹{s.collected} | Lab Cost: ₹{s.labCost}</p>
                                </div>
                            </div>
                        ))}
                        {(!stats.alerts?.reportsPendingOver24h?.length && !stats.alerts?.unapprovedCommissions?.length && !stats.alerts?.mismatchedSamples?.length) && (
                            <div className="text-center p-6 border border-slate-100 bg-slate-50 rounded-lg">
                                <p className="text-sm text-slate-400 font-medium">All operations nominal. No critical alerts.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* BILLING SUMMARY & DOCTOR PERFORMANCE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Billing Summary (Limited View) */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-base font-semibold text-slate-900 mb-6 flex items-center">
                        <CreditCard className="mr-2 text-indigo-600" size={18} />
                        Billing Summary (Today)
                    </h2>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                            <p className="text-xs font-semibold text-emerald-700 tracking-wide uppercase">Total Billing Collections</p>
                            <p className="text-2xl font-bold text-emerald-900 mt-1">₹{(stats.billing?.totalToday || 0).toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <p className="text-xs font-semibold text-blue-700 tracking-wide uppercase">Total Transactions</p>
                            <p className="text-2xl font-bold text-blue-900 mt-1">{stats.billing?.transactionsCount || 0}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-semibold text-slate-700 mb-2">Payment Mode Breakdown</p>
                            <div className="space-y-2">
                                {stats.billing?.modes?.map((mode: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600">{mode.name}</span>
                                        <span className="font-semibold text-slate-900">₹{mode.amount.toLocaleString()}</span>
                                    </div>
                                ))}
                                {!stats.billing?.modes?.length && <p className="text-xs text-slate-500 italic">No transactions today</p>}
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-100">
                            <p className="text-sm font-semibold text-slate-700 mb-2">Service-wise Revenue</p>
                            <div className="space-y-2">
                                {stats.billing?.services?.map((svc: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600">{svc.name}</span>
                                        <span className="font-semibold text-slate-900">₹{svc.amount.toLocaleString()}</span>
                                    </div>
                                ))}
                                {!stats.billing?.services?.length && <p className="text-xs text-slate-500 italic">No service revenue today</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Doctor Performance Monitoring */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-base font-semibold text-slate-900 mb-6 flex items-center">
                        <Stethoscope className="mr-2 text-indigo-600" size={18} />
                        Doctor Performance Monitoring
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="py-2 px-3 text-xs font-semibold text-slate-500 tracking-wide uppercase">Doctor</th>
                                    <th className="py-2 px-3 text-xs font-semibold text-slate-500 tracking-wide uppercase text-center">Patients</th>
                                    <th className="py-2 px-3 text-xs font-semibold text-slate-500 tracking-wide uppercase text-center">Referrals</th>
                                    <th className="py-2 px-3 text-xs font-semibold text-slate-500 tracking-wide uppercase text-center">Reports Pend</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.doctorPerformance?.map((doc: any, i: number) => (
                                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-3">
                                            <p className="text-sm font-bold text-slate-800">{doc.name}</p>
                                            <p className="text-[10px] font-medium text-slate-500 uppercase">{doc.department}</p>
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                            <p className="text-sm text-slate-900 font-semibold">{doc.patientsToday}</p>
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                            <p className="text-sm text-indigo-600 font-semibold">{doc.referralsGenerated}</p>
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                            {doc.pendingReports > 0 ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-800">
                                                    {doc.pendingReports}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-sm">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {!stats.doctorPerformance?.length && (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-sm text-slate-500 italic">No doctor activity recorded today.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default OperationsAdminDashboard;
