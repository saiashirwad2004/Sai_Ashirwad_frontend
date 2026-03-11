import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Star, X, Send, Loader2, MessageSquareHeart } from 'lucide-react';
import { publicApi } from '@/services/api';
import toast from 'react-hot-toast';

export default function FloatingActions() {
    const [isVisible, setIsVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rating, setRating] = useState(5);
    const [hoveredRating, setHoveredRating] = useState(0);

    const [form, setForm] = useState({
        name: '',
        role: '',
        company: '',
        content: '',
    });

    // Toggle visibility of scroll-to-top based on scroll position
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.content.trim()) {
            toast.error('Please fill in your name and review content.');
            return;
        }

        setIsSubmitting(true);
        try {
            await publicApi.submitTestimonial({
                ...form,
                rating,
            });
            toast.success('Thank you for your valuable feedback!');
            setIsModalOpen(false);
            setForm({ name: '', role: '', company: '', content: '' });
            setRating(5);
        } catch (error: any) {
            toast.error(error.message || 'Failed to submit review. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">
                {/* Review Button */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    whileHover={{ scale: 1.1, rotate: 2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsModalOpen(true)}
                    title="Leave a Review"
                    className="group flex flex-row-reverse items-center justify-center p-3 sm:py-3 sm:px-5 rounded-full bg-gradient-to-r from-purple-600 to-primary text-white shadow-xl hover:shadow-primary/40 border border-primary/20 backdrop-blur-xl transition-all duration-300"
                >
                    <MessageSquareHeart className="w-6 h-6 sm:w-5 sm:h-5 " />
                    <span className="hidden sm:block mr-2 font-bold text-sm tracking-wide">Review</span>
                </motion.button>

                {/* Scroll To Top Button */}
                <AnimatePresence>
                    {isVisible && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={scrollToTop}
                            title="Scroll to Top"
                            className="p-3 sm:p-4 rounded-full bg-card/80 backdrop-blur-md border border-border/50 text-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:text-primary hover:border-primary/50"
                        >
                            <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* Review Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    >
                        <div
                            className="absolute inset-0 bg-background/80 backdrop-blur-md"
                            onClick={() => setIsModalOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                            className="relative w-full max-w-lg bg-card/40 backdrop-blur-xl shadow-xl border border-border shadow-2xl rounded-3xl p-6 sm:p-8"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                                title="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                    <Star className="w-6 h-6 text-primary fill-primary" />
                                </div>
                                <h3 className="text-2xl font-bold font-display mb-2">Leave a Review</h3>
                                <p className="text-muted-foreground text-sm">
                                    I'd love to hear about your experience working with me or using my products!
                                </p>
                            </div>

                            <form onSubmit={handleSubmitReview} className="space-y-4">
                                {/* Rating */}
                                <div className="flex flex-col items-center justify-center p-4 bg-background/40 backdrop-blur-xl shadow-xl rounded-2xl border border-border/50">
                                    <label className="text-sm font-semibold mb-2">How was your experience?</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoveredRating(star)}
                                                onMouseLeave={() => setHoveredRating(0)}
                                                className="p-1 focus:outline-none transform hover:scale-110 transition-transform"
                                            >
                                                <Star
                                                    className={`w-8 h-8 ${star <= (hoveredRating || rating)
                                                        ? 'text-yellow-400 fill-yellow-400'
                                                        : 'text-muted-foreground/30'
                                                        } transition-colors`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            placeholder="John Doe"
                                            className="w-full px-4 py-3 bg-background/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company</label>
                                        <input
                                            type="text"
                                            value={form.company}
                                            onChange={(e) => setForm({ ...form, company: e.target.value })}
                                            placeholder="Acme Corp"
                                            className="w-full px-4 py-3 bg-background/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role / Title</label>
                                    <input
                                        type="text"
                                        value={form.role}
                                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                                        placeholder="E.g. CEO, Developer, Client"
                                        className="w-full px-4 py-3 bg-background/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your Review *</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={form.content}
                                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                                        placeholder="Tell us what you think..."
                                        className="w-full px-4 py-3 bg-background/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || !form.name.trim() || !form.content.trim()}
                                    className="w-full mt-4 flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 disabled:opacity-50 transition-all hover:-translate-y-0.5"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Submit Review
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
