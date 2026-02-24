import { useState, useEffect } from 'react';
import { Search, Calendar, Stethoscope, ChevronRight, Plus, FlaskConical, Clock } from 'lucide-react';

const AdminDental = () => {
    const [activeTab, setActiveTab] = useState<'cases' | 'lab-orders'>('cases');
    const [cases, setCases] = useState<any[]>([]);
    const [labOrders, setLabOrders] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (activeTab === 'cases') fetchCases();
        else fetchLabOrders();
    }, [activeTab]);

    const fetchCases = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/cases/dental');
            const data = await response.json();
            setCases(data);
        } catch (error) {
            console.error('Error fetching dental cases:', error);
        }
    };

    const fetchLabOrders = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/cases/lab-orders');
            const data = await response.json();
            setLabOrders(data);
        } catch (error) {
            console.error('Error fetching lab orders:', error);
        }
    };

    const updateLabStatus = async (id: number, status: string) => {
        try {
            await fetch(`http://localhost:8080/api/cases/lab-orders/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status,
                    actualReturn: status === 'Ready for Fit' ? new Date().toISOString() : undefined
                })
            });
            fetchLabOrders();
        } catch (error) {
            console.error('Error updating lab status:', error);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Impression Taken': return 'bg-slate-100 text-slate-700';
            case 'Sent to Lab': return 'bg-blue-100 text-blue-700';
            case 'In Fabrication': return 'bg-yellow-100 text-yellow-700';
            case 'Ready for Fit': return 'bg-green-100 text-green-700';
            case 'Fitting Scheduled': return 'bg-purple-100 text-purple-700';
            case 'Completed': return 'bg-emerald-100 text-emerald-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="space-y-6 pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dental Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Track clinical treatments and external lab orders.</p>
                </div>
                {activeTab === 'lab-orders' && (
                    <button className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-indigo-700 transition">
                        <Plus size={16} />
                        <span>Create Lab Order</span>
                    </button>
                )}
            </div>

            <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit shadow-sm border border-slate-200">
                <button
                    onClick={() => setActiveTab('cases')}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'cases' ? 'bg-white text-slate-900 shadow-sm border-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                >
                    Clinical Cases
                </button>
                <button
                    onClick={() => setActiveTab('lab-orders')}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'lab-orders' ? 'bg-white text-slate-900 shadow-sm border-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                >
                    Lab Orders Tracking
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab === 'cases' ? 'cases' : 'orders'}...`}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition placeholder:text-slate-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="divide-y divide-slate-100">
                    {activeTab === 'cases' ? (
                        cases.map((c) => (
                            <div key={c.id} className="p-6 hover:bg-slate-50 transition cursor-pointer group">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            <Stethoscope size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900">{c.patientName}</h4>
                                            <div className="flex items-center space-x-3 text-sm text-slate-500 mt-1">
                                                <span className="flex items-center font-medium">
                                                    <Calendar size={14} className="mr-1.5 text-slate-400" />
                                                    {new Date(c.date).toLocaleDateString()}
                                                </span>
                                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                <span className="font-medium text-indigo-600">{c.type}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
                                            {c.status}
                                        </span>
                                        <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-600 transition" />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        labOrders.map((order) => (
                            <div key={order.id} className="p-6 hover:bg-slate-50 transition group">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                                            <FlaskConical size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900">{order.patientName}</h4>
                                            <p className="text-sm text-slate-500 font-medium">{order.treatmentType}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 items-center">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-500 font-medium">Expected Return</span>
                                            <span className="text-sm font-semibold text-slate-900 flex items-center mt-0.5">
                                                <Clock size={14} className="mr-1.5 text-slate-400" />
                                                {order.expectedReturn ? new Date(order.expectedReturn).toLocaleDateString() : 'TBD'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-500 font-medium">Status</span>
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium mt-1 ${getStatusStyle(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <select
                                            className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white font-medium text-slate-700 transition"
                                            value={order.status}
                                            onChange={(e) => updateLabStatus(order.id, e.target.value)}
                                        >
                                            <option value="Impression Taken">Impression Taken</option>
                                            <option value="Sent to Lab">Sent to Lab</option>
                                            <option value="In Fabrication">In Fabrication</option>
                                            <option value="Ready for Fit">Ready for Fit</option>
                                            <option value="Fitting Scheduled">Fitting Scheduled</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    {((activeTab === 'cases' && cases.length === 0) || (activeTab === 'lab-orders' && labOrders.length === 0)) && (
                        <div className="p-12 text-center">
                            <Stethoscope size={48} className="mx-auto text-slate-200 mb-4" />
                            <p className="text-sm text-slate-500">No {activeTab.replace('-', ' ')} recorded yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDental;
