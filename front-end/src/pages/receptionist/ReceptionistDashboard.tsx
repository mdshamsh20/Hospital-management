import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Activity, Calendar,
    UserPlus, Clock, FlaskConical,
    Printer, ArrowRight, UserCheck, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const ReceptionistDashboard = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [callingPatient, setCallingPatient] = useState(false);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000); // 15s refresh for live queue
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/reception/dashboard-stats');
            setData(res.data);
        } catch (err) {
            console.error('Failed to fetch dashboard data');
            toast.error("Connectivity issue: Failed to fetch live operational data.");
        } finally {
            setLoading(false);
        }
    };

    const callNextPatient = async () => {
        setCallingPatient(true);
        try {
            await axios.post('http://localhost:8080/api/reception/call-next');
            await fetchData();
            toast.success("Token Announcement: Next patient summoned to desk.");
        } catch (err) {
            toast.error("Operation Failed: Queue is currently empty.");
        } finally {
            setCallingPatient(false);
        }
    };

    const updateDocAvailability = async (id: number, availability: string) => {
        try {
            await axios.patch(`http://localhost:8080/api/reception/doctors/${id}/availability`, { availability });
            await fetchData();
            toast.success(`Physician Status: Updated to ${availability}`);
        } catch (err) {
            toast.error("System Error: Failed to update availability.");
        }
    };

    if (loading) return (
        <div className="space-y-8 p-6">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-14 w-80 rounded-xl" />
            </div>
            <div className="grid grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 rounded-xl" />)}
            </div>
            <div className="grid grid-cols-3 gap-8">
                <Skeleton className="col-span-2 h-[500px] rounded-xl" />
                <Skeleton className="h-[500px] rounded-xl" />
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in-up pb-10">
            {/* Top Bar - Enhanced with Token Display */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Reception Desk</h1>
                    <div className="flex items-center mt-1">
                        <span className="relative flex h-2.5 w-2.5 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <p className="text-slate-500 text-sm font-medium">
                            Live Operational Layer • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center bg-white border border-slate-200 p-2 rounded-xl shadow-sm">
                    <div className="px-6 py-2 bg-slate-50 rounded-lg mr-3 border border-slate-100 flex flex-col items-center">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Live Desk Token</p>
                        <p className="text-xl font-bold text-slate-900 leading-none">#{data.waitingQueue?.[0]?.token || '--'}</p>
                    </div>
                    <Button
                        onClick={callNextPatient}
                        disabled={callingPatient}
                        className="h-11 bg-indigo-600 text-white px-6 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        {callingPatient ? (
                            <div className="flex items-center gap-2">
                                <RefreshCw className="animate-spin" size={16} />
                                <span>Calling...</span>
                            </div>
                        ) : 'Call Next Patient'}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/receptionist/appointments')}
                        className="ml-2 h-11 w-11 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                        <UserPlus size={20} />
                    </Button>
                </div>
            </div>

            {/* Delay Alert System */}
            {data.delayedCount > 0 && (
                <div className="bg-rose-50 border border-rose-100 p-5 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center text-center md:text-left">
                        <div className="w-12 h-12 bg-white rounded-lg border border-rose-100 flex items-center justify-center text-rose-600 mr-4 shadow-sm">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-rose-900">Queue Saturation Alert</p>
                            <p className="text-xs font-medium text-rose-700 mt-0.5">
                                <span className="font-bold">{data.delayedCount} Patients</span> waiting beyond operational threshold (&gt;20m).
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => navigate('/receptionist/appointments')}
                        variant="destructive"
                        className="rounded-lg px-6 text-sm font-semibold shadow-sm"
                    >
                        Optimize Queue
                    </Button>
                </div>
            )}

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Waiting List', value: data.waitingQueue.length, icon: <Clock size={20} />, variant: 'primary', path: '/receptionist/appointments' },
                    { label: 'Daily Visits', value: data.appointmentsToday.length, icon: <Calendar size={20} />, variant: 'white', path: '/receptionist/appointments' },
                    { label: 'Reports Ready', value: data.reportsReady.length, icon: <Printer size={20} />, variant: 'white', path: '/receptionist/reports-desk' },
                    { label: 'Pending Labor', value: data.dentalFollowUps.length, icon: <FlaskConical size={20} />, variant: 'white', path: '/receptionist/dental-followups' },
                ].map((stat, i) => (
                    <Card
                        key={i}
                        onClick={() => navigate(stat.path)}
                        className={`rounded-xl p-1 cursor-pointer transition-all hover:shadow-md border-slate-200 shadow-sm ${stat.variant === 'primary' ? 'bg-indigo-600 border-indigo-700 text-white' : 'bg-white text-slate-900 border border-slate-200'
                            }`}
                    >
                        <CardContent className="p-5 flex flex-col justify-between h-40">
                            <div className="flex items-center justify-between">
                                <div className={`p-2.5 rounded-lg border ${stat.variant === 'primary' ? 'bg-indigo-500/50 border-indigo-400 text-white' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                                    {stat.icon}
                                </div>
                                <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${stat.variant === 'primary' ? 'text-indigo-200' : 'text-slate-400'}`} />
                            </div>
                            <div>
                                <h3 className="text-4xl font-bold tracking-tight">{stat.value}</h3>
                                <p className={`text-sm font-medium mt-1 ${stat.variant === 'primary' ? 'text-indigo-100' : 'text-slate-500'}`}>{stat.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Queue View */}
                <Card className="lg:col-span-2 rounded-xl border-slate-200 shadow-sm overflow-hidden bg-white">
                    <CardHeader className="p-6 border-b border-slate-100 bg-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold text-slate-900 tracking-tight flex items-center">
                                    <Activity className="mr-2 text-indigo-600" size={20} />
                                    Live Performance Queue
                                </CardTitle>
                                <p className="text-slate-500 text-xs font-medium mt-1 flex items-center">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                                    Real-time Operational Stream
                                </p>
                            </div>
                            <Button variant="outline" size="sm" onClick={fetchData} className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition h-9">
                                Refresh Feed
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-3">
                            {data.waitingQueue.slice(0, 4).length === 0 ? (
                                <div className="text-center py-16 border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                                        <Clock className="text-slate-300" size={24} />
                                    </div>
                                    <p className="text-sm font-semibold text-slate-500">Queue Neutralized • No Waiting Patients</p>
                                </div>
                            ) : (
                                data.waitingQueue.slice(0, 4).map((appt: any) => (
                                    <div key={appt.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100/50 border border-slate-100 transition-colors shadow-sm animate-in slide-in-from-bottom-2">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                                                {appt.token}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900 leading-tight">{appt.patient?.name || appt.name}</p>
                                                <div className="flex items-center flex-wrap gap-2 mt-1">
                                                    <Badge variant={appt.isWalkIn ? "warning" : "secondary"} className="text-[10px] font-semibold px-2 py-0 border-none bg-amber-100/50 text-amber-700">
                                                        {appt.isWalkIn ? 'Walk-in' : 'Appointment'}
                                                    </Badge>
                                                    <Badge variant="outline" className="text-[10px] font-semibold px-2 py-0 border-indigo-200 text-indigo-700 bg-indigo-50">
                                                        {appt.visitType}
                                                    </Badge>
                                                    <span className="text-xs font-medium text-slate-500 flex items-center">
                                                        <Clock size={12} className="mr-1 opacity-70" />
                                                        {new Date(appt.arrivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge
                                                variant={appt.status === 'Calling' ? "default" : "secondary"}
                                                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${appt.status === 'Calling' ? 'bg-indigo-600 hover:bg-indigo-700 text-white animate-pulse' : 'bg-white border-slate-200 text-slate-600'
                                                    }`}
                                            >
                                                {appt.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Staff Control */}
                <div className="space-y-6">
                    <Card className="bg-slate-900 rounded-xl border border-slate-800 shadow-md relative overflow-hidden text-white">
                        <CardContent className="p-6 relative z-10">
                            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                                <h2 className="text-lg font-bold tracking-tight flex items-center">
                                    <UserCheck size={18} className="mr-2 text-indigo-400" />
                                    Personnel
                                </h2>
                                <Badge variant="outline" className="border-white/20 text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded-md">Active</Badge>
                            </div>

                            <div className="space-y-5">
                                {data.doctors.map((doc: any, i: number) => (
                                    <div key={doc.id} className="animate-in slide-in-from-right-4" style={{ animationDelay: `${i * 100}ms` }}>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-indigo-300 font-bold text-sm">
                                                    {doc.name[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold leading-tight text-white mb-0.5">{doc.name}</p>
                                                    <p className="text-xs text-slate-400 font-medium">{doc.specialization}</p>
                                                </div>
                                            </div>
                                            <div className="relative flex h-2.5 w-2.5">
                                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-40 ${doc.availability === 'Available' ? 'bg-emerald-400' :
                                                    doc.availability === 'Busy' ? 'bg-amber-400' : 'bg-red-400'
                                                    }`}></span>
                                                <div className={`relative inline-flex rounded-full h-2.5 w-2.5 ${doc.availability === 'Available' ? 'bg-emerald-500' :
                                                    doc.availability === 'Busy' ? 'bg-amber-500' : 'bg-red-500'
                                                    }`}></div>
                                            </div>
                                        </div>

                                        <div className="flex bg-white/5 p-1 rounded-lg border border-white/5 backdrop-blur-sm">
                                            {['Available', 'Busy', 'On Break'].map(status => (
                                                <button
                                                    key={status}
                                                    onClick={() => updateDocAvailability(doc.id, status)}
                                                    className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-colors ${doc.availability === status
                                                        ? 'bg-white text-slate-900 shadow-sm'
                                                        : 'text-slate-400 hover:text-white hover:bg-white/10'
                                                        }`}
                                                >
                                                    {status === 'On Break' ? 'Break' : status}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Operations */}
                    <Card className="rounded-xl border border-slate-200 shadow-sm bg-white">
                        <CardContent className="p-5">
                            <h3 className="text-xs font-semibold text-slate-500 tracking-wider mb-4 border-b border-slate-100 pb-2">Operational Hub</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    onClick={() => navigate('/receptionist/reports-desk')}
                                    variant="outline"
                                    className="h-auto flex flex-col items-start p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-100 hover:text-indigo-700 transition-colors shadow-sm"
                                >
                                    <Printer size={20} className="mb-2 text-slate-500" />
                                    <span className="text-xs font-bold w-full text-left">Reports Desk</span>
                                    <span className="text-[10px] text-slate-500 font-medium mt-0.5">Deliver Units</span>
                                </Button>
                                <Button
                                    onClick={() => navigate('/receptionist/dental-followups')}
                                    variant="outline"
                                    className="h-auto flex flex-col items-start p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-100 hover:text-emerald-700 transition-colors shadow-sm"
                                >
                                    <FlaskConical size={20} className="mb-2 text-slate-500" />
                                    <span className="text-xs font-bold w-full text-left">Dental Lab</span>
                                    <span className="text-[10px] text-slate-500 font-medium mt-0.5">Logistics</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ReceptionistDashboard;
