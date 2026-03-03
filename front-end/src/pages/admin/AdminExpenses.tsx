import { useState, useEffect } from 'react';
import { IndianRupee, Plus, Search, Calendar, Tag, Trash2, X } from 'lucide-react';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from "sonner";

const AdminExpenses = () => {
    const [expenses, setExpenses] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showRecordModal, setShowRecordModal] = useState(false);
    const [newExpenseData, setNewExpenseData] = useState({
        category: '',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0]
    });

    const [loading, setLoading] = useState(true);
    const userRole = localStorage.getItem('role');

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const data: any = await api.get('/expenses');
            setExpenses(data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
            // Handled globally but can toast locally if needed
        } finally {
            setLoading(false);
        }
    };

    const handleRecordExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/expenses', {
                ...newExpenseData,
                amount: parseFloat(newExpenseData.amount)
            });
            setShowRecordModal(false);
            setNewExpenseData({
                category: '',
                description: '',
                amount: '',
                date: new Date().toISOString().split('T')[0]
            });
            toast.success("Expense recorded successfully");
            fetchExpenses();
        } catch (error) {
            // Handled
        }
    };

    const deleteExpense = async (id: number) => {
        if (!confirm('Are you sure you want to delete this expense?')) return;
        try {
            await api.delete(`/expenses/${id}`);
            toast.success("Expense deleted");
            fetchExpenses();
        } catch (error) {
            // Handled
        }
    };

    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

    const filteredExpenses = expenses.filter(e =>
        e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Expense Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Record and track clinic operational expenses.</p>
                </div>
                {userRole === 'super_admin' && (
                    <button
                        onClick={() => setShowRecordModal(true)}
                        className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-indigo-700 transition-colors"
                    >
                        <Plus size={16} />
                        <span>Record Expense</span>
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            <IndianRupee size={20} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900">₹{totalExpense.toLocaleString()}</h3>
                    <p className="text-sm text-slate-500 font-medium mt-1">Total Expenses (Selected Period)</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search expenses..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition placeholder:text-slate-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                            <tr className="border-b border-slate-200">
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-48" /></td>
                                        <td className="px-6 py-4 text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
                                        <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 ml-auto rounded-lg" /></td>
                                    </tr>
                                ))
                            ) : filteredExpenses.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">
                                        No expenses recorded.
                                    </td>
                                </tr>
                            ) : (
                                filteredExpenses.map((expense) => (
                                    <tr key={expense.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2 text-slate-600">
                                                <Calendar size={14} />
                                                <span className="text-sm font-medium">{new Date(expense.date).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <Tag size={14} className="text-indigo-500" />
                                                <span className="font-semibold text-sm text-slate-900">{expense.category}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-600">{expense.description}</td>
                                        <td className="px-6 py-4 text-right font-semibold text-sm text-slate-900">₹{expense.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            {userRole === 'super_admin' && (
                                                <button
                                                    onClick={() => deleteExpense(expense.id)}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Record Expense Modal */}
            {showRecordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-xl w-full max-w-sm overflow-hidden shadow-2xl animate-scale-in">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="font-bold text-slate-900">Record Operational Expense</h3>
                            <button onClick={() => setShowRecordModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleRecordExpense} className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5 block">Category</label>
                                <select
                                    required
                                    value={newExpenseData.category}
                                    onChange={(e) => setNewExpenseData({ ...newExpenseData, category: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                >
                                    <option value="">Select Category</option>
                                    <option value="Medical Supplies">Medical Supplies</option>
                                    <option value="Staff Salary">Staff Salary</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Utilities">Utilities</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Lab Charges">Lab Charges</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5 block">Description</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Electricity bill for Jan"
                                    value={newExpenseData.description}
                                    onChange={(e) => setNewExpenseData({ ...newExpenseData, description: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5 block">Amount (₹)</label>
                                    <input
                                        required
                                        type="number"
                                        placeholder="0.00"
                                        value={newExpenseData.amount}
                                        onChange={(e) => setNewExpenseData({ ...newExpenseData, amount: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5 block">Date</label>
                                    <input
                                        required
                                        type="date"
                                        value={newExpenseData.date}
                                        onChange={(e) => setNewExpenseData({ ...newExpenseData, date: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition active:scale-[0.98] mt-2"
                            >
                                Commit Record
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminExpenses;
