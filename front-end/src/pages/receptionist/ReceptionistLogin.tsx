import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const ReceptionistLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response: any = await api.post('/auth/login', { email, password });

            if (response.user.role !== 'RECEPTIONIST') {
                toast.error("Access Denied", {
                    description: "This portal is reserved for front desk personnel."
                });
                setIsSubmitting(false);
                return;
            }

            toast.success("Identity Verified", {
                description: "Initializing Front Desk operational environment..."
            });
            localStorage.setItem('token', response.token);
            localStorage.setItem('role', response.user.role.toLowerCase());
            navigate('/receptionist');
        } catch (err: any) {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[100px] -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[100px] -ml-64 -mb-64"></div>

            <Card className="w-full max-w-md bg-white border-slate-200 rounded-xl shadow-lg relative z-10 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600"></div>

                <CardHeader className="pt-10 pb-6 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center shadow-sm">
                            <ShieldCheck className="w-8 h-8 text-indigo-600" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-semibold text-slate-800 tracking-tight mb-2">Front Desk Login</CardTitle>
                    <p className="text-slate-500 text-sm font-normal">Radiance Health Infrastructure</p>
                </CardHeader>

                <CardContent className="px-8 pb-10">
                    <form className="space-y-5" onSubmit={handleLogin}>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                <Input
                                    type="email"
                                    required
                                    className="bg-white border-slate-200 text-slate-900 pl-11 py-2.5 rounded-lg focus-visible:ring-1 focus-visible:ring-indigo-600 transition-all font-medium placeholder:text-slate-400"
                                    placeholder="desk@radiance.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="bg-white border-slate-200 text-slate-900 pl-11 pr-11 py-2.5 rounded-lg focus-visible:ring-1 focus-visible:ring-indigo-600 transition-all font-medium placeholder:text-slate-400"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-end pt-1">
                            <button type="button" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                                Forgot password?
                            </button>
                        </div>

                        <Button
                            disabled={isSubmitting}
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-11 rounded-lg text-sm font-medium shadow-sm transition-all active:scale-[0.98] group mt-2"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center">
                                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></span>
                                    Authenticating...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    Secure Login
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-xs font-medium text-slate-400">
                            Authorized Operations Personnel Only
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ReceptionistLogin;
