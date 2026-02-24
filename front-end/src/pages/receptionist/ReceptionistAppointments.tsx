import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, UserPlus, Building2, MoreVertical, RefreshCw, Activity, Phone, Calendar, UserCheck, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const ReceptionistAppointments = () => {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        name: '', age: '', gender: 'Male', phone: '',
        departmentId: '', doctorId: '', visitType: 'Consultation',
        priority: 'Normal', referredBy: '',
        estimatedWait: '15', notes: '', isWalkIn: true
    });
    const [departments, setDepartments] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);

    useEffect(() => {
        fetchMetadata();
        fetchAppointments();
    }, []);

    const fetchMetadata = async () => {
        try {
            const [deptRes, docRes] = await Promise.all([
                axios.get('http://localhost:8080/api/departments'),
                axios.get('http://localhost:8080/api/doctors')
            ]);
            setDepartments(deptRes.data);
            setDoctors(docRes.data);
        } catch (err) {
            console.error('Failed to fetch metadata');
            toast.error("Registry Sync Failed: Could not load clinical departments.");
        }
    };

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:8080/api/appointments');
            setAppointments(res.data);
        } catch (err) {
            console.error('Failed to fetch appointments');
            toast.error("Operation Sync Failed: Could not refresh appointment stream.");
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/appointments/register', formData);
            setShowRegisterModal(false);
            setFormData({
                name: '', age: '', gender: 'Male', phone: '',
                departmentId: '', doctorId: '', visitType: 'Consultation',
                priority: 'Normal', referredBy: '',
                estimatedWait: '15', notes: '', isWalkIn: true
            });
            fetchAppointments();
            toast.success("Registration Initialized: Patient data committed to ledger.");
        } catch (err) {
            toast.error("Protocol Violation: Patient registration data rejected.");
        }
    };

    const updateStatus = async (id: number, status: string) => {
        try {
            await axios.patch(`http://localhost:8080/api/appointments/${id}/status`, { status });
            fetchAppointments();
            toast.success(`Lifecycle Transitioned: Status moved to ${status}`);
        } catch (err) {
            toast.error("Transition Rejected: Internal system state conflict.");
        }
    };

    const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" => {
        switch (status) {
            case 'Registered': return "secondary";
            case 'Waiting': return "default";
            case 'Calling': return "warning";
            case 'With Doctor': return "default";
            case 'Procedure': return "default";
            case 'Completed': return "success";
            case 'Billing': return "warning";
            case 'Closed': return "secondary";
            default: return "secondary";
        }
    };

    const getAssignedRoom = (deptId: number | null) => {
        const deptName = departments.find(d => d.id === deptId)?.name?.toLowerCase() || '';
        if (deptName.includes('dental')) return 'D-UNIT 1';
        if (deptName.includes('x-ray')) return 'RAD-01';
        if (deptName.includes('ultrasound')) return 'US-04';
        return 'OPD-CONSULT';
    };

    const filteredAppointments = appointments.filter(appt =>
        (appt.patient?.name || appt.name).toLowerCase().includes(searchQuery.toLowerCase()) ||
        (appt.patient?.phone || appt.phone).includes(searchQuery)
    );

    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight uppercase leading-none">Operational Queue</h1>
                    <div className="flex items-center mt-3">
                        <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full mr-2 shadow-[0_0_8px_rgba(99,102,241,0.4)]"></span>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Live Flow & Lifecycle Management</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={fetchAppointments}
                        className="h-12 w-12 border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 transition bg-white shadow-sm border"
                    >
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    </Button>
                    <Dialog open={showRegisterModal} onOpenChange={setShowRegisterModal}>
                        <DialogTrigger asChild>
                            <Button
                                className="h-12 bg-slate-900 text-white px-8 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-slate-800 transition shadow-2xl shadow-slate-900/10 border-none inline-flex items-center gap-2 group"
                            >
                                <UserPlus size={16} className="group-hover:rotate-12 transition-transform" />
                                <span>New Case Entry</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl border-none shadow-xl rounded-2xl p-6 bg-white overflow-y-auto max-h-[90vh]">
                            <DialogHeader className="mb-6 border-b border-slate-100 pb-4">
                                <DialogTitle className="text-2xl font-bold text-slate-900 uppercase tracking-tight">New Case Entry</DialogTitle>
                                <DialogDescription className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-1">
                                    Initialize clinical lifecycle by entering demographic and diagnostic routing parameters.
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handleRegisterSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Full Legal Name</label>
                                        <Input required className="w-full bg-slate-50 border-slate-200 text-sm font-semibold text-slate-900 focus-visible:ring-indigo-500 rounded-xl px-4 py-2 uppercase placeholder:text-slate-400" placeholder="SURNAME GIVEN NAME" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Contact Node</label>
                                        <Input required className="w-full bg-slate-50 border-slate-200 text-sm font-semibold text-slate-900 focus-visible:ring-indigo-500 rounded-xl px-4 py-2" placeholder="0XXXXXXXXX" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Bios Age</label>
                                        <Input type="number" required className="w-full bg-slate-50 border-slate-200 text-sm font-semibold text-slate-900 focus-visible:ring-indigo-500 rounded-xl px-4 py-2" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Biological Gender</label>
                                        <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                                            {['Male', 'Female'].map(g => (
                                                <Button key={g} type="button" variant={formData.gender === g ? "default" : "ghost"} onClick={() => setFormData({ ...formData, gender: g })} className={`flex-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all h-9 ${formData.gender === g ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>{g}</Button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Flow Origin</label>
                                        <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                                            <Button type="button" variant={formData.isWalkIn ? "default" : "ghost"} onClick={() => setFormData({ ...formData, isWalkIn: true })} className={`flex-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all h-9 ${formData.isWalkIn ? 'bg-amber-500 text-white shadow-sm hover:bg-amber-600' : 'text-slate-500 hover:bg-slate-200/50'}`}>Walk-in</Button>
                                            <Button type="button" variant={!formData.isWalkIn ? "default" : "ghost"} onClick={() => setFormData({ ...formData, isWalkIn: false })} className={`flex-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all h-9 ${!formData.isWalkIn ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700' : 'text-slate-500 hover:bg-slate-200/50'}`}>Appointment</Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Clinical Unit Path</label>
                                        <Select value={formData.departmentId} onValueChange={(v) => setFormData({ ...formData, departmentId: v })}>
                                            <SelectTrigger className="w-full bg-slate-50 border-slate-200 font-semibold text-slate-900 rounded-xl focus:ring-indigo-500">
                                                <SelectValue placeholder="Select Department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {departments.map(d => <SelectItem key={d.id} value={d.id.toString()} className="font-semibold text-sm">{d.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Assigned Consultant</label>
                                        <Select value={formData.doctorId} onValueChange={(v) => setFormData({ ...formData, doctorId: v })}>
                                            <SelectTrigger className="w-full bg-slate-50 border-slate-200 font-semibold text-slate-900 rounded-xl focus:ring-indigo-500">
                                                <SelectValue placeholder="System Assign" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {doctors.map(d => <SelectItem key={d.id} value={d.id.toString()} className="font-semibold text-sm">{d.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Service Classification</label>
                                        <Select value={formData.visitType} onValueChange={(v) => setFormData({ ...formData, visitType: v })}>
                                            <SelectTrigger className="w-full bg-slate-50 border-slate-200 font-semibold text-slate-900 rounded-xl focus:ring-indigo-500">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Consultation" className="font-semibold text-sm">Consultation</SelectItem>
                                                <SelectItem value="Follow-up" className="font-semibold text-sm">Follow-up</SelectItem>
                                                <SelectItem value="Procedure" className="font-semibold text-sm">Procedure</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Triage Priority</label>
                                        <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                                            <SelectTrigger className={`w-full bg-slate-50 border-slate-200 font-semibold text-slate-900 rounded-xl focus:ring-indigo-500 ${formData.priority === 'Urgent' ? 'text-red-600 border-red-200 bg-red-50' : ''}`}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Normal" className="font-semibold text-sm">Normal</SelectItem>
                                                <SelectItem value="Urgent" className="font-semibold text-sm text-red-600">Urgent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <DialogFooter className="pt-6 border-t border-slate-100">
                                    <Button type="button" variant="outline" onClick={() => setShowRegisterModal(false)} className="rounded-xl font-bold uppercase tracking-wider text-xs">Cancel</Button>
                                    <Button type="submit" className="rounded-xl font-bold uppercase tracking-wider text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-8">
                                        Commit Record & Push
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {[
                    { label: 'Pending Wait', value: appointments.filter(a => ['Registered', 'Waiting'].includes(a.status)).length, color: 'text-indigo-600', icon: <Clock /> },
                    { label: 'Active Session', value: appointments.filter(a => a.status === 'With Doctor').length, color: 'text-emerald-600', icon: <UserCheck /> },
                    { label: 'Operational Unit', value: appointments.filter(a => a.status === 'Procedure').length, color: 'text-purple-600', icon: <MapPin /> },
                    { label: 'Revenue/Billing', value: appointments.filter(a => a.status === 'Billing').length, color: 'text-amber-600', icon: <Activity /> },
                    { label: 'Closed Ledger', value: appointments.filter(a => a.status === 'Closed').length, color: 'text-slate-400', icon: <Calendar /> },
                ].map((stat, i) => (
                    <Card key={i} className="rounded-xl border border-slate-50 shadow-sm relative overflow-hidden group transition-all duration-300 hover:shadow-md">
                        <CardContent className="p-8">
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                                <div className={`${stat.color} opacity-20 group-hover:opacity-100 transition-opacity`}>{stat.icon}</div>
                            </div>
                            <p className={`text-4xl font-bold tracking-tight ${stat.color}`}>{stat.value}</p>
                            <div className="absolute -right-6 -bottom-6 w-20 h-20 opacity-[0.03] group-hover:scale-125 transition-transform duration-700">
                                <Activity size={80} className={stat.color} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Content Table */}
            <Card className="rounded-xl border border-slate-200 shadow-sm overflow-hidden bg-white">
                <CardHeader className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-white">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <Input
                            placeholder="Search by name, ID or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-slate-200 rounded-lg text-sm focus-visible:ring-1 focus-visible:ring-indigo-600 transition shadow-sm placeholder:text-slate-400"
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50 border-b border-slate-200">
                                    <TableHead className="px-6 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider w-24">Token</TableHead>
                                    <TableHead className="px-6 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">Patient Details</TableHead>
                                    <TableHead className="px-6 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">Department</TableHead>
                                    <TableHead className="px-6 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                                    <TableHead className="px-6 py-3 text-right text-slate-500 text-xs font-semibold uppercase tracking-wider">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading && Array(5).fill(0).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={5} className="px-6 py-4"><Skeleton className="h-12 w-full rounded-lg" /></TableCell>
                                    </TableRow>
                                ))}
                                {!loading && filteredAppointments.map((appt) => (
                                    <TableRow key={appt.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <TableCell className="px-6 py-4">
                                            <div className="relative">
                                                <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-lg shadow-sm border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                    #{appt.token}
                                                </div>
                                                {appt.priority === 'Urgent' && (
                                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold text-slate-900">{appt.patient?.name || appt.name}</p>
                                                    {appt.priority === 'Urgent' && (
                                                        <Badge variant="destructive" className="px-1.5 py-0 text-[10px] uppercase rounded-sm">Urgent</Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center space-x-3 mt-1 text-sm text-slate-500">
                                                    <span className="flex items-center">
                                                        <Phone size={12} className="mr-1" />
                                                        {appt.patient?.phone || appt.phone}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{appt.patient?.age || appt.age} yrs, {appt.gender}</span>
                                                </div>
                                                <div className="mt-1.5 flex gap-2">
                                                    <Badge variant="outline" className="text-[10px] px-2 py-0 bg-slate-50 border-slate-200 text-slate-600">
                                                        {appt.visitType}
                                                    </Badge>
                                                    {appt.isWalkIn && (
                                                        <Badge variant="secondary" className="text-[10px] px-2 py-0 bg-amber-50 text-amber-700">Walk-in</Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-slate-900 flex items-center">
                                                    <Building2 size={14} className="mr-2 text-slate-400" />
                                                    {departments.find(d => d.id === appt.departmentId)?.name || 'General OPD'}
                                                </p>
                                                <Badge variant="secondary" className="bg-slate-100 text-slate-500 text-xs px-2 py-0 rounded">
                                                    {getAssignedRoom(appt.departmentId)}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <Badge variant={getStatusVariant(appt.status)} className="px-2.5 py-1 rounded-md text-xs font-medium shadow-sm">
                                                {appt.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Select value={appt.status} onValueChange={(v) => updateStatus(appt.id, v)}>
                                                    <SelectTrigger className="w-32 bg-white border-slate-200 rounded-lg text-xs font-medium px-3 h-9">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-lg">
                                                        {['Registered', 'Waiting', 'Calling', 'With Doctor', 'Procedure', 'Completed', 'Billing', 'Closed'].map(s => (
                                                            <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {!loading && filteredAppointments.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                                                    <Search size={24} className="text-slate-300" />
                                                </div>
                                                <h3 className="text-sm font-semibold text-slate-600">No appointments found</h3>
                                                <p className="text-sm text-slate-400 mt-1">Try adjusting your search criteria</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ReceptionistAppointments;
