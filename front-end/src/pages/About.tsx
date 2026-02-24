import { Star, Award, Shield, HeartPulse } from 'lucide-react';

const About = () => {
    return (
        <div className="bg-white">
            {/* Header Banner */}
            <div className="bg-slate-900 text-white py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Hospital Building" className="w-full h-full object-cover" />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">About MediCare</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">A legacy of excellence in healthcare spanning over three decades.</p>
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <img src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Medical Team" className="rounded-3xl shadow-2xl" />
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-primary-600 font-semibold tracking-wide uppercase text-sm">Our Story</h2>
                            <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Setting the Standard in Modern Healthcare</h3>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                Founded in 1990, MediCare has grown from a humble clinic into a premier multi-specialty hospital. We believe that access to high-quality healthcare is a fundamental human right.
                            </p>
                            <p className="text-slate-600 leading-relaxed">
                                Our state-of-the-art facilities, combined with our compassionate approach to patient care, ensure that you receive the best possible treatment. We continually invest in advanced medical technology and attract the brightest medical minds to serve our community.
                            </p>

                            <div className="pt-6 grid grid-cols-2 gap-6">
                                <div className="flex items-start">
                                    <div className="bg-primary-50 p-2 rounded-lg mr-4">
                                        <HeartPulse className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Patient First</h4>
                                        <p className="text-sm text-slate-500">Your health is our sole priority.</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-primary-50 p-2 rounded-lg mr-4">
                                        <Award className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Excellence</h4>
                                        <p className="text-sm text-slate-500">Award-winning medical care.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Core Values */}
            <div className="bg-slate-50 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12">Our Core Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Shield className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Integrity</h3>
                            <p className="text-slate-600 text-sm">We uphold the highest ethical standards, ensuring honesty and transparency in all our patient interactions.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <HeartPulse className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Compassion</h3>
                            <p className="text-slate-600 text-sm">We treat every patient with empathy, kindness, and respect, understanding their unique emotional and physical needs.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Star className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Innovation</h3>
                            <p className="text-slate-600 text-sm">We continuously embrace new scientific breakthroughs and modern medical technologies to improve patient outcomes.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
