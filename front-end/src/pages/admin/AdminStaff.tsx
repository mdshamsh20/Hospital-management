import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Search, Edit2, Trash2, Activity, IndianRupee } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminStaff = () => {
    const [staff, setStaff] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('list'); // list, attendance, salary
    const [showOnboardModal, setShowOnboardModal] = useState(false);
    const [editingStaffId, setEditingStaffId] = useState<number | null>(null);
    const [staffToDelete, setStaffToDelete] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '', role: '', contact: '', salary: '', joiningDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/staff');
            const data = await response.json();
            setStaff(data);
        } catch (error) {
            console.error('Error fetching staff:', error);
        }
    };

    const checkIn = async (staffId: number) => {
        try {
            await axios.post('http://localhost:8080/api/staff/attendance/check-in', { staffId });
            fetchStaff();
        } catch (error) {
            console.error('Error checking in:', error);
        }
    };

    const checkOut = async (staffId: number) => {
        try {
            await axios.post('http://localhost:8080/api/staff/attendance/check-out', { staffId });
            fetchStaff();
        } catch (error) {
            console.error('Error checking out:', error);
        }
    };

    const handleEdit = (staffMember: any) => {
        setEditingStaffId(staffMember.id);
        setFormData({
            name: staffMember.name,
            role: staffMember.role,
            contact: staffMember.contact,
            salary: staffMember.salary?.toString() || '',
            joiningDate: staffMember.joiningDate ? new Date(staffMember.joiningDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        });
        setShowOnboardModal(true);
    };

    const handleDelete = (id: number) => {
        setStaffToDelete(id);
    };

    const confirmDelete = async () => {
        if (!staffToDelete) return;
        try {
            await axios.delete(`http://localhost:8080/api/staff/${staffToDelete}`);
            toast.success("Staff removed successfully");
            fetchStaff();
        } catch (error) {
            toast.error("Failed to delete staff");
        } finally {
            setStaffToDelete(null);
        }
    };

    const handleOnboardSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingStaffId) {
                await axios.put(`http://localhost:8080/api/staff/${editingStaffId}`, formData);
                toast.success("Staff details updated");
            } else {
                await axios.post('http://localhost:8080/api/staff', formData);
                toast.success("Staff onboarded successfully");
            }
            setShowOnboardModal(false);
            setFormData({ name: '', role: '', contact: '', salary: '', joiningDate: new Date().toISOString().split('T')[0] });
            setEditingStaffId(null);
            fetchStaff();
        } catch (error) {
            toast.error("Failed to save staff record");
        }
    };

    const filteredStaff = staff.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Staff & HR Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Clinic personnel audit, attendance & payroll control.</p>
                </div>

                <button onClick={() => {
                    setEditingStaffId(null);
                    setFormData({ name: '', role: '', contact: '', salary: '', joiningDate: new Date().toISOString().split('T')[0] });
                    setShowOnboardModal(true);
                }} className="flex items-center justify-center space-x-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-slate-800 transition">
                    <UserPlus size={16} />
                    <span>Onboard Staff</span>
                </button>

                <Dialog open={showOnboardModal} onOpenChange={(open) => {
                    setShowOnboardModal(open);
                    if (!open) {
                        setEditingStaffId(null);
                        setFormData({ name: '', role: '', contact: '', salary: '', joiningDate: new Date().toISOString().split('T')[0] });
                    }
                }}>
                    <DialogContent className="max-w-md bg-white p-6 rounded-2xl border-none shadow-xl">
                        <DialogHeader className="mb-4">
                            <DialogTitle className="text-xl font-bold text-slate-900">
                                {editingStaffId ? 'Edit Staff Details' : 'Onboard New Staff'}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleOnboardSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</label>
                                <Input required className="w-full bg-slate-50 border-slate-200" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Designation / Role</label>
                                <Input required className="w-full bg-slate-50 border-slate-200" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Number</label>
                                <Input required className="w-full bg-slate-50 border-slate-200" value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Base Salary (₹)</label>
                                    <Input required type="number" className="w-full bg-slate-50 border-slate-200" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Joining Date</label>
                                    <Input required type="date" className="w-full bg-slate-50 border-slate-200" value={formData.joiningDate} onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })} />
                                </div>
                            </div>
                            <DialogFooter className="pt-4">
                                <Button type="button" variant="outline" onClick={() => setShowOnboardModal(false)}>Cancel</Button>
                                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">Save Record</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog open={staffToDelete !== null} onOpenChange={(open) => !open && setStaffToDelete(null)}>
                    <DialogContent className="max-w-sm bg-white p-6 rounded-2xl border-none shadow-xl flex flex-col items-center text-center">
                        <DialogHeader className="w-full flex flex-col items-center">
                            <div className="w-12 h-12 bg-rose-100/50 text-rose-600 rounded-full flex items-center justify-center mb-3">
                                <Trash2 size={22} className="stroke-[2.5px]" />
                            </div>
                            <DialogTitle className="text-xl font-bold text-slate-900 mb-1 w-full text-center">Remove Staff Member?</DialogTitle>
                        </DialogHeader>
                        <p className="text-sm text-slate-500 mb-6 px-2 leading-relaxed">
                            This action cannot be undone. This will permanently remove the staff member and their details from the clinic's registry.
                        </p>
                        <div className="flex gap-3 w-full">
                            <Button type="button" variant="outline" onClick={() => setStaffToDelete(null)} className="flex-1 bg-white border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold h-11 rounded-xl">Cancel</Button>
                            <Button type="button" onClick={confirmDelete} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-sm h-11 rounded-xl shadow-rose-600/20 w-full text-center">Delete</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Premium Tab System */}
            <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit border border-slate-200 shadow-sm">
                {['list', 'attendance', 'salary'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab
                            ? 'bg-white text-slate-900 shadow-sm border-slate-200'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                            }`}
                    >
                        {tab === 'list' ? 'Staff List' : tab === 'attendance' ? 'Live Attendance' : 'Salary Log'}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {activeTab === 'list' && (
                    <>
                        <div className="p-6 border-b border-slate-200 bg-slate-50">
                            <div className="relative max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search staff by name or role..."
                                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition placeholder:text-slate-400"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                                    <tr className="border-b border-slate-200">
                                        <th className="px-6 py-4">Associate</th>
                                        <th className="px-6 py-4">Designation</th>
                                        <th className="px-6 py-4">Contact Detail</th>
                                        <th className="px-6 py-4">Base Pay</th>
                                        <th className="px-6 py-4">Today Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredStaff.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">
                                                No staff members found.
                                            </td>
                                        </tr>
                                    ) : null}
                                    {filteredStaff.map((member) => (
                                        <tr key={member.id} className="hover:bg-slate-50 transition colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm border border-indigo-100">
                                                        {member.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-semibold text-slate-900 text-sm">{member.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 font-medium text-sm">{member.role}</td>
                                            <td className="px-6 py-4 text-slate-600 font-medium text-sm">{member.contact}</td>
                                            <td className="px-6 py-4 text-emerald-600 font-semibold text-sm">₹{member.salary?.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                {member.attendance?.[0]?.status === 'Present' ? (
                                                    <span className="text-emerald-700 text-xs font-medium bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">Clocked In</span>
                                                ) : (
                                                    <span className="text-slate-600 text-xs font-medium bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">Offline</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button onClick={() => handleEdit(member)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(member.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {activeTab === 'attendance' && (
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <Activity className="mx-auto mb-3 text-indigo-200" size={48} />
                            <h3 className="text-lg font-bold text-slate-900">Live Attendance Monitor</h3>
                            <p className="text-sm font-medium text-slate-500 mt-1">Real-time check-in logs</p>
                        </div>
                        <div className="overflow-x-auto border rounded-xl border-slate-200">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                                    <tr className="border-b border-slate-200">
                                        <th className="px-6 py-4">Staff Member</th>
                                        <th className="px-6 py-4">Check-In</th>
                                        <th className="px-6 py-4">Check-Out</th>
                                        <th className="px-6 py-4 text-right">Duty Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {staff.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-500">
                                                No staff members found.
                                            </td>
                                        </tr>
                                    ) : null}
                                    {staff.map(member => (
                                        <tr key={member.id} className="hover:bg-slate-50 transition colors">
                                            <td className="px-6 py-4 font-semibold text-slate-900 text-sm">{member.name}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-slate-600">{member.attendance?.[0]?.checkIn ? new Date(member.attendance[0].checkIn).toLocaleTimeString() : '--'}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-slate-600">{member.attendance?.[0]?.checkOut ? new Date(member.attendance[0].checkOut).toLocaleTimeString() : '--'}</td>
                                            <td className="px-6 py-4 text-right">
                                                {member.attendance?.[0]?.checkIn && !member.attendance?.[0]?.checkOut ? (
                                                    <button onClick={() => checkOut(member.id)} className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-semibold border border-amber-200 hover:bg-amber-100 transition">End Shift</button>
                                                ) : member.attendance?.[0]?.checkOut ? (
                                                    <span className="text-slate-500 text-xs font-semibold">Shift Ended</span>
                                                ) : (
                                                    <button onClick={() => checkIn(member.id)} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm hover:bg-emerald-700 transition">Start Shift</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'salary' && (
                    <div className="p-16 text-center">
                        <IndianRupee className="mx-auto mb-4 text-slate-300" size={48} />
                        <h3 className="text-lg font-bold text-slate-900">Historical Salary Log</h3>
                        <p className="text-sm font-medium text-slate-500 mt-2">Audit trail for monthly disbursements.</p>
                        <p className="text-xs text-slate-400 mt-4">Feature in development</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminStaff;
