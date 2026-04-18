import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Instagram, Heart, ArrowUpRight, Youtube, Globe } from 'lucide-react';
import { publicApi } from '@/services/api';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Projects', path: '/projects' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
];

const legalLinks = [
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Terms of Service', path: '/terms-of-service' },
];

const socialIcons: Record<string, any> = { github: Github, linkedin: Linkedin, twitter: Twitter, instagram: Instagram, youtube: Youtube, website: Globe };

export default function Footer() {
  const [site, setSite] = useState<any>(null);

  useEffect(() => {
    publicApi.getSite().then(r => setSite(r.data)).catch(() => { });
  }, []);

  const activeSocialLinks = Object.entries(site?.socialLinks || {})
    .filter(([, url]) => url)
    .map(([key, url]) => ({
      id: key,
      icon: socialIcons[key] || Globe,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      href: url
    }));

  const contactEmail = site?.email;

  return (
    <footer className="relative mt-24 border-t border-border/40 bg-card/40 backdrop-blur-2xl overflow-hidden">
      {/* Subtle Top Glow */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 lg:col-start-1">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/80 to-purple-600/80 p-[1px] group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-background/90 rounded-[11px] flex items-center justify-center overflow-hidden">
                  <img src="/logo.png" alt="Sai Ashirwad" className="w-6 h-6 object-contain" />
                </div>
              </div>
              <span className="text-xl font-bold font-display tracking-tight hover:text-primary transition-colors duration-300">
                Sai Ashirwad<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-8 leading-relaxed max-w-sm">
              Crafting premium and scalable web experiences. Turning imaginative concepts into functional reality.
            </p>
            
            {activeSocialLinks.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {activeSocialLinks.map((social: any) => (
                  <motion.a
                    key={social.id}
                    href={social.href as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, translateY: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-xl bg-card border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                    title={social.label as string}
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/80 mb-6">Navigation</h3>
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-primary font-medium transition-colors inline-flex items-center group"
                  >
                    <span className="w-0 overflow-hidden group-hover:w-3 tracking-tighter transition-all duration-300 text-primary opacity-0 group-hover:opacity-100">- </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="lg:col-span-2 lg:col-start-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/80 mb-6">Legal</h3>
            <ul className="space-y-4">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-primary font-medium transition-colors inline-flex items-center group"
                  >
                    <span className="w-0 overflow-hidden group-hover:w-3 tracking-tighter transition-all duration-300 text-primary opacity-0 group-hover:opacity-100">- </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="lg:col-span-3 lg:col-start-10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/80 mb-6">Contact</h3>
            {contactEmail ? (
              <div className="space-y-2 group">
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-foreground hover:text-primary font-bold text-sm inline-flex items-center gap-2 transition-colors mb-1 truncate block"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <span className="truncate">{contactEmail}</span>
                </a>
              </div>
            ) : (
                <p className="text-sm text-muted-foreground">Get in touch via the contact page.</p>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-muted-foreground font-medium text-xs text-center sm:text-left">
            © {new Date().getFullYear()} Sai Ashirwad. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-card px-4 py-2 rounded-full border border-border/50">
            Crafted with 
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            </motion.div>
            by <span className="text-foreground font-bold">Sai Ashirwad</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
