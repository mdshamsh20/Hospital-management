import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/lib/api';
import { dentalPlanSchema, dentalSittingSchema, dentalLabOrderSchema } from '@/lib/validations';
import { Plus, Search, ChevronRight, Stethoscope, Activity, Calendar, FlaskConical } from 'lucide-react';
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

const AdminDental = () => {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const planForm = useForm<any>({
        resolver: zodResolver(dentalPlanSchema),
        defaultValues: {
            patientName: '',
            primaryConcern: '',
            totalStages: 1,
            patientId: 1
        }
    });

    const sittingForm = useForm<any>({
        resolver: zodResolver(dentalSittingSchema),
        defaultValues: {
            procedureDone: '',
            toothNumber: '',
            materialUsed: '',
            notes: '',
            status: 'Completed'
        }
    });

    const [showPlanModal, setShowPlanModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [showSittingsModal, setShowSittingsModal] = useState(false);
    const [showLabModal, setShowLabModal] = useState(false);

    const labOrderForm = useForm<any>({
        resolver: zodResolver(dentalLabOrderSchema),
        defaultValues: {
            patientName: '',
            treatmentType: '',
            labName: '',
            caseType: '',
            expectedReturn: ''
        }
    });

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const data: any = await api.get('/dental/plans');
            setPlans(data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };

    const handleAddPlan = async (data: any) => {
        try {
            await api.post('/dental/plans', data);
            toast.success("Dental Treatment Plan Initiated.");
            planForm.reset();
            fetchPlans();
            setShowPlanModal(false);
        } catch (err) {
            // Handled
        }
    };

    const handleAddSitting = async (data: any) => {
        try {
            await api.post(`/dental/plans/${selectedPlan.id}/sittings`, {
                ...data,
                sittingNumber: (selectedPlan.sittings?.length || 0) + 1
            });
            toast.success("Sitting Committed: Record added to treatment plan.");
            sittingForm.reset();
            fetchPlans();
            setShowSittingsModal(false);
        } catch (err) {
            // Handled
        }
    };

    const openSittings = (plan: any) => {
        setSelectedPlan(plan);
        setShowSittingsModal(true);
    };

    const handleAddLabOrder = async (data: any) => {
        try {
            await api.post('/dental/lab-orders', data);
            toast.success("Lab Order Initiated: Forwarded to reception module.");
            labOrderForm.reset();
            setShowLabModal(false);
        } catch (err) {
            // Handled
        }
    };

    const openLabModal = () => {
        if (selectedPlan) {
            labOrderForm.setValue('patientName', selectedPlan.patientName);
            labOrderForm.setValue('treatmentType', selectedPlan.primaryConcern || 'Dental Work');
        }
        setShowLabModal(true);
    };

    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight leading-tight">Dental Unit</h1>
                    <div className="flex items-center mt-2.5">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 shadow-sm"></span>
                        <p className="text-slate-500 text-[11px] font-semibold tracking-wide">Multistage Treatment Plans & Patient History</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setShowPlanModal(true)}
                        className="h-10 bg-slate-900 text-white px-5 rounded-xl font-semibold text-[11px] tracking-wide hover:bg-slate-800 transition shadow-md inline-flex items-center gap-2"
                    >
                        <Plus size={15} />
                        New Treatment Plan
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/20">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            placeholder="Search by Patient Name or Concern..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition font-medium"
                        />
                    </div>
                </div>

                <div className="divide-y divide-slate-100">
                    {loading ? (
                        <div className="p-12 text-center text-slate-400 font-medium">Synchronizing Treatment Plans...</div>
                    ) : plans.length === 0 ? (
                        <div className="p-20 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                <Stethoscope size={24} className="text-slate-300" />
                            </div>
                            <h3 className="text-sm font-semibold text-slate-600">Archive is empty</h3>
                            <p className="text-xs text-slate-400 mt-1">No dental treatment plans are currently active.</p>
                        </div>
                    ) : plans.map((p) => (
                        <div key={p.id} className="p-6 hover:bg-slate-50/80 transition-all group cursor-pointer" onClick={() => openSittings(p)}>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center space-x-5">
                                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold text-lg shadow-sm transition-transform group-hover:scale-110">
                                        <Activity size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors tracking-tight">{p.patientName}</h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">{p.primaryConcern}</span>
                                            <span className="text-[10px] font-bold text-slate-400 flex items-center">
                                                <Calendar size={12} className="mr-1" />
                                                Started {new Date(p.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Treatment Progress</p>
                                        <p className="text-sm font-extrabold text-slate-700">{p.sittings?.length || 0} / {p.totalStages} Stages</p>
                                    </div>
                                    <Badge className={`px-3 py-1 text-[10px] font-semibold text-[11px] tracking-wide rounded-lg ${p.status === 'Active' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                                        {p.status}
                                    </Badge>
                                    <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sittings / Stage Management Modal */}
            <Dialog open={showSittingsModal} onOpenChange={setShowSittingsModal}>
                <DialogContent className="max-w-4xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl bg-white">
                    <DialogHeader className="p-8 bg-emerald-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <DialogTitle className="text-2xl font-bold tracking-tight">Treatment Lifecycle</DialogTitle>
                                <DialogDescription className="text-emerald-100 text-[11px] font-semibold tracking-wide mt-1">
                                    Patient: {selectedPlan?.patientName} · Concern: {selectedPlan?.primaryConcern}
                                </DialogDescription>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button onClick={openLabModal} className="bg-white/20 hover:bg-white/30 text-white border-white/30 px-4 py-1.5 font-bold text-[10px] uppercase h-8 shadow-none border">
                                    <FlaskConical size={14} className="mr-2" />
                                    Order Lab Work
                                </Button>
                                <Badge className="bg-white/20 text-white border-white/30 px-4 py-1.5 uppercase font-bold text-[10px]">
                                    Plan #DP-{selectedPlan?.id}
                                </Badge>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-slate-100 max-h-[70vh] overflow-hidden bg-white">
                        {/* New Sitting Form */}
                        <div className="p-8 space-y-6">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
                                <Plus size={16} className="text-emerald-600" /> Commit New Record
                            </h3>
                            <form onSubmit={sittingForm.handleSubmit(handleAddSitting)} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Procedure Done</label>
                                    <Controller
                                        name="procedureDone"
                                        control={sittingForm.control}
                                        render={({ field }) => (
                                            <select
                                                {...field}
                                                className={`w-full bg-slate-50 border ${sittingForm.formState.errors.procedureDone ? 'border-rose-500' : 'border-slate-200'} rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20`}
                                            >
                                                <option value="">Select Procedure</option>
                                                <option value="Scaling">Scaling</option>
                                                <option value="Extraction">Extraction</option>
                                                <option value="Filling">Filling</option>
                                                <option value="Root Canal Stage 1">Root Canal Stage 1</option>
                                                <option value="Root Canal Stage 2">Root Canal Stage 2</option>
                                                <option value="Root Canal Completion">Root Canal Completion</option>
                                                <option value="Crown Prep">Crown Prep</option>
                                                <option value="Crown Fitting">Crown Fitting</option>
                                            </select>
                                        )}
                                    />
                                    {sittingForm.formState.errors.procedureDone && <p className="text-[10px] text-rose-500 font-bold">{sittingForm.formState.errors.procedureDone.message as string}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase text-slate-400">Tooth #</label>
                                        <input
                                            {...sittingForm.register('toothNumber')}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none"
                                            placeholder="e.g. 18, 24"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase text-slate-400">Material</label>
                                        <input
                                            {...sittingForm.register('materialUsed')}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none"
                                            placeholder="GIC, Composite"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <textarea
                                        rows={3}
                                        {...sittingForm.register('notes')}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium outline-none"
                                        placeholder="Observations..."
                                    />
                                </div>
                                <Button type="submit" disabled={sittingForm.formState.isSubmitting} className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-100">
                                    {sittingForm.formState.isSubmitting ? 'Commiting...' : 'Commit Sitting'}
                                </Button>
                            </form>
                        </div>

                        {/* sitting Timeline */}
                        <div className="md:col-span-2 p-8 overflow-y-auto">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3 mb-6">Sitting Timeline</h3>
                            <div className="space-y-6">
                                {selectedPlan?.sittings?.length === 0 ? (
                                    <div className="py-12 text-center text-slate-400 italic text-sm">No sittings recorded for this plan.</div>
                                ) : selectedPlan?.sittings.map((s: any, i: number) => (
                                    <div key={i} className="relative pl-8 border-l-2 border-slate-100 pb-4 last:pb-0">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow-sm"></div>
                                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-tighter">Sitting #{s.sittingNumber}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(s.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-3 mb-3">
                                                <Badge className="bg-white border-emerald-100 text-emerald-700 text-[10px] font-bold px-3 py-1 uppercase">{s.procedureDone}</Badge>
                                                {s.toothNumber && <span className="text-[10px] font-bold text-slate-500">Tooth: {s.toothNumber}</span>}
                                            </div>
                                            <p className="text-xs text-slate-600 leading-relaxed font-medium">{s.notes || 'No notes documented.'}</p>
                                            {s.materialUsed && (
                                                <div className="mt-2 text-[10px] font-bold text-slate-400 italic">Material used: {s.materialUsed}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-6 border-t border-slate-100 flex items-center justify-end">
                        <Button variant="outline" onClick={() => setShowSittingsModal(false)} className="rounded-xl font-bold uppercase text-[10px] tracking-wider h-11 px-8 border-slate-200">Close Clinical Log</Button>
                    </div>
                </DialogContent>
            </Dialog>
            {/* New Plan Modal */}
            <Dialog open={showPlanModal} onOpenChange={setShowPlanModal}>
                <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden border-none shadow-2xl bg-white">
                    <DialogHeader className="p-6 bg-slate-900 text-white">
                        <DialogTitle className="text-xl font-bold uppercase tracking-tight">Initiate Treatment Plan</DialogTitle>
                        <DialogDescription className="text-slate-400 text-[11px] font-semibold tracking-wide mt-1">Setup lifecycle for multistage dental work</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={planForm.handleSubmit(handleAddPlan)} className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Patient Name</label>
                            <input
                                {...planForm.register('patientName')}
                                className={`w-full bg-slate-50 border ${planForm.formState.errors.patientName ? 'border-rose-500' : 'border-slate-200'} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition font-medium`}
                                placeholder="Patient Full Name"
                            />
                            {planForm.formState.errors.patientName && <p className="text-[10px] text-rose-500 font-bold">{planForm.formState.errors.patientName.message as string}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Primary Concern</label>
                            <input
                                {...planForm.register('primaryConcern')}
                                className={`w-full bg-slate-50 border ${planForm.formState.errors.primaryConcern ? 'border-rose-500' : 'border-slate-200'} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition font-medium`}
                                placeholder="e.g. Scaling, Root Canal"
                            />
                            {planForm.formState.errors.primaryConcern && <p className="text-[10px] text-rose-500 font-bold">{planForm.formState.errors.primaryConcern.message as string}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Estimated Stages</label>
                            <input
                                type="number"
                                {...planForm.register('totalStages')}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition font-medium"
                                placeholder="Number of expected sittings"
                            />
                        </div>
                        <Button type="submit" disabled={planForm.formState.isSubmitting} className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-[11px] tracking-wide shadow-lg shadow-emerald-100 mt-2">
                            {planForm.formState.isSubmitting ? 'Processing...' : 'Start Treatment Lifecycle'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
            <Dialog open={showLabModal} onOpenChange={setShowLabModal}>
                <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden border-none shadow-2xl bg-white">
                    <DialogHeader className="p-6 bg-slate-900 text-white">
                        <DialogTitle className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
                            <FlaskConical size={20} className="text-indigo-400" /> Initiate Lab Order
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 text-[11px] font-semibold tracking-wide mt-1">Send fabrication requests for crowns, dentures, etc.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={labOrderForm.handleSubmit(handleAddLabOrder)} className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Patient Name</label>
                            <input
                                {...labOrderForm.register('patientName')}
                                className={`w-full bg-slate-50 border ${labOrderForm.formState.errors.patientName ? 'border-rose-500' : 'border-slate-200'} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition font-medium`}
                                readOnly
                            />
                            {labOrderForm.formState.errors.patientName && <p className="text-[10px] text-rose-500 font-bold">{labOrderForm.formState.errors.patientName.message as string}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Treatment / Procedure</label>
                            <input
                                {...labOrderForm.register('treatmentType')}
                                className={`w-full bg-slate-50 border ${labOrderForm.formState.errors.treatmentType ? 'border-rose-500' : 'border-slate-200'} rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition font-medium`}
                            />
                            {labOrderForm.formState.errors.treatmentType && <p className="text-[10px] text-rose-500 font-bold">{labOrderForm.formState.errors.treatmentType.message as string}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Lab Name</label>
                                <input
                                    {...labOrderForm.register('labName')}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition font-medium"
                                    placeholder="e.g. Apex Labs"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Case Type</label>
                                <input
                                    {...labOrderForm.register('caseType')}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition font-medium"
                                    placeholder="Crown, CD, Implant"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Expected Return Date</label>
                            <input
                                type="date"
                                {...labOrderForm.register('expectedReturn')}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition font-medium"
                            />
                        </div>
                        <Button type="submit" disabled={labOrderForm.formState.isSubmitting} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-[11px] tracking-wide shadow-lg shadow-indigo-100 mt-2">
                            {labOrderForm.formState.isSubmitting ? 'Processing...' : 'Dispatch Lab Order'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminDental;
