import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
    return (
        <div className="bg-slate-50 min-h-screen py-16">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-primary-600 font-semibold tracking-wide uppercase text-sm mb-2">Get in Touch</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Contact Us</h3>
                    <p className="text-slate-600">Have questions about our services or need assistance? Reach out to our dedicated support team today.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
                    {/* Contact Information */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start space-x-4">
                            <div className="bg-primary-50 p-3 rounded-lg text-primary-600">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-1">Call Us</h4>
                                <p className="text-slate-600 text-sm mb-1">+1 (234) 567-8900</p>
                                <p className="text-slate-600 text-sm">+1 (987) 654-3210</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start space-x-4">
                            <div className="bg-primary-50 p-3 rounded-lg text-primary-600">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-1">Email Us</h4>
                                <p className="text-slate-600 text-sm mb-1">contact@medicare.com</p>
                                <p className="text-slate-600 text-sm">support@medicare.com</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start space-x-4">
                            <div className="bg-primary-50 p-3 rounded-lg text-primary-600">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-1">Location</h4>
                                <p className="text-slate-600 text-sm">123 Health Avenue<br />Medical City, MC 10012<br />United States</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <form className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                                    <input type="text" id="name" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                                    <input type="email" id="email" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition" placeholder="john@example.com" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                                <input type="text" id="subject" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition" placeholder="How can we help?" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                                <textarea id="message" rows={5} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none" placeholder="Your message here..."></textarea>
                            </div>
                            <button type="button" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-primary-500/30">
                                <Send className="w-5 h-5" />
                                <span>Send Message</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
