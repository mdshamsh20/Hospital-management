import { Activity, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="bg-primary-600 p-2 rounded-lg text-white inline-block">
                                <Activity className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold text-white tracking-tight">MediCare<span className="text-primary-500">.</span></span>
                        </Link>
                        <p className="text-sm leading-relaxed text-slate-400 mt-4">
                            Providing world-class healthcare services with state-of-the-art facilities and expert medical professionals dedicated to your well-being.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 transition text-white"><Facebook className="w-4 h-4" /></a>
                            <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 transition text-white"><Twitter className="w-4 h-4" /></a>
                            <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 transition text-white"><Instagram className="w-4 h-4" /></a>
                            <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 transition text-white"><Linkedin className="w-4 h-4" /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            {['About Us', 'Services', 'Find a Doctor', 'Book Appointment', 'Contact Us'].map((link) => (
                                <li key={link}>
                                    <Link to="#" className="hover:text-primary-500 transition-colors flex items-center text-sm">
                                        <span className="mr-2 text-primary-500">›</span> {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Departments */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-6">Departments</h3>
                        <ul className="space-y-3">
                            {['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dental Care'].map((dept) => (
                                <li key={dept}>
                                    <Link to="#" className="hover:text-primary-500 transition-colors flex items-center text-sm">
                                        <span className="mr-2 text-primary-500">›</span> {dept}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact info */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-6">Contact Info</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <MapPin className="w-5 h-5 text-primary-500 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-sm text-slate-400">123 Health Avenue<br />Medical City, MC 10012<br />United States</span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0" />
                                <span className="text-sm text-slate-400">+1 (234) 567-8900</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0" />
                                <span className="text-sm text-slate-400">contact@medicare.com</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} MediCare Hospital. All rights reserved.</p>
                    <div className="space-x-4 mt-4 md:mt-0">
                        <Link to="#" className="hover:text-white transition">Privacy Policy</Link>
                        <Link to="#" className="hover:text-white transition">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
