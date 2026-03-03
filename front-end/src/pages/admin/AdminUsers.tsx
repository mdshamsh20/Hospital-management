import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Shield, Plus, Trash2, Key, Users } from 'lucide-react';
import { toast } from 'sonner';

const AdminUsers = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // New User Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('RECEPTIONIST');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data: any = await api.get('/admin/users');
            setUsers(data);
        } catch (error) {
            toast.error('Failed to load system users');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/admin/users', { email, password, role });
            toast.success(`${role} account created successfully`);
            setEmail('');
            setPassword('');
            setRole('RECEPTIONIST');
            fetchUsers();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to create user');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!confirm('Are you sure you want to revoke system access for this user?')) return;

        try {
            await api.delete(`/admin/users/${id}`);
            toast.success('User removed successfully');
            fetchUsers();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to delete user');
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'SUPER_ADMIN': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'ADMIN': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            case 'RECEPTIONIST': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'DOCTOR': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="space-y-6 pb-8 font-sans">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">System Access Control</h1>
                <p className="text-slate-500 text-sm mt-1 flex items-center font-medium">
                    <Shield className="mr-2 text-indigo-600" size={16} />
                    Super Admin Only: Manage clinical portal authentication
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Create User Panel */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center mb-6">
                            <Plus className="mr-2 text-emerald-600" size={20} />
                            Provision New Account
                        </h2>

                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email / Username</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 transition-shadow"
                                    placeholder="user@medicare.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Initial Password</label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 transition-shadow"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Access Role</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 transition-shadow"
                                >
                                    <option value="RECEPTIONIST">Receptionist (Front Desk)</option>
                                    <option value="ADMIN">Admin (Operations Manager)</option>
                                    <option value="DOCTOR">Doctor</option>
                                    <option value="SUPER_ADMIN">Super Admin (Owner)</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50 mt-6"
                            >
                                {submitting ? 'Provisioning...' : 'Provision Access'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Users List Panel */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center">
                                <Users className="mr-2 text-indigo-600" size={20} />
                                Active System Directory
                            </h2>
                            <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                {users.length} Accounts Active
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Account Identity</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned Role</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100">
                                    {loading ? (
                                        <tr><td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-500">Loading directory...</td></tr>
                                    ) : users.map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                                        <Key size={16} className="text-slate-500" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-bold text-slate-900">{u.email}</div>
                                                        <div className="text-xs text-slate-500">ID: #{u.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getRoleBadgeColor(u.role)}`}>
                                                    {u.role.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleDeleteUser(u.id)}
                                                    className="text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 p-2 rounded-lg transition-colors"
                                                    title="Revoke Access"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
