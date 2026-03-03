import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import {
    IndianRupee, TrendingUp, TrendingDown, ArrowUpRight,
    Printer, Users, Activity, FileText, Stethoscope, AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

const AdminFinancials = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [analyticsTab, setAnalyticsTab] = useState('Dept');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(false);
        try {
            const [baseData, execData]: [any, any] = await Promise.all([
                api.get('/analytics/financials'),
                api.get('/analytics/executive-summary')
            ]);
            setData({ ...baseData, executive: execData });
        } catch (error) {
            toast.error('Failed to load executive summary');
            console.error('Error fetching dashboard:', error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <div className="p-8 text-center bg-rose-50 rounded-xl border border-rose-100 mt-6">
                <p className="text-rose-600 font-semibold mb-4">Error loading financial data.</p>
                <button
                    onClick={fetchDashboardData}
                    className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    if (loading || !data) {
        return (
            <div className="space-y-6 pb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <Skeleton className="h-9 w-64" />
                        <Skeleton className="h-4 w-96 mt-2" />
                    </div>
                </div>
                {/* Financial KPI Block */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(idx => (
                        <Skeleton key={idx} className="h-32 rounded-xl" />
                    ))}
                </div>
                {/* Additional sections skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="h-[400px] rounded-xl md:col-span-2" />
                    <Skeleton className="h-[400px] rounded-xl" />
                </div>
            </div>
        );
    }

    const { executive } = data;

    return (
        <div className="space-y-6 pb-8 font-sans">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Executive Control Panel</h1>
                    <p className="text-slate-500 text-sm mt-1 flex items-center">
                        <Activity className="mr-2 text-indigo-600" size={16} />
                        Super Admin: Comprehensive Financial & Operational Governance
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 bg-white text-slate-700 border border-slate-200 px-4 py-2.5 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm text-sm">
                        <Printer size={16} className="text-slate-500" />
                        <span>Export Tax Summary</span>
                    </button>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 pointer-events-none animate-pulse"></span>
                        Executive View
                    </span>
                </div>
            </div>

            {/* 3.1 FINANCIAL KPI BLOCK */}
            <div>
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 mt-2">Financial Command</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-500 font-semibold tracking-wide">Monthly Revenue</span>
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                <TrendingUp size={16} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">₹{executive.financials.monthlyRevenue.toLocaleString()}</h3>
                        <p className="text-xs text-indigo-600 font-medium mt-1">Today: ₹{executive.financials.todayRevenue.toLocaleString()}</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-500 font-semibold tracking-wide">Total Expenses</span>
                            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                                <TrendingDown size={16} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">₹{executive.financials.totalExpenses.month.toLocaleString()}</h3>
                        <p className="text-xs text-rose-600 font-medium mt-1">Today: ₹{executive.financials.totalExpenses.today.toLocaleString()}</p>
                    </div>

                    <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-6 rounded-xl shadow-md text-white border border-indigo-900 relative overflow-hidden">
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex justify-between items-start">
                                <span className="text-sm text-indigo-200 font-semibold tracking-wide">Net Profit (Monthly)</span>
                                <IndianRupee size={16} className="text-indigo-300" />
                            </div>
                            <div className="mt-2">
                                <h3 className="text-3xl font-bold text-white tracking-tight">₹{executive.financials.netProfit.toLocaleString()}</h3>
                            </div>
                        </div>
                        <div className="absolute right-0 bottom-0 opacity-10">
                            <TrendingUp size={100} className="-mb-8 -mr-8" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-500 font-semibold tracking-wide">Outstanding Dues</span>
                            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                <AlertTriangle size={16} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">₹{executive.financials.outstandingPayments.toLocaleString()}</h3>
                        <p className="text-xs text-amber-600 font-medium mt-1">Requires Collection</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
                {/* 3.2 OPERATIONAL KPI BLOCK */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center mb-6 border-b border-slate-100 pb-4">
                            <Users size={16} className="text-slate-400 mr-2" />
                            Operational Metrics (Today)
                        </h3>
                        <div className="space-y-5">
                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div className="flex items-center text-sm font-semibold text-slate-700">
                                    <Stethoscope size={16} className="text-indigo-500 mr-2" />
                                    Active Doctors
                                </div>
                                <span className="font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">{executive.operations.activeDoctors}</span>
                            </div>
                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div className="flex items-center text-sm font-semibold text-slate-700">
                                    <Users size={16} className="text-sky-500 mr-2" />
                                    Total Patients
                                </div>
                                <span className="font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">{executive.operations.patientsToday}</span>
                            </div>
                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div className="flex items-center text-sm font-semibold text-slate-700">
                                    <ArrowUpRight size={16} className="text-emerald-500 mr-2" />
                                    New vs Repeat Ratio
                                </div>
                                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">{executive.operations.newVsRepeatRatio}</span>
                            </div>
                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div className="flex items-center text-sm font-semibold text-slate-700">
                                    <FileText size={16} className="text-rose-500 mr-2" />
                                    Reports Pending
                                </div>
                                <span className="font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">{executive.operations.reportsPending}</span>
                            </div>
                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div className="flex items-center text-sm font-semibold text-slate-700">
                                    <IndianRupee size={16} className="text-emerald-500 mr-2" />
                                    Sample Col. Revenue
                                </div>
                                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">₹{executive.operations.sampleCollectionRevenue}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3.3 COMMISSION SUMMARY */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
                    <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-widest flex items-center mb-6 border-b border-emerald-100 pb-4">
                        <IndianRupee size={16} className="text-emerald-500 mr-2" />
                        Commission Summary (Month)
                    </h3>
                    <div className="mb-6 shrink-0 bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex items-center justify-between">
                        <span className="text-sm font-semibold text-emerald-800">Total Payable</span>
                        <span className="text-2xl font-bold text-emerald-600">₹{executive.commissions.totalPayable.toLocaleString()}</span>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Payout Queue by Doctor</h4>
                        {executive.commissions.byDoctor.length === 0 && (
                            <p className="text-sm text-slate-500 italic text-center mt-4">No commissions calculated yet.</p>
                        )}
                        {executive.commissions.byDoctor.slice(0, 5).map((doc: any, i: number) => (
                            <div key={i} className="flex justify-between items-center border border-slate-100 rounded-lg p-3 hover:bg-slate-50 transition-colors">
                                <span className="font-semibold text-slate-800 text-sm">{doc.name}</span>
                                <span className="font-bold text-emerald-700">₹{doc.value.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legacy Dynamic Breakdown */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-[400px]">
                    <div className="flex items-center justify-between mb-4 shrink-0">
                        <h3 className="text-sm font-bold text-indigo-800 uppercase tracking-widest">Revenue Source</h3>
                        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 gap-1">
                            {['Dept', 'Doc', 'Proc'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setAnalyticsTab(t)}
                                    className={`px-2 py-1.5 rounded-md text-[11px] font-bold uppercase transition-colors ${analyticsTab === t ? 'bg-white text-indigo-600 shadow-sm border-b-2 border-indigo-600' : 'text-slate-500'
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                        {analyticsTab === 'Dept' && data.revenueByDepartment?.slice(0, 6).map((u: any, i: number) => (
                            <div key={i} className="flex justify-between items-center border border-slate-100 bg-slate-50 rounded-lg p-3">
                                <span className="font-semibold text-slate-700 text-sm">{u.name}</span>
                                <span className="font-bold text-slate-900">₹{u.value.toLocaleString()}</span>
                            </div>
                        ))}

                        {analyticsTab === 'Doc' && data.revenueByDoctor?.slice(0, 6).map((d: any, i: number) => (
                            <div key={i} className="flex justify-between items-center border border-slate-100 bg-slate-50 rounded-lg p-3">
                                <span className="font-semibold text-slate-700 text-sm">{d.name}</span>
                                <span className="font-bold text-slate-900">₹{d.value.toLocaleString()}</span>
                            </div>
                        ))}

                        {analyticsTab === 'Proc' && data.revenueByProcedure?.map((p: any, i: number) => (
                            <div key={i} className="flex justify-between items-center border border-slate-100 bg-slate-50 rounded-lg p-3">
                                <span className="font-semibold text-slate-700 text-sm">{p.name}</span>
                                <span className="font-bold text-slate-900">₹{p.value.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                {/* Critical System Alerts */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center mb-6">
                        <AlertTriangle size={16} className="text-amber-500 mr-2" />
                        Critical Action Required
                    </h3>
                    <div className="space-y-4">
                        {executive.operations.alerts?.pendingReports?.map((r: any, i: number) => (
                            <div key={`rep-${i}`} className="flex items-center justify-between p-3 rounded-lg border border-rose-100 bg-rose-50/50">
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">Pending Report: {r.patient} ({r.type})</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Created: {new Date(r.date).toLocaleDateString()}</p>
                                </div>
                                <span className="text-xs font-bold text-rose-600 bg-rose-100 px-2 py-1 rounded">Needs Review</span>
                            </div>
                        ))}
                        {executive.operations.alerts?.lowStock?.map((s: any, i: number) => (
                            <div key={`stk-${i}`} className="flex items-center justify-between p-3 rounded-lg border border-amber-100 bg-amber-50/50">
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">Low Stock: {s.name}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Inventory falling below minimum limits</p>
                                </div>
                                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded">{s.stock} {s.unit} Left</span>
                            </div>
                        ))}
                        {(!executive.operations.alerts?.pendingReports?.length && !executive.operations.alerts?.lowStock?.length) && (
                            <div className="text-center p-4 border border-slate-100 bg-slate-50 rounded-lg">
                                <p className="text-sm text-slate-500">No critical alerts requiring attention.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Expenses List - Quick Oversight */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center mb-6">
                        <TrendingDown size={16} className="text-rose-500 mr-2" />
                        Recent Expense Ledger
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100 text-left">
                            <thead>
                                <tr className="text-xs uppercase text-slate-400 font-semibold tracking-wide">
                                    <th className="pb-3 px-2">Date</th>
                                    <th className="pb-3 px-2">Category</th>
                                    <th className="pb-3 px-2">Description</th>
                                    <th className="pb-3 px-2 text-right">Amount OutFlow</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {data.expenseBreakdown?.slice(0, 5).map((e: any, i: number) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-2 text-sm text-slate-500">{new Date(e.date).toLocaleDateString()}</td>
                                        <td className="py-3 px-2 text-sm font-semibold text-slate-700">{e.category}</td>
                                        <td className="py-3 px-2 text-sm text-slate-500">{e.description || '-'}</td>
                                        <td className="py-3 px-2 text-sm font-bold text-rose-600 text-right">₹{e.amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                                {(!data.expenseBreakdown || data.expenseBreakdown.length === 0) && (
                                    <tr>
                                        <td colSpan={4} className="py-6 text-center text-sm text-slate-400">No recent expenses logged.</td>
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

export default AdminFinancials;
