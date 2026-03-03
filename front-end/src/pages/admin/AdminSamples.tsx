import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Boxes, IndianRupee, FlaskConical, Search, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const AdminSamples = () => {
    const [samples, setSamples] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSamples();
    }, []);

    const fetchSamples = async () => {
        setLoading(true);
        try {
            const data: any = await api.get('/admin/samples');
            setSamples(data || []);
        } catch (error) {
            toast.error('Failed to load sample tracking');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyPayment = async (id: number) => {
        try {
            await api.patch(`/admin/samples/${id}`, { paymentStatus: 'Paid' });
            toast.success('Payment verified successfully');
            fetchSamples();
        } catch (error) {
            toast.error('Failed to verify payment');
        }
    };

    const handleFlagMismatch = async (id: number) => {
        const reason = prompt("Enter mismatch reason (e.g. Disputed, Pending, Price change):");
        if (!reason) return;
        try {
            await api.patch(`/admin/samples/${id}`, { paymentStatus: 'Mismatched', notes: reason });
            toast.warning('Sample flagged for mismatch');
            fetchSamples();
        } catch (error) {
            toast.error('Failed to flag sample');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Collected': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Sent to Lab': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Partner Received': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Result Uploaded': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getPaymentBadge = (status: string) => {
        switch (status) {
            case 'Paid': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Mismatched': return 'bg-rose-100 text-rose-700 border-rose-200 font-bold';
            case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const totalRevenue = samples.reduce((sum, s) => sum + (s.amountCollected || 0), 0);
    const totalMargin = samples.reduce((sum, s) => sum + (s.margin || 0), 0);

    return (
        <div className="space-y-6 pb-8 font-sans">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sample Collection Tracker</h1>
                    <p className="text-slate-500 text-sm mt-1 flex items-center font-medium">
                        <FlaskConical className="mr-2 text-indigo-600" size={16} />
                        Monitor external lab diagnostics and financial margins
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Summary Cards */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 tracking-wide uppercase mb-1">Total Collections</p>
                            <h3 className="text-3xl font-bold text-slate-900">{samples.length} Samples</h3>
                        </div>
                        <div className="p-3 bg-indigo-50 rounded-lg">
                            <Boxes className="text-indigo-600" size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 tracking-wide uppercase mb-1">Total Patient Billing</p>
                            <h3 className="text-3xl font-bold text-slate-900">₹{totalRevenue.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-lg">
                            <IndianRupee className="text-emerald-600" size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-emerald-600 tracking-wide uppercase mb-1">Retained Margin</p>
                            <h3 className="text-3xl font-bold text-emerald-700">₹{totalMargin.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-lg">
                            <FlaskConical className="text-emerald-500" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="relative w-64">
                        <input
                            type="text"
                            placeholder="Search tests or patients..."
                            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Sample ID & Details</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Test Name</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Financials</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">Loading tracking data...</td></tr>
                            ) : samples.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500 font-medium">No samples logged.</td></tr>
                            ) : samples.map((sample) => (
                                <tr key={sample.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-slate-900">{sample.sampleId || `SMP-${sample.id.toString().padStart(4, '0')}`}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">{sample.patientName}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold text-slate-900">{sample.testName || 'General Panel'}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center space-y-2">
                                        <div className="flex flex-col items-center space-y-1">
                                            <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-md border ${getStatusBadge(sample.status)}`}>
                                                {sample.status}
                                            </span>
                                            <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-md border ${getPaymentBadge(sample.paymentStatus)}`}>
                                                {sample.paymentStatus}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="text-sm font-semibold text-slate-900 space-y-1">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-slate-500 mr-2">Billed:</span>
                                                <span>₹{sample.amountCollected}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-rose-500 mr-2">Lab Fee:</span>
                                                <span className="text-rose-600">-₹{sample.labPayment}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-1 mt-1">
                                                <span className="text-emerald-600 mr-2">Margin:</span>
                                                <span className="text-emerald-700 font-bold">₹{sample.margin}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right align-middle">
                                        <div className="flex flex-col space-y-2 items-end">
                                            {sample.paymentStatus !== 'Paid' && (
                                                <button
                                                    onClick={() => handleVerifyPayment(sample.id)}
                                                    className="inline-flex items-center text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors text-xs font-semibold shadow-sm border border-indigo-200 w-full justify-center"
                                                >
                                                    <CheckCircle size={14} className="mr-1.5" />
                                                    Verify Payment
                                                </button>
                                            )}
                                            {sample.paymentStatus !== 'Mismatched' && sample.paymentStatus !== 'Paid' && (
                                                <button
                                                    onClick={() => handleFlagMismatch(sample.id)}
                                                    className="inline-flex items-center text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors text-xs font-semibold shadow-sm border border-rose-200 w-full justify-center"
                                                >
                                                    Flag Mismatch
                                                </button>
                                            )}
                                            {sample.notes && (
                                                <div className="text-xs text-rose-500 font-medium italic mt-1 text-right max-w-[150px] truncate" title={sample.notes}>
                                                    "{sample.notes}"
                                                </div>
                                            )}
                                        </div>
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

export default AdminSamples;
