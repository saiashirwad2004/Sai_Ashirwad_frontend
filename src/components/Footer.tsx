import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Instagram, Heart, ArrowUpRight, Sparkles, Youtube, Globe } from 'lucide-react';
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

  const contactEmail = site?.email || 'anand@anandverse.space';
  const contactLocation = site?.location || 'San Francisco, CA';

  return (
    <footer className="relative border-t border-border bg-card/50 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Brand Info */}
          <div className="lg:col-span-5">
            <Link to="/" className="inline-flex items-center gap-2 mb-5 group">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <span className="text-xl md:text-2xl font-black font-display tracking-tight hover:text-primary transition-colors duration-300">
                AnandVerse<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed max-w-sm">
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
                    whileHover={{ y: -4, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-xl bg-background border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
                    title={social.label as string}
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-[13px] font-bold uppercase tracking-wider text-foreground mb-5">Navigation</h3>
            <nav aria-label="Footer Quick Links">
              <ul className="space-y-4">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-muted-foreground hover:text-primary font-medium transition-colors inline-flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Legal Links */}
          <div className="lg:col-span-2">
            <h3 className="text-[13px] font-bold uppercase tracking-wider text-foreground mb-5">Legal</h3>
            <nav aria-label="Footer Legal Links">
              <ul className="space-y-4">
                {legalLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-muted-foreground hover:text-primary font-medium transition-colors inline-flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="text-[13px] font-bold uppercase tracking-wider text-foreground mb-5">Contact</h3>
            <div className="space-y-3 p-5 rounded-2xl bg-background border border-border/50 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-colors pointer-events-none" />
              <div className="relative z-10">
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-foreground hover:text-primary font-bold text-base inline-flex items-center gap-2 transition-colors mb-2 block truncate"
                >
                  {contactEmail}
                  <ArrowUpRight className="w-3.5 h-3.5 text-primary" />
                </a>
                <p className="text-muted-foreground font-medium text-xs">{contactLocation}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground font-medium text-xs text-center sm:text-left">
            © {new Date().getFullYear()} AnandVerse. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background border border-border/50 text-xs font-semibold text-foreground">
            Crafted with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" /> by Anand
          </div>
        </div>
      </div>
    </footer>
  );
}
