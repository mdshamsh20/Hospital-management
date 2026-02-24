import { useState, useEffect } from 'react';
import { Search, Clock, CheckCircle2, FileText } from 'lucide-react';

const AdminRadiology = () => {
    const [cases, setCases] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchCases();
    }, []);

    const fetchCases = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/cases/radiology');
            const data = await response.json();
            setCases(data);
        } catch (error) {
            console.error('Error fetching radiology cases:', error);
        }
    };

    const updateStatus = async (id: number, status: string) => {
        try {
            await fetch(`http://localhost:8080/api/cases/radiology/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            fetchCases();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Draft': return 'bg-slate-100 text-slate-700';
            case 'Typing': return 'bg-blue-50 text-blue-600';
            case 'Completed': return 'bg-green-50 text-green-700';
            case 'Delivered': return 'bg-indigo-50 text-indigo-600';
            default: return 'bg-slate-50 text-slate-500';
        }
    };

    return (
        <div className="space-y-6 pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Radiology Reporting Control</h1>
                    <p className="text-slate-500 text-sm mt-1">Monitor X-Ray/Ultrasound status from typing to delivery.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search reports..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition placeholder:text-slate-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="divide-y divide-slate-100">
                    {cases.filter(c => c.patientName.toLowerCase().includes(searchQuery.toLowerCase())).map((c) => (
                        <div key={c.id} className="p-6 hover:bg-slate-50 transition-colors group">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900">{c.patientName}</h4>
                                        <div className="flex items-center space-x-3 text-sm text-slate-500 mt-1">
                                            <span className="font-medium text-indigo-600">{c.type}</span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            <span className="flex items-center font-medium">
                                                <Clock size={14} className="mr-1.5 text-slate-400" />
                                                {new Date(c.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex flex-col items-end">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(c.status)}`}>
                                            {c.status}
                                        </span>
                                        <select
                                            className="text-xs text-slate-500 bg-transparent mt-1.5 focus:outline-none focus:text-indigo-600 font-medium cursor-pointer"
                                            value={c.status}
                                            onChange={(e) => updateStatus(c.id, e.target.value)}
                                        >
                                            <option value="Draft">Set Draft</option>
                                            <option value="Typing">Set Typing</option>
                                            <option value="Completed">Set Completed</option>
                                            <option value="Delivered">Set Delivered</option>
                                        </select>
                                    </div>
                                    {(c.status === 'Completed' || c.status === 'Delivered') && (
                                        <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Print/Download">
                                            <CheckCircle2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {cases.length === 0 && (
                        <div className="p-12 text-center">
                            <FileText size={48} className="mx-auto text-slate-200 mb-4" />
                            <p className="text-sm text-slate-500">No radiology cases recorded yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminRadiology;
