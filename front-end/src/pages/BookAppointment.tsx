import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, MessageSquare } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BookAppointment = () => {
    const [departments, setDepartments] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const [preferredDate, setPreferredDate] = useState('');
    const [preferredTime, setPreferredTime] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [deptRes, docsRes] = await Promise.all([
                    axios.get('http://localhost:8080/api/departments'),
                    axios.get('http://localhost:8080/api/doctors')
                ]);
                setDepartments(deptRes.data);
                setDoctors(docsRes.data);
            } catch (error) {
                console.error("Failed to fetch form data", error);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !phone || !departmentId || !preferredDate) {
            toast.error("Missing Information", {
                description: "Please fill out all required fields (Name, Phone, Department, Date)."
            });
            return;
        }

        setIsSubmitting(true);

        const messageStr = `Preferred Time: ${preferredTime || 'Not Specified'}`;
        const combinedNotes = notes ? `${messageStr} - Notes: ${notes}` : messageStr;

        try {
            await axios.post('http://localhost:8080/api/appointments/register', {
                name,
                phone,
                departmentId: departmentId ? parseInt(departmentId) : undefined,
                doctorId: doctorId ? parseInt(doctorId) : undefined,
                notes: combinedNotes,
                message: "Online Booking",
                visitType: 'Consultation',
                priority: 'Normal',
                isWalkIn: false
            });

            toast.success("Appointment Confirmed", {
                description: "Your appointment request has been added to our operational queue."
            });

            // Reset form
            setName('');
            setPhone('');
            setEmail('');
            setDepartmentId('');
            setDoctorId('');
            setPreferredDate('');
            setPreferredTime('');
            setNotes('');
        } catch (error) {
            console.error("Failed to submit booking request", error);
            toast.error("Submission Failed", {
                description: "There was a problem registering your appointment. Please try again."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-8 md:p-12 text-center text-white">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Book Your Appointment</h2>
                        <p className="text-primary-100 max-w-xl mx-auto">Schedule a consultation with our experienced medical professionals. We'll make sure you're seen as quickly as possible.</p>
                    </div>

                    <form className="p-8 md:p-12 space-y-8" onSubmit={handleSubmit}>
                        {/* Section 1: Patient Details */}
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center border-b border-slate-100 pb-4">
                                <span className="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
                                Patient Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2 flex flex-row items-center"><User className="w-4 h-4 mr-2 text-slate-400" /> Full Name *</label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition bg-slate-50 focus:bg-white" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2 flex flex-row items-center"><Phone className="w-4 h-4 mr-2 text-slate-400" /> Phone Number *</label>
                                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition bg-slate-50 focus:bg-white" placeholder="(555) 123-4567" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-2 flex flex-row items-center"><Mail className="w-4 h-4 mr-2 text-slate-400" /> Email Address</label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition bg-slate-50 focus:bg-white" placeholder="john.doe@example.com" />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Appointment Details */}
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center border-b border-slate-100 pb-4">
                                <span className="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
                                Appointment Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Department *</label>
                                    <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition bg-slate-50 focus:bg-white appearance-none">
                                        <option value="">Select Department</option>
                                        {departments.map((dept: any) => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Doctor (Optional)</label>
                                    <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition bg-slate-50 focus:bg-white appearance-none">
                                        <option value="">Any Available Doctor</option>
                                        {doctors.map((doc: any) => <option key={doc.id} value={doc.id}>{doc.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2 flex flex-row items-center"><Calendar className="w-4 h-4 mr-2 text-slate-400" /> Preferred Date *</label>
                                    <input type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition bg-slate-50 focus:bg-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2 flex flex-row items-center"><Clock className="w-4 h-4 mr-2 text-slate-400" /> Preferred Time</label>
                                    <select value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition bg-slate-50 focus:bg-white appearance-none">
                                        <option value="">Select Time Slot</option>
                                        <option value="morning">Morning (9AM - 12PM)</option>
                                        <option value="afternoon">Afternoon (1PM - 4PM)</option>
                                        <option value="evening">Evening (5PM - 8PM)</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-2 flex flex-row items-center"><MessageSquare className="w-4 h-4 mr-2 text-slate-400" /> Additional Notes</label>
                                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition bg-slate-50 focus:bg-white resize-none" placeholder="Briefly describe your symptoms or reason for visit..."></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button disabled={isSubmitting} type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-8 rounded-xl transition-all hover:-translate-y-1 shadow-xl shadow-primary-500/30 text-lg flex justify-center items-center disabled:opacity-75 disabled:hover:translate-y-0 disabled:cursor-not-allowed">
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
