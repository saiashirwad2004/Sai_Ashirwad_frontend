import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, Quote } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import FadeIn from '@/components/animations/FadeIn';
import StaggerContainer, { StaggerItem } from '@/components/animations/StaggerContainer';
import { publicApi } from '@/services/api';
import { useSEO } from '@/hooks/useSEO';

interface SiteData {
  heroHeading: string; heroSubtitle: string; heroDescription: string; siteTagline: string;
  heroCTA: { primary: { text: string; link: string }; secondary: { text: string; link: string } };
  stats: { number: string; label: string }[];
}
interface Project { _id: string; title: string; slug: string; description: string; image: { url: string }; tags: string[]; }
interface BlogPost { _id: string; title: string; slug: string; excerpt: string; image: { url: string }; date: string; readTime: string; createdAt: string; }
interface Service { _id: string; title: string; description: string; icon: string; }
interface Testimonial { _id: string; name: string; role: string; company: string; content: string; rating: number; avatar: { url: string }; }

/* ── Tools / Tech Stack Data ──────────────────────────────── */
const DI = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';
const tools = [
  { name: 'React', desc: 'Building responsive, component-driven user interfaces with state-of-the-art declarative programming.', logo: `${DI}/react/react-original.svg` },
  { name: 'Next.js', desc: 'Empowering high-performance web applications with server-side rendering and static site generation for unmatched speed and SEO.', logo: `${DI}/nextjs/nextjs-original.svg`, invert: true },
  { name: 'TypeScript', desc: 'Adding robust static typing to JavaScript for improved code scalability, reliability, and developer experience.', logo: `${DI}/typescript/typescript-original.svg` },
  { name: 'JavaScript', desc: 'The backbone of dynamic and interactive web experiences, enabling seamless user interactions across modern browsers.', logo: `${DI}/javascript/javascript-original.svg` },
  { name: 'Node.js', desc: 'Executing high-performance server-side logic and building highly scalable network applications using event-driven I/O.', logo: `${DI}/nodejs/nodejs-original.svg` },
  { name: 'Express.js', desc: 'Providing a minimal and flexible routing framework to build robust RESTful APIs and powerful server-side web applications.', logo: `${DI}/express/express-original.svg`, invert: true },
  { name: 'MongoDB', desc: 'Managing complex data structures with a flexible NoSQL database designed for modern application scalability.', logo: `${DI}/mongodb/mongodb-original.svg` },
  { name: 'PostgreSQL', desc: 'Ensuring data integrity and reliability with robust relational database management systems for mission-critical applications.', logo: `${DI}/postgresql/postgresql-original.svg` },
  { name: 'Redis', desc: 'Accelerating data retrieval and optimizing application performance with an advanced in-memory caching and messaging store.', logo: `${DI}/redis/redis-original.svg` },
  { name: 'Tailwind CSS', desc: 'Rapidly styling applications with a utility-first CSS framework, ensuring completely custom, responsive, and maintainable designs.', logo: `${DI}/tailwindcss/tailwindcss-original.svg` },
  { name: 'Git', desc: 'Tracking codebase history and orchestrating distributed development with the industry-standard version control system.', logo: `${DI}/git/git-original.svg` },
  { name: 'GitHub', desc: 'Facilitating seamless collaboration and version control to ensure code integrity and rapid deployment cycles.', logo: `${DI}/github/github-original.svg`, invert: true },
  { name: 'VS Code', desc: 'Accelerating development workflows with a highly extensible code editor featuring smart completion and integrated debugging.', logo: `${DI}/vscode/vscode-original.svg` },
  { name: 'Figma', desc: 'Designing beautiful user interfaces and interactive prototypes with real-time browser-based collaboration.', logo: `${DI}/figma/figma-original.svg` },
  { name: 'Vercel', desc: 'Automating continuous integration and deploying front-end frameworks instantly to an edge-optimized global network.', logo: `${DI}/vercel/vercel-original.svg`, invert: true },
  { name: 'AWS', desc: 'Scaling applications infinitely with the world\'s most comprehensive and broadly adopted cloud computing platform.', logo: `${DI}/amazonwebservices/amazonwebservices-original-wordmark.svg` },
  { name: 'Firebase', desc: 'Accelerating backend development with managed real-time databases, secure authentication, and scalable file storage.', logo: `${DI}/firebase/firebase-original.svg` },
  { name: 'Google Cloud', desc: 'Leveraging cutting-edge cloud infrastructure and powerful data analytics to build secure and scalable modern applications.', logo: `${DI}/googlecloud/googlecloud-original.svg` },
  { name: 'Webpack', desc: 'Bundling JavaScript modules and managing static assets effectively to optimize front-end application loading speeds.', logo: `${DI}/webpack/webpack-original.svg` },
  { name: 'Cloudflare', desc: 'Protecting web applications with enterprise-grade security while accelerating content delivery on a global edge network.', logo: `${DI}/cloudflare/cloudflare-original.svg` },
  { name: 'Cloudinary', desc: 'Managing, transforming, and delivering high-quality images and video assets instantly using a powerful media API.', logo: `https://www.svgrepo.com/show/353566/cloudinary.svg` },
  { name: 'Antigravity', desc: 'Harnessing advanced AI agentic workflows to radically accelerate code generation, debugging, and software architecture.', logo: `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg` },
];

export default function Home() {
  const [site, setSite] = useState<SiteData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      publicApi.getSite().then(r => setSite(r.data as unknown as SiteData)).catch(() => { }),
      publicApi.getProjects().then(r => setProjects(((r.data || []) as unknown as Project[]).slice(0, 3))).catch(() => { }),
      publicApi.getBlog({ limit: '3' }).then(r => setPosts((r.data || []) as unknown as BlogPost[])).catch(() => { }),
      publicApi.getServices().then(r => setServices(((r.data || []) as unknown as Service[]).slice(0, 3))).catch(() => { }),
      publicApi.getTestimonials().then(r => setTestimonials(((r.data || []) as unknown as Testimonial[]).slice(0, 3))).catch(() => { }),
    ]).finally(() => setLoading(false));
  }, []);

  useSEO({
    title: 'Home',
    description: 'AnandVerse is the portfolio of Anand, a Full Stack Developer building scalable web applications using React, Node.js, and modern technologies.',
    url: 'https://anandverse.space'
  });

  if (loading || !site) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <div className="w-10 h-10 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin shadow-lg shadow-primary/10" />
      </div>
    );
  }

  const heading = site.heroHeading;
  const subtitle = site.heroSubtitle;
  const description = site.heroDescription;
  const cta = site.heroCTA;
  const stats = site.stats || [];

  return (
    <PageTransition>
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        {/* Decorative gradient orbs */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/6 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="badge-pill mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{site.siteTagline}</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-display mb-6 tracking-tight leading-[1.1]">
              {heading.includes("I'm") ? (
                <><span className="text-foreground">{heading.split("I'm")[0]}I'm </span><span className="text-gradient">{heading.split("I'm")[1]?.replace(/👋/g, '').trim()}</span> 👋</>
              ) : <span className="text-gradient">{heading}</span>}
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4 leading-relaxed">{subtitle}</motion.p>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm sm:text-base text-muted-foreground/80 max-w-xl mx-auto mb-10 leading-relaxed">{description}</motion.p>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={cta.primary.link} className="group btn-primary">
                <span className="flex items-center gap-2">{cta.primary.text}<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
              </Link>
              <Link to={cta.secondary.link} className="btn-ghost">{cta.secondary.text}</Link>
            </motion.div>

            {stats.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }}
                className="flex flex-wrap justify-center gap-8 mt-16 pt-8 border-t border-border/30">
                {stats.map((s, i) => (
                  <div key={i} className="text-center">
                    <p className="text-3xl sm:text-4xl font-black text-gradient">{s.number}</p>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mt-1.5">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.6 }} className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="w-5 h-8 rounded-full border-2 border-muted-foreground/20 flex items-start justify-center p-1.5">
            <motion.div className="w-1 h-1 rounded-full bg-primary" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ TOOLS MARQUEE ═══════════════════ */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <FadeIn className="text-center flex flex-col items-center">
            <h2 className="section-heading mb-4">Technologies I Use</h2>
            <p className="section-subtext">I leverage cutting-edge technologies and industry-leading tools to build exceptional digital solutions for your ideas</p>
          </FadeIn>
        </div>

        <div className="relative flex overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          {[0, 1].map(setIdx => (
            <div key={setIdx} className="flex gap-5 pr-5 animate-marquee-reverse group-hover:[animation-play-state:paused]" aria-hidden={setIdx === 1 ? true : undefined}>
              {tools.map((tool, i) => (
                <div key={`s${setIdx}-${i}`} className="flex-shrink-0 py-3">
                  <div className="group/card flex flex-col items-center gap-3 w-[240px] h-[240px] px-5 py-6 glass-card cursor-default hover:-translate-y-1 transition-all duration-300">
                    <div className="w-16 h-16 rounded-2xl bg-background/60 flex items-center justify-center p-3.5">
                      <img src={tool.logo} alt={tool.name} className={`w-9 h-9 object-contain ${tool.invert ? 'invert' : ''}`} />
                    </div>
                    <div className="text-center flex-1 flex flex-col">
                      <h3 className="text-base font-bold mb-2 group-hover/card:text-primary transition-colors">{tool.name}</h3>
                      <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">{tool.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════ SERVICES ═══════════════════ */}
      {services.length > 0 && (
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-14">
              <h2 className="section-heading mb-4">What I <span className="text-gradient">Do</span></h2>
              <p className="section-subtext">I offer comprehensive services to help businesses grow and succeed in the digital landscape.</p>
            </FadeIn>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((s) => (
                <StaggerItem key={s._id}>
                  <div className="group p-8 glass-card hover:-translate-y-1 transition-all duration-500">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                      <span className="text-2xl">💼</span>
                    </div>
                    <h3 className="text-lg font-bold mb-3">{s.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{s.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* ═══════════════════ FEATURED PROJECTS ═══════════════════ */}
      {projects.length > 0 && (
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-14 gap-4">
              <div>
                <h2 className="section-heading mb-3">Featured <span className="text-gradient">Projects</span></h2>
                <p className="text-muted-foreground text-sm sm:text-base max-w-xl">A selection of my recent work — from concept to deployment.</p>
              </div>
              <Link to="/projects" className="group flex items-center gap-2 text-primary text-sm font-bold hover:gap-3 transition-all duration-300">View All Projects<ArrowRight className="w-4 h-4" /></Link>
            </FadeIn>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p) => (
                <StaggerItem key={p._id}>
                  <Link to={`/projects/${p.slug}`} className="group block h-full">
                    <div className="h-full relative overflow-hidden glass-card hover:-translate-y-1 transition-all duration-500 flex flex-col">
                      <div className="aspect-video overflow-hidden bg-primary/5">
                        {p.image?.url ? <img src={p.image.url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          : <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>}
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{p.title}</h3>
                        <p className="text-muted-foreground text-xs leading-relaxed mb-4 line-clamp-2 flex-1">{p.description}</p>
                        <div className="flex flex-wrap gap-2">{p.tags?.slice(0, 3).map(t => <span key={t} className="tag-chip">{t}</span>)}</div>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
      {testimonials.length > 0 && (
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-14">
              <h2 className="section-heading mb-4">What People <span className="text-gradient">Say</span></h2>
              <p className="section-subtext">Feedback from clients and collaborators I've had the pleasure of working with.</p>
            </FadeIn>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <StaggerItem key={t._id}>
                  <div className="group relative h-full p-7 glass-card flex flex-col">
                    <Quote className="w-7 h-7 text-primary/20 mb-4" />
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-border'}`} />
                      ))}
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-5 flex-1">"{t.content}"</p>
                    <div className="flex items-center gap-3 mt-auto pt-4 border-t border-border/30">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-xs font-bold text-primary">
                        {t.avatar?.url ? <img src={t.avatar.url} alt={t.name} className="w-full h-full rounded-full object-cover" /> : t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{t.name}</p>
                        <p className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">{[t.role, t.company].filter(Boolean).join(' · ')}</p>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* ═══════════════════ RECENT BLOG ═══════════════════ */}
      {posts.length > 0 && (
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-14 gap-4">
              <div>
                <h2 className="section-heading mb-3">Latest <span className="text-gradient">Articles</span></h2>
                <p className="text-muted-foreground text-sm sm:text-base max-w-xl">Thoughts, tutorials, and insights from the world of web development.</p>
              </div>
              <Link to="/blog" className="group flex items-center gap-2 text-primary text-sm font-bold hover:gap-3 transition-all duration-300">View All Articles<ArrowRight className="w-4 h-4" /></Link>
            </FadeIn>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((p) => (
                <StaggerItem key={p._id}>
                  <Link to={`/blog/${p.slug}`} className="group block h-full">
                    <div className="h-full relative overflow-hidden glass-card hover:-translate-y-1 transition-all duration-500 flex flex-col">
                      <div className="aspect-video overflow-hidden bg-primary/5">
                        {p.image?.url ? <img src={p.image.url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          : <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>}
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{new Date(p.createdAt || p.date).toLocaleDateString()}</span>
                          <span className="text-[10px] text-muted-foreground/40">•</span>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{p.readTime}</span>
                        </div>
                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">{p.title}</h3>
                        <p className="text-muted-foreground text-xs leading-relaxed flex-1 line-clamp-2">{p.excerpt}</p>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="py-20 pb-28 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-purple-500/10 to-transparent p-10 sm:p-14 text-center border border-primary/15">
              <div className="absolute inset-0 bg-background/40 backdrop-blur-sm -z-10" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
              <h2 className="section-heading mb-4">Let's Work <span className="text-gradient">Together</span></h2>
              <p className="section-subtext mb-8">Have a project in mind? I'd love to hear about it. Let's create something exceptional.</p>
              <Link to="/contact" className="btn-primary">
                Start a Project<ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </PageTransition>
  );
}
