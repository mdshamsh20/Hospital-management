import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Settings, Save, Clock, IndianRupee, Bell, Shield, Terminal } from 'lucide-react';
import { toast } from 'sonner';

const AdminSettings = () => {
    const [settings, setSettings] = useState<any>({
        clinicName: '',
        startTime: '',
        endTime: '',
        tokenResetRule: '',
        defaultXrayFee: 0,
        defaultUsgFee: 0,
        labTurnaround: 0,
        referralComm: 10,
        doctorComm: 60
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const data: any = await api.get('/admin/settings');
            setSettings(data);
        } catch (err) {
            console.error('Settings fetch failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.patch('/admin/settings', settings);
            toast.success('Settings updated successfully');
        } catch (err) {
            console.error('Update failed');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6 pb-8">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="h-[300px] rounded-xl" />
                    <Skeleton className="h-[300px] rounded-xl" />
                    <Skeleton className="h-[200px] rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Clinic Control Panel</h1>
                    <p className="text-slate-500 text-sm mt-1 flex items-center font-medium">
                        <Terminal className="mr-2 text-indigo-500" size={16} />
                        Global Configuration & Standards
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                    <Save size={16} />
                    <span>{saving ? 'Synchronizing...' : 'Apply Changes'}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General Settings */}
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center mb-6">
                        <Settings className="mr-2 text-indigo-600" size={20} />
                        Core Identity
                    </h2>
                    <div className="space-y-5">
                        <div>
                            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Clinic Branding Name</label>
                            <input
                                type="text"
                                value={settings.clinicName}
                                onChange={e => setSettings({ ...settings, clinicName: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                                placeholder="Enter clinic name"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Opening Hour</label>
                                <div className="relative">
                                    <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="time"
                                        value={settings.startTime}
                                        onChange={e => setSettings({ ...settings, startTime: e.target.value })}
                                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 pl-9 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Closing Hour</label>
                                <div className="relative">
                                    <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="time"
                                        value={settings.endTime}
                                        onChange={e => setSettings({ ...settings, endTime: e.target.value })}
                                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 pl-9 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Financial Standards */}
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center mb-6">
                        <IndianRupee className="mr-2 text-emerald-600" size={20} />
                        Pricing Standards
                    </h2>
                    <div className="space-y-5">
                        <div>
                            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Default X-Ray Fee (₹)</label>
                            <input
                                type="number"
                                value={settings.defaultXrayFee}
                                onChange={e => setSettings({ ...settings, defaultXrayFee: parseFloat(e.target.value) })}
                                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Default Ultrasound Fee (₹)</label>
                            <input
                                type="number"
                                value={settings.defaultUsgFee}
                                onChange={e => setSettings({ ...settings, defaultUsgFee: parseFloat(e.target.value) })}
                                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Lab Turnaround Cycle (Days)</label>
                            <input
                                type="number"
                                value={settings.labTurnaround}
                                onChange={e => setSettings({ ...settings, labTurnaround: parseInt(e.target.value) })}
                                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Doctor Split (%)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={settings.doctorComm !== undefined ? settings.doctorComm : ''}
                                    onChange={e => setSettings({ ...settings, doctorComm: parseFloat(e.target.value) })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Referral Split (%)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={settings.referralComm !== undefined ? settings.referralComm : ''}
                                    onChange={e => setSettings({ ...settings, referralComm: parseFloat(e.target.value) })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Automation & Security */}
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm md:col-span-2 lg:col-span-1">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center mb-6">
                        <Shield className="mr-2 text-indigo-600" size={20} />
                        Automation Rules
                    </h2>
                    <div className="space-y-5">
                        <div>
                            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Token Reset Sequence</label>
                            <select
                                value={settings.tokenResetRule}
                                onChange={e => setSettings({ ...settings, tokenResetRule: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                            >
                                <option value="Daily">Automatic Daily Reset</option>
                                <option value="Manual">Manual Reset Only</option>
                                <option value="Monthly">Monthly Cycle</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <Bell size={18} className="text-slate-400" />
                                <span className="text-sm font-semibold text-slate-700">System Notifications</span>
                            </div>
                            <div className="w-11 h-6 bg-indigo-600 rounded-full relative cursor-pointer border-2 border-transparent transition-colors">
                                <div className="absolute right-0 top-0 w-5 h-5 bg-white rounded-full shadow border-slate-200"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
