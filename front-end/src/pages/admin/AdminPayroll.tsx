import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { IndianRupee, Users, Calendar, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from "sonner";

const AdminPayroll = () => {
    const [payrollData, setPayrollData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);

    useEffect(() => {
        fetchPayroll();
    }, []);

    const fetchPayroll = async () => {
        try {
            const data: any = await api.get('/admin/payroll');
            setPayrollData(data);
        } catch (err) {
            console.error('Payroll fetch failed');
        } finally {
            setLoading(false);
        }
    };

    const processPayment = async (staff: any) => {
        setProcessingId(staff.id);
        try {
            await api.post('/admin/payroll/process', {
                staffId: staff.id,
                amount: staff.payable
            });
            toast.success(`Payment processed for ${staff.name}`);
            fetchPayroll();
        } catch (err) {
            // Handled
        } finally {
            setProcessingId(null);
        }
    };

    const processAllPayments = async () => {
        try {
            await api.post('/admin/payroll/process', {});
            toast.success("Bulk payment processing initialized");
            fetchPayroll();
        } catch (err) {
            // Handled
        }
    };


    const totalPayable = payrollData.reduce((acc, curr) => acc + (curr.payable || 0), 0);

    return (
        <div className="space-y-6 pb-8">
            <div className="flex justify-between items-center bg-slate-900 p-8 rounded-xl text-white shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold tracking-tight">Attendance & Payroll Summary</h1>
                    <p className="text-slate-400 text-sm font-medium mt-1 flex items-center">
                        <Calendar className="mr-2 text-indigo-400" size={16} />
                        Automated Salary Calculation based on presence
                    </p>
                </div>
                <div className="relative z-10 text-right">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Monthly Disbursement</p>
                    <p className="text-4xl font-bold mt-1 flex items-center justify-end">
                        <IndianRupee size={28} className="mr-1 text-indigo-400" />
                        {totalPayable.toLocaleString()}
                    </p>
                </div>
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200 bg-white flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                <Users size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Staff Salary Log</h2>
                                <p className="text-xs text-slate-500 font-medium">Active Payroll Cycle</p>
                            </div>
                        </div>
                        <button
                            onClick={processAllPayments}
                            className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-emerald-700 transition"
                        >
                            <span>Process All Payments</span>
                            <ArrowRight size={16} />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Staff Associate</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Base Salary</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Days Present</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Payable Amount</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Payment Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i}>
                                            <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                                            <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                                            <td className="px-6 py-4"><Skeleton className="h-4 w-28" /></td>
                                            <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                                            <td className="px-6 py-4"><Skeleton className="h-5 w-20 rounded" /></td>
                                            <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 ml-auto rounded-full" /></td>
                                        </tr>
                                    ))
                                ) : payrollData.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">
                                            No payroll records found.
                                        </td>
                                    </tr>
                                ) : (
                                    payrollData.map((staff) => (
                                        <tr key={staff.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-sm border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                        {staff.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900">{staff.name}</p>
                                                        <p className="text-xs text-slate-500 font-medium">{staff.role}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium text-slate-900">₹{staff.actualSalary?.toLocaleString()}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm font-medium text-slate-900">{staff.daysPresent}</span>
                                                    <span className="text-xs text-slate-500 font-medium">/ 30</span>
                                                </div>
                                                <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1.5">
                                                    <div
                                                        className="h-full bg-emerald-500 rounded-full"
                                                        style={{ width: `${Math.min(100, (staff.daysPresent / 30) * 100)}%` }}
                                                    ></div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-semibold text-emerald-600">₹{staff.payable.toLocaleString()}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${staff.status === 'Paid'
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                                    }`}>
                                                    {staff.status === 'Paid' ? 'Paid' : 'Ready for Payout'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => processPayment(staff)}
                                                    disabled={processingId === staff.id || staff.status === 'Paid'}
                                                    className={`p-2 rounded-lg transition-all ${staff.status === 'Paid'
                                                        ? 'text-emerald-600 bg-emerald-50 cursor-default'
                                                        : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                                                        } disabled:opacity-50`}
                                                >
                                                    {processingId === staff.id ? (
                                                        <Loader2 size={18} className="animate-spin" />
                                                    ) : staff.status === 'Paid' ? (
                                                        <CheckCircle2 size={18} />
                                                    ) : (
                                                        <ArrowRight size={18} />
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPayroll;
