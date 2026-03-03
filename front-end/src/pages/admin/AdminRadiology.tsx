import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/lib/api';
import { diagnosticOrderSchema, medicalReportSchema } from '@/lib/validations';
import { Search, Clock, CheckCircle2, FileText, Plus, Activity, Edit } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

const AdminRadiology = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    const orderForm = useForm<any>({
        resolver: zodResolver(diagnosticOrderSchema),
        defaultValues: {
            patientName: '',
            type: 'X-Ray',
            testName: '',
            priority: 'Normal',
            patientId: 1
        }
    });

    const reportForm = useForm<any>({
        resolver: zodResolver(medicalReportSchema),
        defaultValues: {
            findings: '',
            impression: '',
            recommendations: '',
            status: 'Draft'
        }
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data: any = await api.get('/reports/orders');
            setOrders(data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const handleAddOrder = async (data: any) => {
        try {
            await api.post('/reports/orders', data);
            setShowAddModal(false);
            orderForm.reset();
            toast.success("Diagnostic Order Initiated.");
            fetchOrders();
        } catch (error) {
            // Handled
        }
    };

    const updateOrderStatus = async (id: number, status: string) => {
        try {
            await api.patch(`/reports/orders/${id}/status`, { status });
            toast.success(`Workflow: Order marked as ${status}`);
            fetchOrders();
        } catch (error) {
            // Handled
        }
    };

    const openReportModal = (order: any) => {
        setSelectedOrder(order);
        reportForm.reset({
            findings: order.report?.findings || '',
            impression: order.report?.impression || '',
            recommendations: order.report?.recommendations || '',
            status: order.report?.status || 'Draft',
            orderId: order.id,
            patientId: order.patientId,
            serviceType: order.type
        });
        setShowReportModal(true);
    };

    const handleSaveReport = async (data: any) => {
        try {
            await api.post('/reports', data);
            toast.success(data.status === 'Final' ? "Report Finalized & Committed." : "Draft Saved.");
            setShowReportModal(false);
            fetchOrders();
        } catch (error) {
            // Handled
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-slate-100 text-slate-600 border-slate-200';
            case 'In Progress': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            default: return 'bg-slate-50 text-slate-500 border-slate-100';
        }
    };

    const filteredOrders = orders.filter(o =>
        o.patient?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.testName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight leading-tight">Radiology & Imaging</h1>
                    <div className="flex items-center mt-2.5">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 shadow-sm"></span>
                        <p className="text-slate-500 text-[11px] font-semibold tracking-wide">Diagnostic Orders & Technical Reporting</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setShowAddModal(true)}
                        className="h-10 bg-slate-900 text-white px-5 rounded-xl font-medium text-[11px] tracking-wide hover:bg-slate-800 transition shadow-md inline-flex items-center gap-2"
                    >
                        <Plus size={15} />
                        New Diagnostic Order
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/20">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            placeholder="Search by Patient or Test Type..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition font-medium"
                        />
                    </div>
                </div>

                <div className="divide-y divide-slate-100">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center space-x-5">
                                        <Skeleton className="w-14 h-14 rounded-2xl" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-40" />
                                            <Skeleton className="h-3 w-24" />
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <Skeleton className="h-6 w-20 rounded-lg" />
                                        <Skeleton className="h-9 w-28 rounded-lg" />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : filteredOrders.length === 0 ? (
                        <div className="p-20 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                <Activity size={24} className="text-slate-300" />
                            </div>
                            <h3 className="text-sm font-semibold text-slate-600">Queue is empty</h3>
                            <p className="text-xs text-slate-400 mt-1">No active diagnostic orders in the pipeline.</p>
                        </div>
                    ) : filteredOrders.map((o) => (
                        <div key={o.id} className="p-6 hover:bg-slate-50/80 transition-all group">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center space-x-5">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-semibold text-lg shadow-sm border transition-transform group-hover:scale-110 ${o.type === 'X-Ray' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>
                                        {o.type === 'X-Ray' ? <FileText size={24} /> : <Activity size={24} />}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors tracking-tight">{o.patient?.name || 'Walk-in Patient'}</h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">{o.testName || o.type}</span>
                                            <span className="text-[10px] font-bold text-slate-400 flex items-center">
                                                <Clock size={12} className="mr-1" />
                                                {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 items-center">
                                    <Badge variant="outline" className={`px-3 py-1 text-[10px] font-semibold text-[11px] tracking-wide rounded-lg ${getStatusVariant(o.status)}`}>
                                        {o.status}
                                    </Badge>

                                    <div className="flex items-center gap-2">
                                        {o.status === 'Pending' && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => updateOrderStatus(o.id, 'In Progress')}
                                                className="rounded-lg h-9 px-4 text-[10px] font-semibold tracking-wider"
                                            >
                                                Start Exam
                                            </Button>
                                        )}
                                        {o.status === 'In Progress' && (
                                            <Button
                                                size="sm"
                                                onClick={() => openReportModal(o)}
                                                className="rounded-lg h-9 px-4 text-[10px] font-semibold tracking-wider bg-indigo-600 hover:bg-indigo-700"
                                            >
                                                Draft Report
                                            </Button>
                                        )}
                                        {o.status === 'Completed' && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => openReportModal(o)}
                                                className="rounded-lg h-9 px-4 text-[10px] font-semibold tracking-wider text-indigo-600 hover:bg-indigo-50"
                                            >
                                                View Report
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Order Modal */}
            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden border-none shadow-2xl bg-white">
                    <DialogHeader className="p-6 bg-slate-900 text-white">
                        <DialogTitle className="text-xl font-bold uppercase tracking-tight">Initiate Diagnostic Order</DialogTitle>
                        <DialogDescription className="text-slate-400 text-[11px] font-semibold tracking-wide mt-1">Manual order entry for technicians</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={orderForm.handleSubmit(handleAddOrder)} className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Patient Name</label>
                            <input
                                {...orderForm.register('patientName')}
                                className={`w-full bg-slate-50 border ${orderForm.formState.errors.patientName ? 'border-rose-500' : 'border-slate-200'} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition font-medium`}
                                placeholder="Patient Full Name"
                            />
                            {orderForm.formState.errors.patientName && <p className="text-[10px] text-rose-500 font-bold">{orderForm.formState.errors.patientName.message as string}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Modality</label>
                                <Controller
                                    name="type"
                                    control={orderForm.control}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20"
                                        >
                                            <option value="X-Ray">X-Ray</option>
                                            <option value="Ultrasound">Ultrasound</option>
                                        </select>
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Priority</label>
                                <Controller
                                    name="priority"
                                    control={orderForm.control}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20"
                                        >
                                            <option value="Normal">Normal</option>
                                            <option value="Urgent">Urgent</option>
                                        </select>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Specific Test</label>
                            <input
                                {...orderForm.register('testName')}
                                className={`w-full bg-slate-50 border ${orderForm.formState.errors.testName ? 'border-rose-500' : 'border-slate-200'} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition font-medium`}
                                placeholder="e.g. OPG / Abdomen"
                            />
                            {orderForm.formState.errors.testName && <p className="text-[10px] text-rose-500 font-semibold">{orderForm.formState.errors.testName.message as string}</p>}
                        </div>
                        <Button type="submit" disabled={orderForm.formState.isSubmitting} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-[11px] tracking-wide shadow-lg shadow-indigo-100 mt-2">
                            {orderForm.formState.isSubmitting ? 'Processing...' : 'Commit Order'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Reporting Modal */}
            <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
                <DialogContent className="max-w-3xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl bg-white">
                    <DialogHeader className="p-8 bg-indigo-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <DialogTitle className="text-2xl font-semibold tracking-tight">Clinical Report Editor</DialogTitle>
                                <DialogDescription className="text-indigo-100 text-[11px] font-medium tracking-wide mt-1">
                                    Patient: {selectedOrder?.patient?.name} · Order: #DO-{selectedOrder?.id}
                                </DialogDescription>
                            </div>
                            <Badge className="bg-white/20 text-white border-white/30 px-4 py-1.5 font-semibold text-[10px]">
                                {selectedOrder?.type} / {selectedOrder?.testName}
                            </Badge>
                        </div>
                    </DialogHeader>

                    <form onSubmit={reportForm.handleSubmit(handleSaveReport)}>
                        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto bg-white">
                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold text-slate-400 tracking-widest flex items-center gap-2">
                                    <Edit size={14} /> Findings
                                </label>
                                <textarea
                                    rows={6}
                                    {...reportForm.register('findings')}
                                    className={`w-full bg-slate-50 border ${reportForm.formState.errors.findings ? 'border-rose-500' : 'border-slate-200'} rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition font-medium leading-relaxed`}
                                    placeholder="Enter detailed observations..."
                                />
                                {reportForm.formState.errors.findings && <p className="text-[10px] text-rose-500 font-bold">{reportForm.formState.errors.findings.message as string}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold text-slate-400 tracking-widest flex items-center gap-2">
                                        <Activity size={14} /> Impression
                                    </label>
                                    <textarea
                                        rows={3}
                                        {...reportForm.register('impression')}
                                        className={`w-full bg-slate-50 border ${reportForm.formState.errors.impression ? 'border-rose-500' : 'border-slate-200'} rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition font-medium`}
                                        placeholder="Brief clinical impression..."
                                    />
                                    {reportForm.formState.errors.impression && <p className="text-[10px] text-rose-500 font-bold">{reportForm.formState.errors.impression.message as string}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold text-slate-400 tracking-widest flex items-center gap-2">
                                        <CheckCircle2 size={14} /> Recommendations
                                    </label>
                                    <textarea
                                        rows={3}
                                        {...reportForm.register('recommendations')}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition font-medium"
                                        placeholder="Follow-up advice..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-6 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-semibold text-slate-400">Status:</span>
                                <Controller
                                    name="status"
                                    control={reportForm.control}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            className="bg-white border border-slate-200 rounded-lg text-[10px] font-semibold px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        >
                                            <option value="Draft">Draft (Internal)</option>
                                            <option value="Final">Final (Committed)</option>
                                        </select>
                                    )}
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <Button type="button" variant="ghost" onClick={() => setShowReportModal(false)} className="rounded-xl font-semibold text-xs tracking-wider h-11 px-6">Cancel</Button>
                                <Button type="submit" disabled={reportForm.formState.isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs tracking-wider h-11 px-8 shadow-lg shadow-indigo-100 flex items-center gap-2">
                                    <Activity size={16} />
                                    {reportForm.watch('status') === 'Final' ? 'Commit & Finalize' : 'Save Draft'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminRadiology;
