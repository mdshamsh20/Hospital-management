import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Phone, Calendar, Clock, CheckCircle2, FlaskConical, Filter, RefreshCw, Building2, UserCheck, Zap, ArrowRight, PackageOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

const ReceptionistDentalFollowUps = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchFollowUps();
    }, []);

    const fetchFollowUps = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:8080/api/reception/dashboard-stats');
            setOrders(res.data.dentalFollowUps || []);
        } catch (err) {
            console.error('Failed to fetch follow-ups');
            toast.error("Telemetry Error", {
                description: "Failed to sync with Laboratory Logistics Node."
            });
        } finally {
            setLoading(false);
        }
    };

    const updateAction = async (id: number, action: string) => {
        const promise = axios.patch(`http://localhost:8080/api/reception/dental-orders/${id}/action`, { action });

        toast.promise(promise, {
            loading: `Marking as ${action}...`,
            success: () => {
                fetchFollowUps();
                return `Order status updated to ${action}.`;
            },
            error: "Update rejected by clinical server."
        });
    };

    const getLifecycleStep = (status: string) => {
        const steps = [
            'Impression Taken',
            'Sent to Lab',
            'In Fabrication',
            'Ready for Fit',
            'Fitting Scheduled',
            'Completed'
        ];
        return steps.indexOf(status) + 1;
    };

    const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" => {
        if (status.includes('Ready')) return "success";
        if (status.includes('Lab') || status.includes('Fabrication')) return "default";
        if (status.includes('Impression')) return "warning";
        return "secondary";
    };

    const filteredOrders = orders.filter(o =>
        o.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.labName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.caseType?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dental Lab Hub</h1>
                    <div className="flex items-center mt-2">
                        <FlaskConical className="mr-2 text-indigo-500" size={16} />
                        <p className="text-slate-500 text-sm">Track prosthetic lifecycles and lab coordination</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="bg-white text-slate-700 px-4 py-2 rounded-lg border-slate-200 shadow-sm text-xs font-semibold flex items-center">
                        <Zap className="mr-2 text-indigo-500" size={14} />
                        Lab Output Ready: 98%
                    </Badge>
                </div>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Active Orders', value: orders.length, color: 'text-slate-900', icon: FlaskConical, bg: 'bg-white border-slate-200' },
                    { label: 'Delayed', value: orders.filter(o => o.isDelayed).length, color: 'text-rose-600', icon: PackageOpen, bg: 'bg-white border-rose-100' },
                    { label: 'Ready for Fit', value: orders.filter(o => o.status === 'Ready for Fit').length, color: 'text-emerald-600', icon: CheckCircle2, bg: 'bg-white border-emerald-100' },
                    { label: 'Avg Cycles', value: (orders.reduce((acc, current) => acc + (current.trialCount || 0), 0) / (orders.length || 1)).toFixed(1), color: 'text-indigo-600', icon: ArrowRight, bg: 'bg-white border-slate-200' },
                ].map((stat, i) => (
                    <Card key={i} className={`rounded-xl border shadow-sm relative overflow-hidden group transition-all hover:shadow-md ${stat.bg}`}>
                        <CardContent className="p-6">
                            <div className="relative z-10">
                                <p className="text-xs font-semibold text-slate-500 mb-2">{stat.label}</p>
                                <p className={`text-3xl font-bold tracking-tight ${stat.color}`}>{stat.value}</p>
                            </div>
                            <stat.icon className={`absolute -right-4 -bottom-4 w-16 h-16 opacity-10 group-hover:scale-110 transition-transform ${stat.color}`} />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Lifecycle Queue */}
            <Card className="rounded-xl border border-slate-200 shadow-sm overflow-hidden bg-white">
                <CardContent className="p-0">
                    <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <Input
                                placeholder="Search Patient, Lab, or CaseType..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-slate-200 rounded-lg text-sm focus-visible:ring-1 focus-visible:ring-indigo-600 transition shadow-sm placeholder:text-slate-400"
                            />
                        </div>
                        <div className="flex space-x-2">
                            <Button variant="outline" className="h-9 bg-white border-slate-200 text-slate-600 text-sm font-medium">
                                <Filter size={14} className="mr-2" />
                                Filter
                            </Button>
                            <Button variant="outline" size="icon" onClick={fetchFollowUps} className="h-9 w-9 bg-white border-slate-200 text-slate-500 hover:text-indigo-600">
                                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50 border-b border-slate-200">
                                <TableRow>
                                    <TableHead className="px-6 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">Patient Details</TableHead>
                                    <TableHead className="px-6 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">Laboratory</TableHead>
                                    <TableHead className="px-6 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">Timeline</TableHead>
                                    <TableHead className="px-6 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">Progress</TableHead>
                                    <TableHead className="px-6 py-3 text-right text-slate-500 text-xs font-semibold uppercase tracking-wider">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.map((order) => (
                                    <TableRow key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                    {order.patientName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">{order.patientName}</p>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <Badge variant="outline" className="text-[10px] px-2 py-0 border-slate-200 text-slate-600">
                                                            {order.caseType || 'Generic'}
                                                        </Badge>
                                                        <span className="text-[10px] font-medium text-slate-400">Trial {order.trialCount || 1}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center text-sm font-medium text-slate-900">
                                                    <Building2 size={14} className="mr-2 text-slate-400" />
                                                    {order.labName || 'Internal Lab'}
                                                </div>
                                                <div className="flex items-center text-xs text-slate-500">
                                                    <Calendar size={12} className="mr-1.5" />
                                                    Started: {new Date(order.impressionDate).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className={`flex items-center text-sm font-medium ${order.isDelayed ? 'text-rose-600' : 'text-slate-900'}`}>
                                                    <Clock size={14} className="mr-2" />
                                                    Due: {new Date(order.expectedReturn).toLocaleDateString([], { day: '2-digit', month: 'short' })}
                                                </div>
                                                {order.isDelayed && (
                                                    <div className="flex items-center space-x-1.5">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                                                        <span className="text-xs font-medium text-rose-500">Delayed</span>
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="space-y-2 w-48">
                                                <div className="flex items-center justify-between">
                                                    <Badge variant={getStatusVariant(order.status)} className="text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-sm">
                                                        {order.status}
                                                    </Badge>
                                                    <span className="text-xs font-medium text-slate-500">{Math.round((getLifecycleStep(order.status) / 6) * 100)}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex space-x-0.5">
                                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                                        <div
                                                            key={i}
                                                            className={`h-full flex-1 transition-all ${i <= getLifecycleStep(order.status) ? (order.isDelayed ? 'bg-rose-500' : 'bg-indigo-600') : 'bg-slate-200'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant={order.receptionAction === 'Called' ? 'default' : 'outline'}
                                                                size="icon"
                                                                onClick={() => updateAction(order.id, 'Called')}
                                                                className={`h-9 w-9 rounded-lg ${order.receptionAction === 'Called' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-slate-50'}`}
                                                            >
                                                                <Phone size={14} />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="bg-slate-900 border-none rounded-lg text-xs">
                                                            <p>Mark as Called</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant={order.receptionAction === 'Confirmed' ? 'default' : 'outline'}
                                                                size="icon"
                                                                onClick={() => updateAction(order.id, 'Confirmed')}
                                                                className={`h-9 w-9 rounded-lg ${order.receptionAction === 'Confirmed' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-emerald-600 hover:bg-slate-50'}`}
                                                            >
                                                                <UserCheck size={16} />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="bg-slate-900 border-none rounded-lg text-xs">
                                                            <p>Confirm Appointment</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredOrders.length === 0 && !loading && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                                                    <FlaskConical size={24} className="text-slate-300" />
                                                </div>
                                                <h3 className="text-sm font-semibold text-slate-600">No active cases found</h3>
                                                <Button variant="link" className="text-indigo-600 font-medium text-sm mt-1" onClick={() => setSearchTerm('')}>Clear Search</Button>
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

export default ReceptionistDentalFollowUps;
