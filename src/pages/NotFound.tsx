import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

export default function NotFound() {
  return (
    <PageTransition>
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          {/* Animated 404 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6"
          >
            <h1 className="text-[8rem] sm:text-[10rem] font-bold font-display text-gradient leading-none select-none">
              404
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-display mb-3">
              Page Not <span className="text-gradient">Found</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-sm mx-auto mb-10">
              Oops! The page you're looking for doesn't exist or has been moved.
              Let's get you back on track.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              to="/"
              className="btn-primary"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn-ghost"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
            <Link
              to="/projects"
              className="btn-ghost"
            >
              <Search className="w-4 h-4" />
              Browse Projects
            </Link>
          </motion.div>

          {/* Decorative elements */}
          <div className="absolute top-1/4 left-10 w-48 h-48 bg-primary/8 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-10 w-56 h-56 bg-purple-500/6 rounded-full blur-[100px] pointer-events-none" />
        </div>
      </section>
    </PageTransition>
  );
}
