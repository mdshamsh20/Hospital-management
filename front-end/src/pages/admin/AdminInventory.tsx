import { useState, useEffect } from 'react';
import { Search, Plus, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

const AdminInventory = () => {
    const [items, setItems] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const data: any = await api.get('/inventory');
            setItems(data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = items.filter(i =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [showAddItemModal, setShowAddItemModal] = useState(false);
    const [newItemData, setNewItemData] = useState({
        name: '',
        category: '',
        stock: '0',
        unit: 'Units',
        expiryDate: ''
    });

    const [showUsageModal, setShowUsageModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [usageQty, setUsageQty] = useState(1);
    const [usedFor, setUsedFor] = useState('X-ray');

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/inventory', {
                ...newItemData,
                stock: parseInt(newItemData.stock)
            });
            setShowAddItemModal(false);
            setNewItemData({ name: '', category: '', stock: '0', unit: 'Units', expiryDate: '' });
            fetchInventory();
        } catch (err) {
            // Handled
        }
    };

    const handleRecordUsage = async () => {
        try {
            await api.post('/inventory/consumptions', {
                itemId: selectedItem.id,
                quantity: usageQty,
                usedFor
            });
            setShowUsageModal(false);
            fetchInventory();
        } catch (err) {
            // Handled
        }
    };

    return (
        <div className="space-y-6 pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inventory & Usage</h1>
                    <p className="text-slate-500 text-sm mt-1">Clinic material management & consumption audit.</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={() => setShowAddItemModal(true)}
                        className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-indigo-700 transition"
                    >
                        <Plus size={16} />
                        <span>Add New Item</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-center justify-between mb-2">
                        <div className="p-2 bg-rose-50 text-rose-600 rounded-lg border border-rose-100">
                            <AlertCircle size={20} />
                        </div>
                        <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider bg-rose-50 px-2 py-1 rounded-md border border-rose-100">Immediate Alert</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900">03</h3>
                    <p className="text-sm text-slate-500 font-medium mt-1">Materials near zero stock</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search resources..."
                            className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition placeholder:text-slate-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        <AlertCircle className="mr-2 text-indigo-600" size={14} />
                        Consumption Tracker Active
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                            <tr className="border-b border-slate-200">
                                <th className="px-6 py-4">Resource Node</th>
                                <th className="px-6 py-4 text-center">Live Stock</th>
                                <th className="px-6 py-4">Consumption Mapping</th>
                                <th className="px-6 py-4">Vendor Cycle & Expiry</th>
                                <th className="px-6 py-4 text-right">Audit Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4">
                                            <Skeleton className="h-4 w-32 mb-2" />
                                            <Skeleton className="h-3 w-20" />
                                        </td>
                                        <td className="px-6 py-4"><Skeleton className="h-8 w-12 mx-auto" /></td>
                                        <td className="px-6 py-4">
                                            <Skeleton className="h-3 w-40 mb-2" />
                                            <Skeleton className="h-3 w-24" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <Skeleton className="h-3 w-32 mb-2" />
                                            <Skeleton className="h-3 w-28" />
                                        </td>
                                        <td className="px-6 py-4 text-right"><Skeleton className="h-9 w-24 ml-auto" /></td>
                                    </tr>
                                ))
                            ) : filteredItems.map((item) => {
                                const topConsumer = item.consumptions && item.consumptions.length > 0 ? item.consumptions[0].usedFor : 'No Data';
                                const lastRestock = item.purchases && item.purchases.length > 0 ? new Date(item.purchases[0].date).toLocaleDateString() : 'Pending Entry';
                                const expiryDisplay = item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'Non-Expiring';

                                return (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4 flex flex-col items-start gap-1">
                                            <p className="font-semibold text-slate-900 text-sm">{item.name}</p>
                                            <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-slate-200 mt-1">{item.category}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className={`text-lg font-bold ${item.stock < 10 ? 'text-rose-600' : 'text-slate-900'}`}>
                                                    {item.stock}
                                                </span>
                                                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-0.5">/ {item.unit}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col space-y-2">
                                                <div className="flex items-center">
                                                    <span className="text-xs font-medium text-slate-500 w-20">Top Link:</span>
                                                    <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">{topConsumer}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-xs font-medium text-slate-500 w-20">Last Draft:</span>
                                                    <span className="text-xs font-medium text-slate-700">
                                                        {item.consumptions && item.consumptions.length > 0 ? `${item.consumptions[0].quantity} unit/s` : '-'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col space-y-2">
                                                <div className="flex items-center">
                                                    <span className="text-xs font-medium text-slate-500 w-20">Restock:</span>
                                                    <span className="text-xs font-medium text-slate-900">{lastRestock}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-xs font-medium text-slate-500 w-20">Expiry:</span>
                                                    <span className={`text-xs font-medium ${item.expiryDate && new Date(item.expiryDate) < new Date() ? 'text-rose-600' : 'text-slate-700'}`}>{expiryDisplay}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => { setSelectedItem(item); setShowUsageModal(true); }}
                                                className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-4 py-2 rounded-lg text-xs font-semibold shadow-sm hover:bg-indigo-600 hover:text-white transition-colors"
                                            >
                                                Link Usage
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add New Item Modal */}
            {showAddItemModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-xl animate-scale-in">
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Add New Resource</h3>
                        <p className="text-sm font-medium text-slate-500 mb-6">Create a new inventory tracking node</p>

                        <form onSubmit={handleAddItem} className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Resource Name</label>
                                <input
                                    required
                                    type="text"
                                    value={newItemData.name}
                                    onChange={e => setNewItemData({ ...newItemData, name: e.target.value })}
                                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="e.g. Dental Cement"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Category</label>
                                <select
                                    required
                                    value={newItemData.category}
                                    onChange={e => setNewItemData({ ...newItemData, category: e.target.value })}
                                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    <option value="">Select Category</option>
                                    <option value="Radiology">Radiology</option>
                                    <option value="Dental">Dental</option>
                                    <option value="Surgical">Surgical</option>
                                    <option value="General">General</option>
                                </select>
                            </div>

                            {['Radiology', 'Dental', 'Surgical'].includes(newItemData.category) && (
                                <div>
                                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Expiry Date</label>
                                    <input
                                        required
                                        type="date"
                                        value={newItemData.expiryDate}
                                        onChange={e => setNewItemData({ ...newItemData, expiryDate: e.target.value })}
                                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1 italic">Required for medical/surgical supplies</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Initial Stock</label>
                                    <input
                                        required
                                        type="number"
                                        value={newItemData.stock}
                                        onChange={e => setNewItemData({ ...newItemData, stock: e.target.value })}
                                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Unit</label>
                                    <input
                                        required
                                        type="text"
                                        value={newItemData.unit}
                                        onChange={e => setNewItemData({ ...newItemData, unit: e.target.value })}
                                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="e.g. Pack"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowAddItemModal(false)}
                                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-indigo-700 transition-colors"
                                >
                                    Create Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Usage Modal */}
            {showUsageModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-xl animate-scale-in">
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Record Material Use</h3>
                        <p className="text-sm font-medium text-slate-500 mb-6">Decrementing stock for {selectedItem?.name}</p>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Quantity Used</label>
                                <input
                                    type="number"
                                    value={usageQty}
                                    onChange={e => setUsageQty(parseInt(e.target.value))}
                                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    min="1"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Procedure / use case</label>
                                <select
                                    value={usedFor}
                                    onChange={e => setUsedFor(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    <option value="X-ray">X-Ray (Radiology)</option>
                                    <option value="RCT">RCT (Dental)</option>
                                    <option value="Extraction">Extraction (Dental)</option>
                                    <option value="Denture">Denture Fabrication</option>
                                    <option value="Clinic General">Clinic General</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => setShowUsageModal(false)}
                                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRecordUsage}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-indigo-700 transition-colors"
                                >
                                    Commit Usage
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminInventory;
