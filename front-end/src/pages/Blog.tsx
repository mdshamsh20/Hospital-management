import { ArrowRight, User, Calendar, MessageSquare } from 'lucide-react';

const Blog = () => {
    const blogPosts = [
        {
            title: 'In this hospital there are special surgeon.',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam nec metus et nibh condimentum...',
            date: '22 Aug, 2024',
            author: 'John Doe',
            comments: 5,
            image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            category: 'Medical'
        },
        {
            title: 'Can you get a telemedicine medicare?',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam nec metus et nibh condimentum...',
            date: '15 Jul, 2024',
            author: 'Jane Smith',
            comments: 12,
            image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            category: 'Consultation'
        },
        {
            title: 'Are drugs the best solution for medical issues?',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam nec metus et nibh condimentum...',
            date: '10 Jun, 2024',
            author: 'Robert Fox',
            comments: 8,
            image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            category: 'Pharmacy'
        },
        {
            title: 'Advanced Technology in Modern Surgery',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam nec metus et nibh condimentum...',
            date: '05 May, 2024',
            author: 'Eleanor Pena',
            comments: 24,
            image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            category: 'Surgery'
        },
        {
            title: 'Pediatric Care: What Parents Need to Know',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam nec metus et nibh condimentum...',
            date: '28 Apr, 2024',
            author: 'Albert Flores',
            comments: 15,
            image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            category: 'Pediatrics'
        },
        {
            title: 'Navigating Cardiac Rehabilitation',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam nec metus et nibh condimentum...',
            date: '12 Mar, 2024',
            author: 'Savannah Nguyen',
            comments: 31,
            image: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            category: 'Cardiology'
        }
    ];

    return (
        <div className="bg-slate-50 min-h-screen py-20 font-sans">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-primary-600 font-semibold tracking-wide uppercase text-sm mb-2">Keep up to date</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Latest Medical News</h3>
                    <p className="text-slate-600">Read our latest articles on medical research, healthy living, and hospital updates to stay informed.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {blogPosts.map((post, idx) => (
                        <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col group">
                            <div className="relative h-60 overflow-hidden">
                                <span className="absolute top-4 left-4 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-lg shadow-primary-500/30">
                                    {post.category}
                                </span>
                                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                            </div>
                            <div className="p-6 flex-grow flex flex-col">
                                <div className="flex items-center text-xs text-slate-500 mb-4 space-x-4 border-b border-slate-100 pb-4">
                                    <div className="flex items-center"><Calendar className="w-4 h-4 mr-1 text-primary-500" /> {post.date}</div>
                                    <div className="flex items-center"><User className="w-4 h-4 mr-1 text-primary-500" /> {post.author}</div>
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 mb-3 hover:text-primary-600 transition cursor-pointer line-clamp-2">
                                    {post.title}
                                </h4>
                                <p className="text-slate-600 mb-6 flex-grow line-clamp-3 text-sm">
                                    {post.summary}
                                </p>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    <a href="#" className="inline-flex items-center font-bold text-slate-900 hover:text-primary-600 transition text-sm">
                                        Read More <ArrowRight className="w-4 h-4 ml-1" />
                                    </a>
                                    <span className="flex items-center text-slate-400 text-sm font-medium">
                                        <MessageSquare className="w-4 h-4 mr-1" /> {post.comments}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Placeholder */}
                <div className="flex justify-center mt-16 space-x-2">
                    <button className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold shadow-md shadow-primary-500/20">1</button>
                    <button className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center font-medium transition">2</button>
                    <button className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center font-medium transition">3</button>
                    <button className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center font-medium transition"><ArrowRight className="w-4 h-4" /></button>
                </div>
            </div>
        </div>
    );
};

export default Blog;
