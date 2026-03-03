import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/lib/api';
import { bookingSchema } from '@/lib/validations';
import { Calendar, Clock, User, Phone, Mail, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const BookAppointment = () => {
    const [departments, setDepartments] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<any>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            preferredTime: 'morning'
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [deptRes, docsRes]: [any, any] = await Promise.all([
                    api.get('/departments'),
                    api.get('/doctors')
                ]);
                setDepartments(deptRes);
                setDoctors(docsRes);
            } catch (error) {
                // Handled
            }
        };
        fetchData();
    }, []);

    const onBookingSubmit = async (data: any) => {
        try {
            const messageStr = `Preferred Time: ${data.preferredTime || 'Not Specified'}`;
            const combinedNotes = data.notes ? `${messageStr} - Notes: ${data.notes}` : messageStr;

            await api.post('/appointments/register', {
                ...data,
                notes: combinedNotes,
                message: "Online Booking",
                visitType: 'Consultation',
                priority: 'Normal',
                isWalkIn: false
            });

            toast.success("Appointment Confirmed", {
                description: "Your appointment request has been added to our operational queue."
            });
            reset();
        } catch (error) {
            // Handled
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-8 md:p-12 text-center text-white">
                        <h2 className="text-3xl md:text-4xl font-semibold mb-4">Book Your Appointment</h2>
                        <p className="text-primary-100 max-w-xl mx-auto">Schedule a consultation with our experienced medical professionals. We'll make sure you're seen as quickly as possible.</p>
                    </div>

                    <form className="p-8 md:p-12 space-y-8" onSubmit={handleSubmit(onBookingSubmit)}>
                        {/* Section 1: Patient Details */}
                        <div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center border-b border-slate-100 pb-4">
                                <span className="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
                                Patient Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2 flex flex-row items-center"><User className="w-4 h-4 mr-2 text-slate-400" /> Full Name *</label>
                                    <input
                                        type="text"
                                        {...register('name')}
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-rose-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-primary-500 transition bg-slate-50 focus:bg-white`}
                                        placeholder="John Doe"
                                    />
                                    {errors.name && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.name.message as string}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2 flex flex-row items-center"><Phone className="w-4 h-4 mr-2 text-slate-400" /> Phone Number *</label>
                                    <input
                                        type="tel"
                                        {...register('phone')}
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-rose-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-primary-500 transition bg-slate-50 focus:bg-white`}
                                        placeholder="(555) 123-4567"
                                    />
                                    {errors.phone && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.phone.message as string}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-2 flex flex-row items-center"><Mail className="w-4 h-4 mr-2 text-slate-400" /> Email Address</label>
                                    <input
                                        type="email"
                                        {...register('email')}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition bg-slate-50 focus:bg-white"
                                        placeholder="john.doe@example.com"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Appointment Details */}
                        <div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center border-b border-slate-100 pb-4">
                                <span className="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
                                Appointment Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Department *</label>
                                    <select
                                        {...register('departmentId')}
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.departmentId ? 'border-rose-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-primary-500 transition bg-slate-50 focus:bg-white appearance-none`}
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map((dept: any) => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                                    </select>
                                    {errors.departmentId && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.departmentId.message as string}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Doctor (Optional)</label>
                                    <select
                                        {...register('doctorId')}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition bg-slate-50 focus:bg-white appearance-none"
                                    >
                                        <option value="">Any Available Doctor</option>
                                        {doctors.map((doc: any) => <option key={doc.id} value={doc.id}>{doc.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2 flex flex-row items-center"><Calendar className="w-4 h-4 mr-2 text-slate-400" /> Preferred Date *</label>
                                    <input
                                        type="date"
                                        {...register('preferredDate')}
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.preferredDate ? 'border-rose-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-primary-500 transition bg-slate-50 focus:bg-white`}
                                    />
                                    {errors.preferredDate && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.preferredDate.message as string}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2 flex flex-row items-center"><Clock className="w-4 h-4 mr-2 text-slate-400" /> Preferred Time</label>
                                    <select
                                        {...register('preferredTime')}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition bg-slate-50 focus:bg-white appearance-none"
                                    >
                                        <option value="">Select Time Slot</option>
                                        <option value="morning">Morning (9AM - 12PM)</option>
                                        <option value="afternoon">Afternoon (1PM - 4PM)</option>
                                        <option value="evening">Evening (5PM - 8PM)</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-2 flex flex-row items-center"><MessageSquare className="w-4 h-4 mr-2 text-slate-400" /> Additional Notes</label>
                                    <textarea
                                        {...register('notes')}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition bg-slate-50 focus:bg-white resize-none"
                                        placeholder="Briefly describe your symptoms or reason for visit..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-8 rounded-xl transition-all hover:-translate-y-1 shadow-xl shadow-primary-500/30 text-lg flex justify-center items-center disabled:opacity-75 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Submitting Request...' : 'Confirm Booking Request'}
                            </button>
                            <p className="text-center text-sm text-slate-500 mt-4">We will contact you shortly to confirm your exact appointment time.</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookAppointment;
