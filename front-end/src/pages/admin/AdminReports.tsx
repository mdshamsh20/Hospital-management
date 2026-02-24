import { FileText, Download, Filter, Calendar } from 'lucide-react';

const AdminReports = () => {
    const reports = [
        { id: 1, name: 'Monthly Financial Report', date: 'Feb 2026', type: 'Financial', size: '1.2 MB' },
        { id: 2, name: 'Staff Performance Summary', date: 'Jan 2026', type: 'Staff', size: '850 KB' },
        { id: 3, name: 'Radiology Statistics', date: 'Q1 2026', type: 'Radiology', size: '2.4 MB' },
        { id: 4, name: 'Inventory Usage Report', date: 'Weekly', type: 'Inventory', size: '500 KB' },
        { id: 5, name: 'Dental Treatment Stats', date: '2025 Annual', type: 'Dental', size: '4.1 MB' },
    ];

    return (
        <div className="space-y-6 pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Reports & Analytics</h1>
                    <p className="text-slate-500 text-sm mt-1">Export clinic data into PDF or Excel formats.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex items-center justify-center space-x-2 bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm text-sm">
                        <Filter size={16} />
                        <span>Filter Reports</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm text-sm">
                        <FileText size={16} />
                        <span>Generate Custom Report</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                            <tr className="border-b border-slate-200">
                                <th className="px-6 py-4">Report Name</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Period</th>
                                <th className="px-6 py-4">Size</th>
                                <th className="px-6 py-4 text-center">Download</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {reports.map((report) => (
                                <tr key={report.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 border border-indigo-100 group-hover:bg-indigo-100 transition-colors">
                                                <FileText size={18} />
                                            </div>
                                            <span className="font-semibold text-slate-900 text-sm">{report.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-md border border-indigo-100">
                                            {report.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        <div className="flex items-center text-sm font-medium">
                                            <Calendar size={14} className="mr-2 text-slate-400" />
                                            {report.date}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm font-medium">{report.size}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center">
                                            <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100">
                                                <Download size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
