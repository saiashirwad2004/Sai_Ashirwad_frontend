import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, Github, Linkedin, Twitter, Instagram, Youtube, Globe, Sparkles, MessageSquare } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import FadeIn from '@/components/animations/FadeIn';
import StaggerContainer, { StaggerItem } from '@/components/animations/StaggerContainer';
import { publicApi } from '@/services/api';

interface SiteData {
  email: string; phone: string; location: string;
  socialLinks: { github: string; linkedin: string; twitter: string; instagram: string; youtube: string; website: string };
}

const socialIcons: Record<string, typeof Github> = { github: Github, linkedin: Linkedin, twitter: Twitter, instagram: Instagram, youtube: Youtube, website: Globe };

export default function Contact() {
  const [site, setSite] = useState<SiteData | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    publicApi.getSite().then(r => setSite(r.data as unknown as SiteData)).catch(() => { });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); setError('');
    try {
      await publicApi.submitContact(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: site?.email || 'anand@anandverse.com', href: `mailto:${site?.email || ''}` },
    { icon: Phone, label: 'Phone', value: site?.phone || '', href: `tel:${site?.phone || ''}` },
    { icon: MapPin, label: 'Location', value: site?.location || '', href: '#' },
  ].filter(c => c.value);

  const socialLinks = Object.entries(site?.socialLinks || {})
    .filter(([, url]) => url)
    .map(([key, url]) => ({ id: key, icon: socialIcons[key] || Globe, label: key.charAt(0).toUpperCase() + key.slice(1), href: url }));

  return (
    <PageTransition>
      <section className="pt-24 pb-12 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] -z-10 animate-pulse pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-bold text-primary tracking-wide uppercase">Let's Connect</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight">
              Get In <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
              Have a visionary project in mind, a question about my work, or just want to say hello? I'd love to hear from you.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">

            {/* Left Column: Info & Socials */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <FadeIn direction="left" className="h-full flex flex-col">
                <div className="bg-card border border-border/50 rounded-[1.5rem] p-6 sm:p-8 shadow-xl flex-1 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

                  <h2 className="text-2xl font-bold font-display mb-6">Contact Information</h2>

                  <StaggerContainer className="space-y-4 mb-8 relative z-10">
                    {contactInfo.map((item, i) => (
                      <StaggerItem key={i}>
                        <a href={item.href} className="group flex items-start gap-4 p-4 rounded-xl border border-transparent hover:border-border hover:bg-muted/50 transition-all duration-300">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                            <item.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                          </div>
                          <div className="pt-0.5">
                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{item.label}</p>
                            <p className="font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors pr-2">{item.value}</p>
                          </div>
                        </a>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>

                  {socialLinks.length > 0 && (
                    <div className="pt-8 border-t border-border/50 relative z-10">
                      <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-4">Stay Connected</h3>
                      <div className="flex flex-wrap gap-3">
                        {socialLinks.map((social) => (
                          <motion.a key={social.id} href={social.href} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.1, translateY: -4 }} whileTap={{ scale: 0.95 }}
                            className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/30 transition-all duration-300" title={social.label}>
                            <social.icon className="w-5 h-5" />
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </FadeIn>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <FadeIn direction="right">
                <div className="p-6 sm:p-8 rounded-[1.5rem] bg-card border border-border/50 shadow-xl relative overflow-hidden h-full flex flex-col justify-center">
                  <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[60px] pointer-events-none" />

                  <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white shadow-lg shadow-primary/20">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold font-display">Send a Message</h2>
                  </div>

                  {submitted ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 relative z-10">
                      <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                        <Send className="w-8 h-8 text-green-500 translate-x-1" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3">Message Sent!</h3>
                      <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">Thank you for reaching out. Your message has been received, and I'll get back to you securely.</p>
                      <button onClick={() => setSubmitted(false)} className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 active:scale-95">Send Another Message</button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                      {error && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-destructive" /> {error}
                        </motion.div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label htmlFor="name" className="text-xs font-bold text-foreground">Your Name <span className="text-primary">*</span></label>
                          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl text-sm bg-background border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium placeholder:text-muted-foreground/50 shadow-inner" placeholder="John Doe" />
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="email" className="text-xs font-bold text-foreground">Your Email <span className="text-primary">*</span></label>
                          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl text-sm bg-background border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium placeholder:text-muted-foreground/50 shadow-inner" placeholder="john@example.com" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="subject" className="text-xs font-bold text-foreground">Subject <span className="text-primary">*</span></label>
                        <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl text-sm bg-background border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium placeholder:text-muted-foreground/50 shadow-inner" placeholder="What's this regarding?" />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="message" className="text-xs font-bold text-foreground">Message <span className="text-primary">*</span></label>
                        <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={5} className="w-full px-4 py-3 rounded-xl text-sm bg-background border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium placeholder:text-muted-foreground/50 shadow-inner resize-none" placeholder="Tell me about your project, idea, or inquiry..." />
                      </div>

                      <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-3 px-6 py-4 mt-2 bg-foreground text-background rounded-xl font-bold text-sm hover:shadow-2xl hover:shadow-foreground/20 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] group">
                        {isSubmitting ? (
                          <><div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />Sending securely...</>
                        ) : (
                          <>Send Message <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </FadeIn>
            </div>

          </div>
        </div>
      </section>

      <section className="py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black font-display mb-4 tracking-tight">Frequently Asked <span className="text-gradient">Questions</span></h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">Answers to some common questions about my process and availability.</p>
          </FadeIn>

          <StaggerContainer className="grid gap-4">
            {[
              { q: 'What is your typical project timeline?', a: 'Project timelines vary depending on scope. A simple website might take 2-4 weeks, while a complex application could take 2-3 months.' },
              { q: 'Do you work with clients remotely?', a: 'Yes! I work with clients worldwide using Slack, Zoom, and remote collaboration tools for smooth communication.' },
              { q: 'What technologies do you specialize in?', a: 'I specialize in React, Node.js, TypeScript, and modern scalable web technologies. I also have deep expertise with cloud providers like AWS.' },
              { q: 'How do you handle project payments?', a: 'I typically work with a 50% upfront deposit to secure the project, and 50% upon successful completion. For larger projects, we arrange milestone-based delivery and payments.' },
            ].map((faq, i) => (
              <StaggerItem key={i}>
                <div className="p-6 sm:p-8 rounded-[1.5rem] bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md">
                  <h3 className="text-lg font-bold mb-2 flex items-start gap-3 text-foreground">
                    <span className="text-primary mt-0.5 text-xl leading-none">Q.</span> {faq.q}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed ml-7">
                    {faq.a}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </PageTransition>
  );
}
