import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { FileText, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const AdminReports = () => {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const userRole = localStorage.getItem('role') || '';

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const data: any = await api.get('/admin/reports'); // Assumes generic reports endpoint or specific admin one
            setReports(data || []);
        } catch (error) {
            toast.error('Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    const handleFinalize = async (id: number) => {
        if (!confirm('Are you sure you want to finalize this report? It cannot be edited after finalization.')) return;

        try {
            await api.patch(`/admin/reports/${id}/finalize`); // Need to ensure this endpoint exists backend
            toast.success('Report marked as Final');
            fetchReports();
        } catch (error) {
            toast.error('Failed to finalize report');
        }
    };

    const handleReopen = async (id: number) => {
        const reason = prompt("Enter reason for reopening the report:");
        if (!reason && reason !== "") return; // Allow empty reason if they just hit OK, but cancel on null

        try {
            await api.patch(`/admin/reports/${id}/reopen`, { reason });
            toast.success('Report reopened successfully');
            fetchReports();
        } catch (error) {
            toast.error('Failed to reopen report');
        }
    };

    const handleSendBack = async (id: number) => {
        const remark = prompt("Enter remark for correction:");
        if (!remark) return;

        try {
            await api.patch(`/admin/reports/${id}/status`, { status: 'DRAFT', remarks: remark });
            toast.success('Report sent back for correction');
            fetchReports();
        } catch (error) {
            toast.error('Failed to send back report');
        }
    };

    const handleReject = async (id: number) => {
        const remark = prompt("Enter reason for rejection:");
        if (!remark) return;

        try {
            await api.patch(`/admin/reports/${id}/status`, { status: 'REJECTED', remarks: remark });
            toast.success('Report rejected');
            fetchReports();
        } catch (error) {
            toast.error('Failed to reject report');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Draft': return 'bg-slate-100 text-slate-700 border-slate-200';
            case 'Under Review': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Final': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Delivered': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="space-y-6 pb-8 font-sans">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Clinical Reports</h1>
                    <p className="text-slate-500 text-sm mt-1 flex items-center font-medium">
                        <FileText className="mr-2 text-indigo-600" size={16} />
                        Review and Finalize Diagnostic Reports
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient & Service</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Timeline</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Sign-Off</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">Loading reports...</td></tr>
                            ) : reports.length === 0 ? (
                                <tr><td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-500 font-medium">No reports found in the system.</td></tr>
                            ) : reports.map((report) => (
                                <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold border border-indigo-100">
                                                {report.patient?.name?.charAt(0) || 'P'}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-slate-900">{report.patient?.name || 'Unknown Patient'}</div>
                                                <div className="text-xs text-slate-500 mt-0.5">{report.serviceType} Report</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-md border ${getStatusBadge(report.status)}`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        <div className="flex items-center">
                                            <Clock size={14} className="mr-1.5 text-slate-400" />
                                            {new Date(report.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {report.status === 'Under Review' ? (
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleSendBack(report.id)}
                                                    className="inline-flex items-center text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors text-xs shadow-sm font-semibold"
                                                >
                                                    Send Back
                                                </button>
                                                <button
                                                    onClick={() => handleReject(report.id)}
                                                    className="inline-flex items-center text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-lg transition-colors text-xs shadow-sm font-semibold"
                                                >
                                                    Reject
                                                </button>
                                                <button
                                                    onClick={() => handleFinalize(report.id)}
                                                    className="inline-flex items-center text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition-colors text-xs shadow-sm font-semibold"
                                                >
                                                    <CheckCircle size={14} className="mr-1.5" />
                                                    Finalize
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-end space-x-2">
                                                <span className="text-slate-400 text-xs font-medium flex items-center">
                                                    <CheckCircle size={14} className="mr-1.5 text-emerald-500" />
                                                    {report.finalizedBy || 'Signed Off'}
                                                </span>
                                                {userRole === 'super_admin' && (
                                                    <button
                                                        onClick={() => handleReopen(report.id)}
                                                        className="ml-2 inline-flex items-center text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg transition-colors text-xs shadow-sm font-semibold"
                                                    >
                                                        Reopen
                                                    </button>
                                                )}
                                            </div>
                                        )}
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

export default AdminReports;
