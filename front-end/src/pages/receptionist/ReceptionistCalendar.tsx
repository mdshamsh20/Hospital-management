import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Zap, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";

const ReceptionistCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        fetchAllEvents();
    }, []);

    const fetchAllEvents = async () => {
        try {
            const [apptData, dentalData]: [any, any] = await Promise.all([
                api.get('/appointments'),
                api.get('/reception/dashboard-stats')
            ]);

            const normalizedAppts = apptData.map((a: any) => ({
                id: a.id,
                date: a.date?.split('T')[0],
                title: a.patient?.name || a.name,
                type: 'Consultation',
                status: a.status
            }));

            const normalizedDental = (dentalData.dentalFollowUps || []).map((d: any) => ({
                id: d.id,
                date: d.expectedReturn?.split('T')[0],
                title: `${d.patientName} (Dental)`,
                type: 'Lab Return',
                status: d.status
            }));

            setEvents([...normalizedAppts, ...normalizedDental]);
            toast.success("Schedule Synchronized", {
                description: "Clinical calendar ledger updated with latest flow data."
            });
        } catch (err) {
            console.error('Failed to fetch events');
            toast.error("Sync Failure", {
                description: "Could not retrieve clinical schedule from central node."
            });
        } finally {
        }
    };

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();


    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const days = daysInMonth(year, month);
        const firstDay = firstDayOfMonth(year, month);
        const calendarDays = [];

        // Padding for previous month days
        for (let i = 0; i < firstDay; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="min-h-[120px] bg-slate-50/50 border-r border-b border-slate-100"></div>);
        }

        for (let day = 1; day <= days; day++) {
            const dateStr = new Date(year, month, day).toISOString().split('T')[0];
            const dayEvents = events.filter(e => e.date === dateStr);
            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            calendarDays.push(
                <div key={day} className={`min-h-[120px] border-r border-b border-slate-100 bg-white p-3 hover:bg-slate-50/50 transition-colors group flex flex-col ${isToday ? 'bg-indigo-50/30' : ''}`}>
                    <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>
                            {day}
                        </span>
                        {dayEvents.length > 0 && (
                            <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                {dayEvents.length}
                            </span>
                        )}
                    </div>
                    <div className="space-y-1 overflow-y-auto pr-1 flex-1">
                        {dayEvents.map((event, i) => (
                            <div key={i} className="flex items-start text-[11px] p-1.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer group/item border border-transparent hover:border-slate-200">
                                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 mr-1.5 flex-shrink-0 ${event.type === 'Lab Return' ? 'bg-amber-500' : 'bg-indigo-500'}`}></div>
                                <div className="truncate">
                                    <span className="font-medium text-slate-700 block truncate">{event.title}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return calendarDays;
    };

    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));

    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Calendar</h1>
                    <div className="flex items-center mt-2">
                        <CalendarIcon className="mr-2 text-indigo-500" size={16} />
                        <p className="text-slate-500 text-sm">Schedule and appointment overview</p>
                    </div>
                </div>

                <div className="flex items-center bg-white shadow-sm rounded-lg p-1 border border-slate-200">
                    <Button variant="ghost" size="icon" onClick={prevMonth} className="h-9 w-9 rounded-md text-slate-500 hover:text-indigo-600">
                        <ChevronLeft size={18} />
                    </Button>
                    <div className="px-6 text-center min-w-[160px]">
                        <h2 className="text-sm font-semibold text-slate-900">
                            {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
                        </h2>
                    </div>
                    <Button variant="ghost" size="icon" onClick={nextMonth} className="h-9 w-9 rounded-md text-slate-500 hover:text-indigo-600">
                        <ChevronRight size={18} />
                    </Button>
                </div>

                <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="bg-white text-slate-700 px-4 py-2 rounded-lg border-slate-200 shadow-sm text-xs font-semibold flex items-center">
                        <Zap className="mr-2 text-indigo-500" size={14} />
                        Synced
                    </Badge>
                </div>
            </div>

            <Card className="rounded-xl border border-slate-200 shadow-sm overflow-hidden bg-white">
                <CardHeader className="p-0 border-none">
                    <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200 py-3">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                {day}
                            </div>
                        ))}
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="grid grid-cols-7 border-l border-t border-slate-100">
                        {renderCalendar()}
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                            <span className="text-xs font-medium text-slate-600">Consultations</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                            <span className="text-xs font-medium text-slate-600">Lab Returns</span>
                        </div>
                        <div className="flex items-center gap-2 border-l border-slate-200 pl-6">
                            <Info size={14} className="text-slate-400" />
                            <span className="text-xs text-slate-500">Click dates for details</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ReceptionistCalendar;
