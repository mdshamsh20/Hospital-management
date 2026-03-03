import { ArrowRight, Activity, Users, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative bg-slate-50 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary-100 opacity-50 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-100 opacity-50 blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full text-sm font-medium border border-primary-100 mb-4 animate-fade-in-up">
                                <span className="flex h-2 w-2 rounded-full bg-primary-500"></span>
                                <span>Providing Top-Tier Healthcare</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
                                Comprehensive <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500">
                                    Healthcare Solutions
                                </span>
                            </h1>

                            <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                                Experience the best in medical care, tailored to meet your individual needs. We are committed to your well-being.
                            </p>

                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                                <Link to="/book" className="flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white px-8 py-3.5 rounded-full font-medium transition shadow-lg shadow-primary-500/30">
                                    Book Appointment <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                                <Link to="/about" className="flex items-center justify-center bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-8 py-3.5 rounded-full font-medium transition">
                                    Learn More
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-slate-200">
                                <div>
                                    <h4 className="text-3xl font-semibold text-slate-900">3468</h4>
                                    <p className="text-sm text-slate-500 mt-1">Hospital Rooms</p>
                                </div>
                                <div>
                                    <h4 className="text-3xl font-semibold text-slate-900">557</h4>
                                    <p className="text-sm text-slate-500 mt-1">Specialists</p>
                                </div>
                                <div>
                                    <h4 className="text-3xl font-semibold text-slate-900">4379</h4>
                                    <p className="text-sm text-slate-500 mt-1">Happy Patients</p>
                                </div>
                                <div>
                                    <h4 className="text-3xl font-semibold text-slate-900">32</h4>
                                    <p className="text-sm text-slate-500 mt-1">Years Experience</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative hidden md:block">
                            <div className="aspect-[4/5] bg-slate-200 rounded-3xl overflow-hidden shadow-2xl relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/40 to-transparent z-10"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                    alt="Team of Doctors"
                                    className="object-cover w-full h-full"
                                />

                                <div className="absolute bottom-8 left-8 bg-white p-4 rounded-xl shadow-xl z-20 flex items-center space-x-4 animate-bounce-slow">
                                    <div className="bg-green-100 p-2 rounded-full hidden sm:block">
                                        <ShieldCheck className="w-8 h-8 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">Certified Experts</p>
                                        <p className="text-xs text-slate-500">World-class Professionals</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-primary-600 font-medium tracking-wide text-sm mb-2">Why Choose Our Services?</h2>
                        <h3 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Why Our Patients Trust Us</h3>
                        <p className="text-slate-600">We are committed to delivering exceptional care with a personalized approach to each patient’s needs. Our team of dedicated professionals ensures the highest quality of care and the latest in medical advancements.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <div key={idx} className="bg-slate-50 p-8 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100">
                                <div className="bg-white w-14 h-14 rounded-xl shadow-sm flex items-center justify-center mb-6 text-primary-600">
                                    {feature.icon}
                                </div>
                                <h4 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h4>
                                <p className="text-slate-600 leading-relaxed text-sm">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

const features = [
    {
        icon: <Activity className="w-6 h-6" />,
        title: 'Emergency Help',
        desc: 'Immediate assistance for urgent medical situations to ensure fast and effective care.',
    },
    {
        icon: <ShieldCheck className="w-6 h-6" />,
        title: 'Enriched Pharmacy',
        desc: 'Comprehensive pharmacy services with a wide range of medications and health products.',
    },
    {
        icon: <Users className="w-6 h-6" />,
        title: 'Medical Treatment',
        desc: 'Professional medical treatment provided by experienced healthcare professionals.',
    }
];

export default Home;
