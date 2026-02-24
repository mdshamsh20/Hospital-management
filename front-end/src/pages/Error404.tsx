import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Error404 = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans p-4">
            <div className="text-center max-w-lg">
                <div className="relative mb-8">
                    <h1 className="text-9xl font-extrabold text-slate-200 tracking-tighter">404</h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-primary-100 text-primary-600 p-4 rounded-full">
                            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Page Not Found</h2>
                <p className="text-slate-600 mb-8">Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-primary-600 hover:bg-primary-700 transition">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Home
                    </Link>
                    <Link to="/contact" className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 text-base font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition">
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Error404;
