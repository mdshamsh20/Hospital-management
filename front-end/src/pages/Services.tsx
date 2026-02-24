import { HeartPulse, Stethoscope, Eye, Droplet, Brain, Activity } from 'lucide-react';

const Services = () => {
    const servicesList = [
        {
            icon: <Activity className="w-8 h-8" />,
            title: 'General Treatment',
            description: 'Expert care and comprehensive treatment plans to ensure your well-being.',
            bg: 'bg-blue-50 text-blue-600'
        },
        {
            icon: <Stethoscope className="w-8 h-8" />,
            title: 'Teeth Whitening',
            description: 'Brighten your smile with our advanced teeth whitening services.',
            bg: 'bg-emerald-50 text-emerald-600'
        },
        {
            icon: <HeartPulse className="w-8 h-8" />,
            title: 'Heart Surgery',
            description: 'Advanced heart surgery techniques for a healthier heart.',
            bg: 'bg-red-50 text-red-600'
        },
        {
            icon: <Brain className="w-8 h-8" />,
            title: 'Ear Treatment',
            description: 'Effective treatments for various ear conditions and hearing issues.',
            bg: 'bg-purple-50 text-purple-600'
        },
        {
            icon: <Eye className="w-8 h-8" />,
            title: 'Vision Problems',
            description: 'Comprehensive eye care to address and correct vision problems.',
            bg: 'bg-amber-50 text-amber-600'
        },
        {
            icon: <Droplet className="w-8 h-8" />,
            title: 'Blood Transfusion',
            description: 'Safe and efficient blood transfusion services for your health needs.',
            bg: 'bg-rose-50 text-rose-600'
        }
    ];

    return (
        <div className="bg-slate-50 min-h-screen py-20 font-sans">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-primary-600 font-semibold tracking-wide uppercase text-sm mb-2">Our Departments</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Medical Services</h3>
                    <p className="text-slate-600">We provide a wide range of specialized medical services using the latest technology and top-tier medical experts.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {servicesList.map((service, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1 group">
                            <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center mb-6 transition-transform group-hover:scale-110 ${service.bg}`}>
                                {service.icon}
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h4>
                            <p className="text-slate-600 mb-6 line-clamp-3">{service.description}</p>
                            <a href="#" className="inline-flex items-center font-medium text-primary-600 hover:text-primary-700 transition">
                                Learn More <span className="ml-1 text-lg leading-none group-hover:translate-x-1 transition-transform">→</span>
                            </a>
                        </div>
                    ))}
                </div>

                {/* Call to action section missing from home */}
                <div className="mt-24 bg-primary-600 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="p-12 lg:p-16 flex flex-col justify-center">
                            <h3 className="text-3xl font-bold text-white mb-4">Do you need Emergency Medical Care?</h3>
                            <p className="text-primary-100 mb-8 max-w-md">Our emergency department is open 24/7 with specialized doctors ready to handle any critical medical situation.</p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a href="/contact" className="bg-white text-primary-700 font-bold py-3 px-8 rounded-full text-center hover:bg-slate-50 transition shadow-lg">
                                    Contact Us Now
                                </a>
                                <a href="#" className="border border-primary-400 text-white font-bold py-3 px-8 rounded-full text-center hover:bg-primary-700 transition">
                                    Learn More
                                </a>
                            </div>
                        </div>
                        <div className="hidden lg:block relative">
                            <img src="https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Emergency Care" className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-primary-900/40 mix-blend-multiply"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Services;
