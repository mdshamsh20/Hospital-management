import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { IndianRupee, FileText, CheckCircle, Clock, Search } from 'lucide-react';
import { toast } from 'sonner';

const AdminCommissions = () => {
    const [commissions, setCommissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [approving, setApproving] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'long', year: 'numeric' }));
    const userRole = localStorage.getItem('role');

    useEffect(() => {
        fetchCommissions();
    }, [selectedMonth]);

    const fetchCommissions = async () => {
        setLoading(true);
        try {
            const data: any = await api.get(`/admin/commissions?month=${selectedMonth}`);
            setCommissions(data || []);
        } catch (error) {
            toast.error('Failed to load commissions');
        } finally {
            setLoading(false);
        }
    };

    const handleApproveSelected = async () => {
        const pendingIds = commissions.filter(c => c.status === 'Pending').map(c => c.id);
        if (pendingIds.length === 0) {
            toast.info('No pending commissions to approve');
            return;
        }

        if (!confirm(`Are you sure you want to approve ${pendingIds.length} commission records?`)) return;

        setApproving(true);
        try {
            await api.post('/admin/commissions/approve', { ids: pendingIds });
            toast.success(`Approved ${pendingIds.length} commission records`);
            fetchCommissions();
        } catch (error) {
            toast.error('Failed to approve commissions');
        } finally {
            setApproving(false);
        }
    };

    const totalCommission = commissions.reduce((sum, record) => sum + (record.commissionAmount || 0), 0);
    const pendingAmount = commissions.filter(c => c.status === 'Pending').reduce((sum, record) => sum + (record.commissionAmount || 0), 0);
    const totalBilling = commissions.reduce((sum, record) => sum + (record.totalBilling || 0), 0);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="space-y-6 pb-8 font-sans">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Referral Commissions</h1>
                    <p className="text-slate-500 text-sm mt-1 flex items-center font-medium">
                        <IndianRupee className="mr-2 text-indigo-600" size={16} />
                        Review and approve referral and consultation splits
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg p-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value={new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}>Current Month</option>
                        {/* More dates can be added dynamically */}
                    </select>
                    {(userRole === 'super_admin' || userRole === 'admin') && (
                        <button
                            onClick={handleApproveSelected}
                            disabled={approving || commissions.filter(c => c.status === 'Pending').length === 0}
                            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                            <CheckCircle size={16} />
                            <span>{approving ? 'Approving...' : 'Approve All Pending'}</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 tracking-wide uppercase mb-1">Total Payout Calculated</p>
                            <h3 className="text-3xl font-bold text-slate-900">₹{totalCommission.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 bg-indigo-50 rounded-lg">
                            <IndianRupee className="text-indigo-600" size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-amber-600 tracking-wide uppercase mb-1">Pending Approval</p>
                            <h3 className="text-3xl font-bold text-amber-700">₹{pendingAmount.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-lg">
                            <Clock className="text-amber-500" size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 tracking-wide uppercase mb-1">Total Referral Revenue</p>
                            <h3 className="text-3xl font-bold text-slate-900">₹{totalBilling.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-lg">
                            <FileText className="text-emerald-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="relative w-64">
                        <input
                            type="text"
                            placeholder="Search by doctor or patient..."
                            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date & Patient</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Referred By</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Billing</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Commission</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">Loading records...</td></tr>
                            ) : commissions.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500 font-medium">No commission records found for this period.</td></tr>
                            ) : commissions.map((record) => (
                                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-slate-900">{record.patientName}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">{new Date(record.createdAt).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold text-slate-900">{record.doctorName}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">Calculated @ {record.percentage}%</div>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium text-slate-900">
                                        ₹{record.totalBilling.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-bold text-indigo-600">
                                        ₹{record.commissionAmount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-md border ${getStatusBadge(record.status)}`}>
                                            {record.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminCommissions;
