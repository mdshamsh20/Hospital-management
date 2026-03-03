import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Search, Filter, RefreshCw, MailOpen, Mail, Send, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const ReceptionistInquiries = () => {
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchInquiries = async () => {
        setLoading(true);
        try {
            const data: any = await api.get('/inquiries');
            setInquiries(data);
        } catch (err: any) {
            console.error(err);
            toast.error("Inbox Sync Failed: Could not retrieve inquiries.");
            setInquiries([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const filteredInquiries = inquiries.filter(inq =>
        inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="animate-fade-in-up space-y-8 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight uppercase leading-none">Inquiry Inbox</h1>
                    <div className="flex items-center mt-2">
                        <span className="w-2.5 h-2.5 bg-sky-500 rounded-full mr-2 shadow-[0_0_8px_rgba(14,165,233,0.4)]"></span>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Live Patient Communication Stream</p>
                    </div>
                </div>
                <Button
                    onClick={fetchInquiries}
                    variant="outline"
                    className="h-12 border-slate-200 rounded-xl text-slate-500 hover:text-indigo-600 transition font-bold text-[10px] uppercase tracking-wider px-6"
                >
                    <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh Feed
                </Button>
            </div>

            <Card className="rounded-xl shadow-sm border-slate-200 overflow-hidden bg-white">
                <CardHeader className="p-6 border-b border-slate-100 bg-white flex flex-col sm:flex-row justify-between gap-4 items-center">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <Input
                            placeholder="Search correspondence..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-slate-200 rounded-lg text-sm focus-visible:ring-1 focus-visible:ring-indigo-600 transition shadow-sm placeholder:text-slate-400"
                        />
                    </div>
                    <Button variant="outline" className="rounded-lg h-9 px-4 text-sm font-medium text-slate-600">
                        <Filter className="mr-2" size={16} />
                        Filter Status
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50 border-b border-slate-200">
                                <TableHead className="px-6 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider w-16">Entry</TableHead>
                                <TableHead className="px-6 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">Contact</TableHead>
                                <TableHead className="px-6 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">Subject & Message</TableHead>
                                <TableHead className="px-6 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                                <TableHead className="px-6 py-3 text-right text-slate-500 text-xs font-semibold uppercase tracking-wider">Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={5} className="px-6 py-4"><Skeleton className="h-12 w-full rounded-lg" /></TableCell>
                                    </TableRow>
                                ))
                            ) : filteredInquiries.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 shadow-sm">
                                                <Mail className="text-slate-300" size={24} />
                                            </div>
                                            <p className="text-sm font-semibold text-slate-600">Your communication archive is empty.</p>
                                            <p className="text-sm text-slate-400 mt-1">No active inquiries detected.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredInquiries.map((inq) => (
                                    <TableRow key={inq.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                                        <TableCell className="px-6 py-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${inq.status === 'UNREAD' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                                                {inq.status === 'UNREAD' ? <Mail size={18} /> : <MailOpen size={18} />}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <p className={`font-semibold text-sm ${inq.status === 'UNREAD' ? 'text-slate-900' : 'text-slate-600'}`}>{inq.name}</p>
                                            <p className="text-xs text-slate-500 mt-1 flex items-center">
                                                <Send size={12} className="mr-1" />
                                                {inq.email}
                                            </p>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <p className={`font-semibold text-sm mb-1 ${inq.status === 'UNREAD' ? 'text-slate-900' : 'text-slate-700'}`}>{inq.subject}</p>
                                            <p className="text-sm text-slate-500 truncate max-w-sm">"{inq.message}"</p>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <Badge variant={inq.status === 'UNREAD' ? "default" : "secondary"} className="px-2.5 py-0.5 rounded-md text-xs font-medium">
                                                {inq.status || 'UNREAD'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-right">
                                            <p className="text-sm text-slate-600 flex items-center justify-end">
                                                <Calendar size={14} className="mr-2 text-slate-400" />
                                                {new Date(inq.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default ReceptionistInquiries;
