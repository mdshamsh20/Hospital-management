import { useState, useEffect } from 'react';
import { IndianRupee, Plus, Search, Calendar, Tag, Trash2 } from 'lucide-react';

const AdminExpenses = () => {
    const [expenses, setExpenses] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/expenses');
            const data = await response.json();
            setExpenses(data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    const deleteExpense = async (id: number) => {
        if (!confirm('Are you sure you want to delete this expense?')) return;
        try {
            await fetch(`http://localhost:8080/api/expenses/${id}`, { method: 'DELETE' });
            fetchExpenses();
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

    return (
        <div className="space-y-6 pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Expense Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Record and track clinic operational expenses.</p>
                </div>
                <button className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-indigo-700 transition-colors">
                    <Plus size={16} />
                    <span>Record Expense</span>
                </button>
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
                            {expenses.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">
                                        No expenses recorded.
                                    </td>
                                </tr>
                            ) : null}
                            {expenses.map((expense) => (
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
                                        <button
                                            onClick={() => deleteExpense(expense.id)}
                                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
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

export default AdminExpenses;
