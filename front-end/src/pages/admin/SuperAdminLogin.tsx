import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import { ShieldAlert, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

const SuperAdminLogin = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onLoginSubmit = async (data: LoginForm) => {
        try {
            const response: any = await api.post('/auth/login', data);

            if (response.user.role !== 'SUPER_ADMIN') {
                return toast.error("Access Denied. Owner credentials required.");
            }

            localStorage.setItem('token', response.token);
            localStorage.setItem('role', response.user.role.toLowerCase());
            toast.success("Executive Authentication Verified");
            navigate('/super-admin');
        } catch (err: any) {
            // Handled by api interceptor
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
            {/* Dark premium aesthetic for executive login */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="flex justify-center mb-6 text-indigo-400">
                    <ShieldAlert size={56} className="drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
                    Executive Control
                </h2>
                <p className="mt-2 text-center text-sm font-semibold tracking-wider uppercase text-slate-400">
                    Clinic Owner Portal
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-slate-900/50 backdrop-blur-xl py-8 px-4 shadow-2xl border border-white/10 sm:rounded-2xl sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit(onLoginSubmit)}>
                        <div>
                            <label className="block text-xs font-bold tracking-wider uppercase text-slate-300">Executive ID</label>
                            <div className="mt-2 relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    type="email"
                                    {...register('email')}
                                    className={`block w-full pl-10 px-4 py-3 sm:text-sm text-white border-white/10 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-black/40 transition border placeholder:text-slate-600 ${errors.email ? 'border-rose-500' : ''}`}
                                    placeholder="admin@medicare.com"
                                />
                            </div>
                            {errors.email && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold tracking-wider uppercase text-slate-300">Security Key</label>
                            <div className="mt-2 relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password')}
                                    className={`block w-full pl-10 pr-10 px-4 py-3 sm:text-sm text-white border-white/10 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-black/40 transition border placeholder:text-slate-600 ${errors.password ? 'border-rose-500' : ''}`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-indigo-400 transition"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.password.message}</p>}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] text-xs uppercase tracking-widest font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? 'Initiating Handshake...' : 'Authenticate'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminLogin;
