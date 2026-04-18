import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Projects', path: '/projects' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? 'bg-background/70 backdrop-blur-2xl border-b border-border/30 shadow-lg shadow-background/50'
          : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-16 md:h-20" aria-label="Main Navigation">
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-2 group">
              <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>" alt="Sai Ashirwad Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain group-hover:scale-105 group-hover:-rotate-3 transition-all duration-300 rounded-xl" />
              <span className="text-xl md:text-2xl font-black font-display tracking-tight hover:text-primary transition-colors duration-300">
                Sai Ashirwad<span className="text-primary">.</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="relative px-4 py-2 group block"
                    >
                      <span
                        className={`text-sm font-medium transition-colors duration-300 ${isActive
                          ? 'text-foreground'
                          : 'text-muted-foreground group-hover:text-foreground'
                          }`}
                      >
                        {item.label}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <motion.div
                        className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 -z-10 transition-opacity duration-300"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-background/95 backdrop-blur-xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="absolute top-20 left-4 right-4 glass-card p-6"
            >
              <nav aria-label="Mobile Navigation">
                <ul className="flex flex-col gap-2 list-none p-0 m-0">
                  {navItems.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <motion.li
                        key={item.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 + 0.1 }}
                      >
                        <Link
                          to={item.path}
                          className={`flex items-center px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300 ${isActive
                            ? 'bg-primary/10 text-foreground'
                            : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                            }`}
                        >
                          {item.label}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
