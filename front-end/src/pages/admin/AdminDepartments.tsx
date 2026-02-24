import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, RefreshCw, AlertCircle, Building2 } from 'lucide-react';

const AdminDepartments = () => {
    const [departments, setDepartments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchDepartments = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get('http://localhost:8080/api/departments');
            setDepartments(res.data);
        } catch (err: any) {
            console.error(err);
            setError('Failed to fetch from API. Showing empty list.');
            setDepartments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    return (
        <div className="space-y-6 pb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Departments Setup</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage hospital departments, capacities and facility nodes.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={fetchDepartments}
                        className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm shadow-sm"
                    >
                        <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin text-slate-400' : 'text-slate-500'}`} />
                        Refresh
                    </button>
                    <button className="flex items-center px-4 py-2 bg-indigo-600 border border-transparent text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm shadow-sm">
                        <Plus size={16} className="mr-2" />
                        Add Department
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
                            placeholder="Search departments..."
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                            <tr className="border-b border-slate-200">
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Department Name</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-sm text-slate-500">
                                        <RefreshCw size={24} className="animate-spin mx-auto mb-3 text-slate-300" />
                                        Loading departments...
                                    </td>
                                </tr>
                            ) : departments.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-sm text-slate-500">
                                        <Building2 size={32} className="mx-auto mb-3 text-slate-300" />
                                        No departments found in database.
                                    </td>
                                </tr>
                            ) : (
                                departments.map((dept) => (
                                    <tr key={dept.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4 text-sm font-medium text-slate-500">#{dept.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3 border border-indigo-100">
                                                    <Building2 size={16} />
                                                </div>
                                                <span className="font-semibold text-slate-900 text-sm">{dept.name}</span>
                                            </div>
                                        </td>
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

export default AdminDepartments;
