import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, AlertCircle, RefreshCw, MailOpen, Mail } from 'lucide-react';

const AdminInquiries = () => {
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchInquiries = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get('http://localhost:8080/api/inquiries');
            setInquiries(res.data);
        } catch (err: any) {
            console.error(err);
            setError('Failed to fetch from API. Showing empty list.');
            setInquiries([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    return (
        <div className="animate-fade-in-up space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Patient Inquiries</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage contact form submissions and general inquiries.</p>
                </div>
                <button
                    onClick={fetchInquiries}
                    className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition font-medium text-sm"
                >
                    <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="bg-orange-50 text-orange-700 p-4 rounded-xl text-sm border border-orange-100 flex items-center">
                    <AlertCircle size={18} className="mr-2" />
                    {error}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-slate-400" />
                        </div>
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                            placeholder="Search inquirers..."
                        />
                    </div>
                    <button className="flex items-center px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-100 transition text-sm">
                        <Filter size={16} className="mr-2" />
                        Filter Read Status
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4 w-12"></th>
                                <th className="px-6 py-4">From</th>
                                <th className="px-6 py-4">Subject</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 w-32">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <RefreshCw size={24} className="animate-spin mx-auto mb-2 opacity-50" />
                                        Loading inquiries...
                                    </td>
                                </tr>
                            ) : inquiries.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No inquiries found.
                                    </td>
                                </tr>
                            ) : (
                                inquiries.map((inq) => (
                                    <tr key={inq.id} className="hover:bg-slate-50 transition cursor-pointer">
                                        <td className="px-6 py-4">
                                            {inq.status === 'UNREAD' ?
                                                <Mail size={18} className="text-indigo-600" /> :
                                                <MailOpen size={18} className="text-slate-400" />
                                            }
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className={`font-medium ${inq.status === 'UNREAD' ? 'text-slate-900' : 'text-slate-700'}`}>{inq.name}</p>
                                            <p className="text-xs text-slate-500">{inq.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className={`font-medium ${inq.status === 'UNREAD' ? 'text-slate-900' : 'text-slate-700'}`}>{inq.subject}</p>
                                            <p className="text-xs text-slate-500 truncate max-w-xs">{inq.message}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${inq.status === 'UNREAD' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                {inq.status || 'UNREAD'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">
                                            {new Date(inq.createdAt || Date.now()).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminInquiries;
