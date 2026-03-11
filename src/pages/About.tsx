import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Mail, MapPin, Calendar, Briefcase, GraduationCap, Award, Users } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import FadeIn from '@/components/animations/FadeIn';
import StaggerContainer, { StaggerItem } from '@/components/animations/StaggerContainer';
import { publicApi } from '@/services/api';
import { useSEO } from '@/hooks/useSEO';

interface SiteData {
  ownerName: string; ownerTitle: string; ownerBio: string; aboutDescription: string;
  email: string; location: string; resumeUrl: string;
  aboutImage: { url: string };
  stats: { number: string; label: string }[];
}
interface Skill { _id: string; name: string; level: number; category: string; }
interface Experience { _id: string; title: string; organization: string; period: string; description: string; type: string; current: boolean; }

const catColors: Record<string, string> = {
  frontend: 'from-blue-500 to-purple-500',
  backend: 'from-green-500 to-emerald-500',
  database: 'from-yellow-500 to-orange-500',
  tools: 'from-pink-500 to-rose-500',
  other: 'from-gray-500 to-slate-500',
};
const catDots: Record<string, string> = { frontend: 'bg-blue-500', backend: 'bg-green-500', database: 'bg-yellow-500', tools: 'bg-pink-500', other: 'bg-gray-500' };
const catLabels: Record<string, string> = { frontend: 'Frontend Development', backend: 'Backend Development', database: 'Database & Storage', tools: 'Tools & DevOps', other: 'Other' };

export default function About() {
  const [site, setSite] = useState<SiteData | null>(null);
  const [skills, setSkills] = useState<Record<string, Skill[]>>({});
  const [workExp, setWorkExp] = useState<Experience[]>([]);
  const [eduExp, setEduExp] = useState<Experience[]>([]);
  const [certExp, setCertExp] = useState<Experience[]>([]);
  const [mentorExp, setMentorExp] = useState<Experience[]>([]);

  useEffect(() => {
    publicApi.getSite().then(r => setSite(r.data as unknown as SiteData)).catch(() => { });
    publicApi.getSkills().then(r => {
      const all = (r.data || []) as unknown as Skill[];
      const grouped: Record<string, Skill[]> = {};
      all.forEach(s => { if (!grouped[s.category]) grouped[s.category] = []; grouped[s.category].push(s); });
      setSkills(grouped);
    }).catch(() => { });
    publicApi.getExperience('work').then(r => setWorkExp((r.data || []) as unknown as Experience[])).catch(() => { });
    publicApi.getExperience('education').then(r => setEduExp((r.data || []) as unknown as Experience[])).catch(() => { });
    publicApi.getExperience('certification').then(r => setCertExp((r.data || []) as unknown as Experience[])).catch(() => { });
    publicApi.getExperience('mentorship').then(r => setMentorExp((r.data || []) as unknown as Experience[])).catch(() => { });
  }, []);

  useSEO({
    title: 'About Me',
    description: 'Learn more about Anand, a Full Stack Developer specializing in React, Node.js, and modern web architectures.',
    url: 'https://anandverse.space/about'
  });

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="pt-24 pb-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <FadeIn direction="left">
              <div className="relative max-w-sm mx-auto lg:mx-0">
                <div className="aspect-square rounded-[2rem] overflow-hidden bg-primary/5">
                  {site?.aboutImage?.url ? <img src={site.aboutImage.url} alt={site.ownerName} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-5xl">👨‍💻</div>}
                </div>
                <div className="absolute -top-3 -right-3 w-20 h-20 bg-primary/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-3 -left-3 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl" />
              </div>
            </FadeIn>

            <div>
              <FadeIn delay={0.1}>
                <span className="text-primary text-sm font-bold tracking-wide uppercase mb-3 block">About Me</span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display mb-4 tracking-tight">
                  {site?.ownerTitle?.split(' ').slice(0, 2).join(' ') || 'Full Stack'}{' '}
                  <span className="text-gradient">{site?.ownerTitle?.split(' ').slice(2).join(' ') || 'Developer'}</span>
                </h1>
              </FadeIn>

              <FadeIn delay={0.2}>
                <p className="text-muted-foreground text-base mb-4 leading-relaxed">{site?.ownerBio || ''}</p>
              </FadeIn>

              <FadeIn delay={0.3}>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{site?.aboutDescription || ''}</p>
              </FadeIn>

              <FadeIn delay={0.4}>
                <div className="flex flex-wrap gap-4 mb-6">
                  {site?.location && <div className="flex items-center gap-1.5 text-sm text-foreground font-medium"><MapPin className="w-4 h-4 text-primary" /><span>{site.location}</span></div>}
                  {(site?.stats || []).slice(0, 2).map((s, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-sm text-foreground font-medium"><Calendar className="w-4 h-4 text-primary" /><span>{s.number} {s.label}</span></div>
                  ))}
                </div>
              </FadeIn>

              <FadeIn delay={0.5}>
                <div className="flex flex-wrap gap-3">
                  {site?.resumeUrl && (
                    <a href={site.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                      <Download className="w-4 h-4" /> Download Resume
                    </a>
                  )}
                  {site?.email && (
                    <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 px-5 py-2.5 border border-border rounded-xl text-sm font-bold hover:bg-muted text-foreground transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                      <Mail className="w-4 h-4 text-muted-foreground" /> Contact Me
                    </a>
                  )}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      {Object.keys(skills).length > 0 && (
        <section className="py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-display mb-3 tracking-tight">My <span className="text-gradient">Skills</span></h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">Technologies and tools I use to bring ideas to life.</p>
            </FadeIn>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(skills).map(([cat, items]) => (
                <StaggerItem key={cat}>
                  <div className="p-5 rounded-[1.5rem] bg-card/40 backdrop-blur-xl shadow-xl border border-border/50 h-full shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-bold mb-5 flex items-center gap-2 capitalize">
                      <span className={`w-2.5 h-2.5 rounded-full ${catDots[cat] || 'bg-gray-500'}`} />
                      {catLabels[cat] || cat}
                    </h3>
                    <div className="space-y-4">
                      {items.map((skill) => (
                        <div key={skill._id}>
                          <div className="flex justify-between mb-1.5">
                            <span className="text-xs font-semibold text-foreground">{skill.name}</span>
                            <span className="text-xs text-primary font-black">{skill.level}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }} viewport={{ once: true }}
                              transition={{ duration: 1, ease: 'easeOut' }} className={`h-full bg-gradient-to-r ${catColors[cat] || 'from-gray-500 to-slate-500'} rounded-full`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* Experience Section */}
      {(workExp.length > 0 || eduExp.length > 0 || certExp.length > 0 || mentorExp.length > 0) && (
        <section className="py-16 relative bg-muted/20 border-y border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-display mb-3 tracking-tight">Journey & <span className="text-gradient">Experience</span></h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">My professional journey, academic background, certifications and mentorship.</p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {workExp.length > 0 && (
                <FadeIn direction="left">
                  <div>
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2.5"><Briefcase className="w-5 h-5 text-primary" /> Work Experience</h3>
                    <div className="space-y-6">
                      {workExp.map((job, i) => (
                        <motion.div key={job._id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                          className="relative pl-6 border-l-2 border-border/50 hover:border-primary transition-colors duration-300">
                          <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                          <h4 className="text-base font-bold text-foreground">{job.title}</h4>
                          <p className="text-primary text-sm font-semibold mt-0.5">{job.organization}</p>
                          <p className="text-xs text-muted-foreground font-medium mb-2">{job.period} {job.current && <span className="ml-2 text-[10px] px-2 py-0.5 rounded-md bg-green-500/15 text-green-600 font-bold uppercase tracking-wider">Current</span>}</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              )}

              {eduExp.length > 0 && (
                <FadeIn direction="right">
                  <div>
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2.5"><GraduationCap className="w-5 h-5 text-primary" /> Education</h3>
                    <div className="space-y-6">
                      {eduExp.map((edu, i) => (
                        <motion.div key={edu._id} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                          className="relative pl-6 border-l-2 border-border/50 hover:border-primary transition-colors duration-300">
                          <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                          <h4 className="text-base font-bold text-foreground">{edu.title}</h4>
                          <p className="text-primary text-sm font-semibold mt-0.5">{edu.organization}</p>
                          <p className="text-xs text-muted-foreground font-medium mb-2">{edu.period}</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">{edu.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              )}

              {certExp.length > 0 && (
                <FadeIn direction="left">
                  <div>
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2.5"><Award className="w-5 h-5 text-primary" /> Certifications</h3>
                    <div className="space-y-6">
                      {certExp.map((cert, i) => (
                        <motion.div key={cert._id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                          className="relative pl-6 border-l-2 border-border/50 hover:border-primary transition-colors duration-300">
                          <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                          <h4 className="text-base font-bold text-foreground">{cert.title}</h4>
                          <p className="text-primary text-sm font-semibold mt-0.5">{cert.organization}</p>
                          <p className="text-xs text-muted-foreground font-medium mb-2">{cert.period}</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">{cert.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              )}

              {mentorExp.length > 0 && (
                <FadeIn direction="right">
                  <div>
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2.5"><Users className="w-5 h-5 text-primary" /> Mentorship</h3>
                    <div className="space-y-6">
                      {mentorExp.map((mentor, i) => (
                        <motion.div key={mentor._id} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                          className="relative pl-6 border-l-2 border-border/50 hover:border-primary transition-colors duration-300">
                          <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                          <h4 className="text-base font-bold text-foreground">{mentor.title}</h4>
                          <p className="text-primary text-sm font-semibold mt-0.5">{mentor.organization}</p>
                          <p className="text-xs text-muted-foreground font-medium mb-2">{mentor.period}</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">{mentor.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      {(site?.stats || []).length > 0 && (
        <section className="py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {site!.stats.map((stat, i) => (
                <StaggerItem key={i}>
                  <div className="text-center p-5 rounded-[1.5rem] bg-card/40 backdrop-blur-xl shadow-xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                    <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1, type: 'spring' }}
                      className="text-3xl md:text-4xl font-black font-display text-gradient mb-1">{stat.number}</motion.div>
                    <p className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}
    </PageTransition>
  );
}
