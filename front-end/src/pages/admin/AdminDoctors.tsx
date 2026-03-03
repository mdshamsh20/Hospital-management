import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Search, UserPlus, RefreshCw, AlertCircle } from 'lucide-react';

const AdminDoctors = () => {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchDoctors = async () => {
        setLoading(true);
        setError('');
        try {
            const data: any = await api.get('/doctors');
            setDoctors(data);
        } catch (err: any) {
            setError('Failed to fetch from API. Showing empty list.');
            setDoctors([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    return (
        <div className="space-y-6 pb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Doctors Control</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage hospital doctors, schedules and their specialties.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={fetchDoctors}
                        className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm shadow-sm"
                    >
                        <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin text-slate-400' : 'text-slate-500'}`} />
                        Refresh
                    </button>
                    <button className="flex items-center px-4 py-2 bg-indigo-600 border border-transparent text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm shadow-sm">
                        <UserPlus size={16} className="mr-2" />
                        Add Doctor
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-rose-50 text-rose-700 p-4 rounded-lg text-sm border border-rose-200 flex items-center shadow-sm">
                    <AlertCircle size={18} className="mr-2" />
                    {error}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative w-full sm:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-slate-400" />
                        </div>
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition placeholder:text-slate-400 shadow-sm"
                            placeholder="Search doctors..."
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                            <tr className="border-b border-slate-200">
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4">Specialty</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">
                                        <RefreshCw size={24} className="animate-spin mx-auto mb-3 text-slate-300" />
                                        Loading doctors...
                                    </td>
                                </tr>
                            ) : doctors.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">
                                        No doctors found in database.
                                    </td>
                                </tr>
                            ) : (
                                doctors.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4 text-sm font-medium text-slate-500">#{doc.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm border border-indigo-100">
                                                    {doc.name.charAt(4) === '.' ? doc.name.charAt(5).toUpperCase() : doc.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-semibold text-slate-900 text-sm">{doc.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-600">{doc.department?.name || 'Unassigned'}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-600">{doc.specialty || '-'}</td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors">Edit</button>
                                            <button className="text-rose-500 hover:text-rose-700 font-medium text-sm transition-colors">Delete</button>
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

export default AdminDoctors;
