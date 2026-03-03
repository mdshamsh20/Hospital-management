import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Search, RefreshCw, User, ShieldCheck } from 'lucide-react';
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

const ReceptionistDoctors = () => {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const data: any = await api.get('/doctors');
            setDoctors(data);
        } catch (err: any) {
            setDoctors([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const filteredDoctors = doctors.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="animate-fade-in-up space-y-8 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Medical Directory</h1>
                    <div className="flex items-center mt-2">
                        <ShieldCheck className="mr-2 text-indigo-500" size={16} />
                        <p className="text-slate-500 text-sm">Physician Registry & Availability</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <Button
                        variant="outline"
                        onClick={fetchDoctors}
                        className="h-10 border-slate-200 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-50 text-sm font-medium shadow-sm"
                    >
                        <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Sync Directory
                    </Button>
                </div>
            </div>

            <Card className="rounded-xl border border-slate-200 shadow-sm overflow-hidden bg-white">
                <CardHeader className="p-6 border-b border-slate-100 bg-white">
                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <Input
                            placeholder="Search physician name or specialty..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-slate-200 rounded-lg text-sm focus-visible:ring-1 focus-visible:ring-indigo-600 transition shadow-sm placeholder:text-slate-400"
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50 border-b border-slate-200">
                                <TableRow>
                                    <TableHead className="px-6 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider w-24">ID</TableHead>
                                    <TableHead className="px-6 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">Physician Name</TableHead>
                                    <TableHead className="px-6 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">Specialty</TableHead>
                                    <TableHead className="px-6 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">Department</TableHead>
                                    <TableHead className="px-6 py-3 text-right text-slate-500 text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell colSpan={5} className="px-6 py-4"><Skeleton className="h-12 w-full rounded-lg" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredDoctors.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                                                    <User className="text-slate-300" size={24} />
                                                </div>
                                                <p className="text-sm font-semibold text-slate-600">No physicians found.</p>
                                                <p className="text-sm text-slate-400 mt-1">Try adjusting your search criteria.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredDoctors.map((doc) => (
                                        <TableRow key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <TableCell className="px-6 py-4">
                                                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">DOC-{doc.id}</span>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                        {doc.name[0]}
                                                    </div>
                                                    <p className="font-semibold text-slate-900">{doc.name}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <Badge variant="outline" className="px-2 py-0 border-slate-200 text-slate-600 text-xs font-medium">
                                                    {doc.specialization || 'General Practice'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <p className="font-medium text-slate-700 text-sm">{doc.department?.name || 'Central OPD'}</p>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-right">
                                                <Badge variant={doc.onDuty ? "default" : "secondary"} className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${doc.onDuty ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border-none'}`}>
                                                    {doc.onDuty ? 'ON DUTY' : 'OFF DUTY'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ReceptionistDoctors;
