import { useState, useEffect } from 'react';
import { IndianRupee, TrendingUp, TrendingDown, ArrowUpRight, Printer } from 'lucide-react';

const AdminFinancials = () => {
    const [financials, setFinancials] = useState<any>(null);
    const [analyticsTab, setAnalyticsTab] = useState('Dept');

    useEffect(() => {
        fetchFinancials();
    }, []);

    const fetchFinancials = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/analytics/financials');
            const data = await response.json();
            setFinancials(data);
        } catch (error) {
            console.error('Error fetching financials:', error);
        }
    };

    if (!financials) return <div className="p-8 text-center text-slate-500">Loading financials...</div>;

    return (
        <div className="space-y-6 pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Financial Summary</h1>
                    <p className="text-slate-500 text-sm mt-1">Overview of revenue, expenses, and clinic profitability.</p>
                </div>
                <button className="flex items-center justify-center space-x-2 bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm text-sm">
                    <Printer size={16} />
                    <span>Export PDF Report</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-shadow hover:shadow-md">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                            <TrendingUp size={20} />
                        </div>
                        <span className="flex items-center text-emerald-600 text-xs font-semibold bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                            <ArrowUpRight size={14} className="mr-1" />
                            +15%
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">Estimated Revenue</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-1">₹{financials.totalRevenue.toLocaleString()}</h3>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-shadow hover:shadow-md">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg border border-rose-100">
                            <TrendingDown size={20} />
                        </div>
                        <span className="flex items-center text-rose-600 text-xs font-semibold bg-rose-50 px-2 py-1 rounded-md border border-rose-100">
                            <ArrowUpRight size={14} className="mr-1" />
                            +5%
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">Total Expenses</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-1">₹{financials.totalExpenses.toLocaleString()}</h3>
                </div>

                <div className="bg-indigo-600 p-6 rounded-xl shadow-md text-white border border-indigo-700 transition-shadow hover:shadow-lg relative overflow-hidden">
                    <div className="relative z-10 flex items-center justify-between mb-4">
                        <div className="p-2.5 bg-indigo-700/50 rounded-lg backdrop-blur-sm border border-indigo-500/30">
                            <IndianRupee size={20} className="text-white" />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm text-indigo-100 font-medium">Net Profit (Loss)</p>
                        <h3 className="text-3xl font-bold mt-1 tracking-tight">₹{financials.netProfit.toLocaleString()}</h3>
                    </div>
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-indigo-400/20 blur-xl"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-hidden flex flex-col h-[500px]">
                    <div className="flex items-center justify-between mb-6 shrink-0">
                        <h3 className="text-lg font-bold text-slate-900">Deep Dive Analytics</h3>
                        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 gap-1">
                            {['Dept', 'Doc', 'Proc'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setAnalyticsTab(t)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${analyticsTab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                        }`}
                                >
                                    {t === 'Dept' ? 'Department' : t === 'Doc' ? 'Doctor' : 'Procedure'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3 overflow-y-auto pr-2 flex-1">
                        {analyticsTab === 'Dept' && financials.revenueByDepartment?.map((u: any, i: number) => (
                            <div key={i} className="flex flex-col p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 hover:bg-indigo-50/80 transition-colors group">
                                <div className="flex justify-between items-center mb-2.5">
                                    <span className="font-semibold text-slate-900 text-sm">{u.name}</span>
                                    <span className="font-bold text-indigo-700">₹{u.value.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-indigo-100/50 h-2 rounded-full overflow-hidden">
                                    <div className="bg-indigo-500 h-full rounded-full transition-all" style={{ width: `${(u.value / financials.totalRevenue) * 100}%` }}></div>
                                </div>
                                <span className="text-xs font-medium text-slate-500 mt-2">Share: {Math.round((u.value / financials.totalRevenue) * 100)}%</span>
                            </div>
                        ))}

                        {analyticsTab === 'Doc' && financials.revenueByDoctor?.map((d: any, i: number) => (
                            <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm border border-slate-300 shadow-sm">{d.name[0]}</div>
                                    <div>
                                        <p className="font-semibold text-slate-900 text-sm leading-tight">{d.name}</p>
                                        <p className="text-xs text-slate-500 font-medium mt-0.5">{d.specialization}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-slate-900">₹{d.value.toLocaleString()}</span>
                            </div>
                        ))}

                        {analyticsTab === 'Proc' && financials.revenueByProcedure?.map((p: any, i: number) => (
                            <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 hover:bg-emerald-50/80 transition-colors">
                                <p className="font-semibold text-slate-800 text-sm flex items-center">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2.5"></span>
                                    {p.name}
                                </p>
                                <span className="font-bold text-emerald-700">₹{p.value.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-[500px]">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 shrink-0">Ledger Breakdown</h3>
                    <div className="space-y-3 overflow-y-auto pr-2 flex-1">
                        {financials.expenseBreakdown.slice(0, 8).map((e: any) => (
                            <div key={e.id} className="flex items-start justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100/50 transition-colors border border-slate-100">
                                <div className="flex space-x-3">
                                    <div className="bg-rose-100 text-rose-600 p-2 rounded-lg shrink-0">
                                        <TrendingDown size={18} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 text-sm">{e.category}</p>
                                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                                            {new Date(e.date).toLocaleDateString()}
                                        </p>
                                        {e.description && (
                                            <p className="text-xs text-slate-600 mt-1 line-clamp-1">{e.description}</p>
                                        )}
                                    </div>
                                </div>
                                <span className="font-bold text-rose-600 shrink-0 ml-2 mt-1">₹{e.amount.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminFinancials;
