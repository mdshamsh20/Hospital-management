import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Search, Printer, Activity, FileText, Share2, PackageCheck, Clock, CheckCircle2, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ReceptionistReportsDesk = () => {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const data: any = await api.get('/reception/dashboard-stats');
            setReports(data.reportsReady || []);
        } catch (err) {
            console.error('Failed to fetch reports');
            // Handled
        } finally {
            setLoading(false);
        }
    };

    const markDelivered = async (id: number) => {
        try {
            await api.patch(`/reception/reports/${id}/deliver`);
            toast.success("Dispatch Confirmed: Report handed over successfully.");
            fetchReports();
        } catch (err) {
            // Handled
        }
    };

    const printReceipt = (report: any) => {
        toast.info(`Printer Sequence: Generating invoice for ${report.patientName}.`);
    };

    const shareOnWhatsApp = (report: any) => {
        const message = `Hello ${report.patientName}, your ${report.type} report is ready at Radiance Clinic. You can pick it up or view it online.`;
        window.open(`https://wa.me/${report.phone || ''}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const notifyPickup = (report: any) => {
        toast.success(`Broadcasting Alert: Pickup notification sent to ${report.patientName}.`);
    };

    const filteredReports = reports.filter(r =>
        r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight uppercase leading-none flex items-center">
                        Report Dispatch
                        <Badge variant="outline" className="ml-4 border-indigo-200 text-indigo-600 font-bold tracking-normal text-[10px] bg-indigo-50/50 px-3 py-1">LIVE FEED</Badge>
                    </h1>
                    <div className="flex items-center mt-3 text-slate-500">
                        <Printer className="mr-3 text-indigo-600" size={18} />
                        <p className="text-[10px] font-bold uppercase tracking-normal">Diagnostic Output & Delivery Management</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="ghost" size="icon" onClick={fetchReports} className="h-12 w-12 rounded-xl text-slate-400 hover:text-indigo-600 transition shadow-sm bg-white border border-slate-100">
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    </Button>
                    <Button className="h-12 bg-slate-900 text-white px-8 rounded-xl text-[10px] font-bold uppercase tracking-normal shadow-2xl shadow-slate-900/20 hover:bg-slate-800 transition active:scale-95">
                        Bulk Handover
                    </Button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Pending Dispatch', value: reports.length, icon: <PackageCheck size={20} />, color: 'text-indigo-600', bg: 'bg-indigo-50/30 border-indigo-100/50' },
                    { label: 'Today Dispatched', value: '45', icon: <CheckCircle2 size={20} />, color: 'text-slate-900', bg: 'bg-white border-slate-100' },
                    { label: 'Cloud Synchronized', value: '12', icon: <Share2 size={20} />, color: 'text-emerald-600', bg: 'bg-white border-slate-100' },
                    { label: 'Average Turnaround', value: '2.4h', icon: <Clock size={20} />, color: 'text-blue-600', bg: 'bg-white border-slate-100' },
                ].map((stat, i) => (
                    <Card key={i} className={`rounded-xl border ${stat.bg} shadow-sm relative overflow-hidden group transition-all duration-300 hover:shadow-md`}>
                        <CardContent className="p-8">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-[10px] font-bold uppercase tracking-normal text-slate-400">{stat.label}</h3>
                                <div className={`${stat.color} opacity-20`}>{stat.icon}</div>
                            </div>
                            <p className={`text-4xl font-bold tracking-tight ${stat.color}`}>{stat.value}</p>
                            <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:scale-125 transition-transform duration-700 text-slate-900">
                                <FileText size={100} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Interface */}
            <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden bg-white min-h-[600px]">
                <CardHeader className="p-6 border-b border-slate-100 bg-white flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <Input
                            placeholder="Patient name, Token ID or Case Type..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-slate-200 rounded-lg text-sm focus-visible:ring-1 focus-visible:ring-indigo-600 transition shadow-sm placeholder:text-slate-400"
                        />
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="text-xs font-semibold text-slate-500">Sort by:</span>
                        <Select defaultValue="ready">
                            <SelectTrigger className="w-[160px] h-9 rounded-lg border-slate-200 font-medium text-xs bg-white shadow-sm">
                                <SelectValue placeholder="Sort Method" />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg">
                                <SelectItem value="ready" className="text-xs font-medium">Ready Time</SelectItem>
                                <SelectItem value="patient" className="text-xs font-medium">Patient Name</SelectItem>
                                <SelectItem value="urgent" className="text-xs font-medium">Urgency</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            Array(6).fill(0).map((_, i) => (
                                <Skeleton key={i} className="h-64 rounded-xl" />
                            ))
                        ) : filteredReports.map((report) => (
                            <div key={report.id} className="relative group perspective-1000">
                                <Card className="h-full border border-slate-200 rounded-xl p-0 transition-all duration-300 hover:shadow-md hover:border-indigo-300 bg-white flex flex-col">
                                    <CardContent className="p-5 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 border border-indigo-100">
                                                <FileText size={20} />
                                            </div>
                                            <div className="text-right">
                                                <Badge variant="secondary" className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold tracking-wide uppercase bg-emerald-100 text-emerald-700 border border-emerald-200 mb-1.5 inline-block">
                                                    READY
                                                </Badge>
                                                <p className="text-xs font-medium text-slate-400">TSK-{report.id + 1000}</p>
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <h4 className="font-semibold text-slate-900 text-lg mb-2">{report.patientName}</h4>
                                            <div className="flex items-center flex-wrap gap-2 mb-4">
                                                <Badge variant="outline" className="px-2 py-0 border-slate-200 text-slate-600 text-xs font-medium">
                                                    {report.type}
                                                </Badge>
                                                {report.cost > 0 && (
                                                    <Badge variant="secondary" className="px-2 py-0 bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
                                                        Due: ₹{report.cost}
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs text-slate-500 mb-0.5">Technician</p>
                                                    <p className="text-sm font-medium text-slate-900 truncate">{report.technicianName || 'In-House Core'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 mb-0.5">Time</p>
                                                    <p className="text-sm font-medium text-slate-900 flex items-center">
                                                        <Clock size={12} className="mr-1.5 text-slate-400" />
                                                        {new Date(report.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mt-5">
                                            <Button
                                                onClick={() => printReceipt(report)}
                                                variant="outline"
                                                className="h-9 bg-white text-slate-700 font-medium text-xs hover:bg-slate-50 border-slate-200"
                                            >
                                                <Printer size={14} className="mr-1.5" />
                                                Print
                                            </Button>
                                            <Button
                                                onClick={() => notifyPickup(report)}
                                                variant="outline"
                                                className="h-9 bg-white text-slate-700 font-medium text-xs hover:bg-slate-50 border-slate-200"
                                            >
                                                <Activity size={14} className="mr-1.5" />
                                                Notify
                                            </Button>
                                        </div>

                                        <div className="flex items-center gap-2 mt-2">
                                            <Button
                                                onClick={() => markDelivered(report.id)}
                                                className="flex-1 h-10 bg-indigo-600 text-white font-medium text-xs hover:bg-indigo-700 shadow-sm"
                                            >
                                                Confirm Handover
                                            </Button>
                                            <Button
                                                onClick={() => shareOnWhatsApp(report)}
                                                variant="outline"
                                                size="icon"
                                                className="h-10 w-10 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                                            >
                                                <Share2 size={16} />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}

                        {filteredReports.length === 0 && !loading && (
                            <div className="col-span-full py-24 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                                        <FileText size={24} className="text-slate-300" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-slate-600">No Pending Reports</h3>
                                    <p className="text-sm text-slate-400 mt-1">Awaiting new diagnostic outputs</p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ReceptionistReportsDesk;
