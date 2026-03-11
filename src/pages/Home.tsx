import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, Quote } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import FadeIn from '@/components/animations/FadeIn';
import StaggerContainer, { StaggerItem } from '@/components/animations/StaggerContainer';
import { publicApi } from '@/services/api';

interface SiteData {
  heroHeading: string; heroSubtitle: string; heroDescription: string; siteTagline: string;
  heroCTA: { primary: { text: string; link: string }; secondary: { text: string; link: string } };
  stats: { number: string; label: string }[];
}
interface Project { _id: string; title: string; slug: string; description: string; image: { url: string }; tags: string[]; }
interface BlogPost { _id: string; title: string; slug: string; excerpt: string; image: { url: string }; date: string; readTime: string; createdAt: string; }
interface Service { _id: string; title: string; description: string; icon: string; }
interface Testimonial { _id: string; name: string; role: string; company: string; content: string; rating: number; avatar: { url: string }; }

/* ── Tools / Tech Stack Data ──────────────────────────────────── */
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

  useEffect(() => {
    publicApi.getSite().then(r => setSite(r.data as unknown as SiteData)).catch(() => { });
    publicApi.getProjects().then(r => setProjects(((r.data || []) as unknown as Project[]).slice(0, 3))).catch(() => { });
    publicApi.getBlog({ limit: '3' }).then(r => setPosts((r.data || []) as unknown as BlogPost[])).catch(() => { });
    publicApi.getServices().then(r => setServices(((r.data || []) as unknown as Service[]).slice(0, 3))).catch(() => { });
    publicApi.getTestimonials().then(r => setTestimonials(((r.data || []) as unknown as Testimonial[]).slice(0, 3))).catch(() => { });
  }, []);

  const heading = site?.heroHeading || "Hi, I'm Anand";
  const subtitle = site?.heroSubtitle || 'I build beautiful, fast, and user-friendly web experiences';
  const description = site?.heroDescription || 'Passionate about creating innovative solutions with modern technologies.';
  const cta = site?.heroCTA || { primary: { text: 'View My Work', link: '/projects' }, secondary: { text: 'Get In Touch', link: '/contact' } };
  const stats = site?.stats || [];

  return (
    <PageTransition>
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-bold text-primary tracking-wide uppercase">{site?.siteTagline || 'Full Stack Developer'}</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-display mb-4 tracking-tight">
              {heading.includes("I'm") ? (
                <><span className="text-foreground">{heading.split("I'm")[0]}I'm </span><span className="text-gradient">{heading.split("I'm")[1]?.replace(/👋/g, '').trim()}</span> 👋</>
              ) : <span className="text-gradient">{heading}</span>}
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-6 leading-relaxed">{subtitle}</motion.p>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">{description}</motion.p>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={cta.primary.link} className="group relative px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/25">
                <span className="relative z-10 flex items-center gap-2">{cta.primary.text}<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                <motion.div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" initial={{ x: '-100%' }} whileHover={{ x: 0 }} transition={{ duration: 0.3 }} />
              </Link>
              <Link to={cta.secondary.link} className="px-6 py-3 border border-border rounded-xl text-sm font-bold text-foreground hover:bg-white/5 transition-all duration-300">{cta.secondary.text}</Link>
            </motion.div>

            {stats.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }}
                className="flex flex-wrap justify-center gap-6 mt-12">
                {stats.map((s, i) => (
                  <div key={i} className="text-center"><p className="text-2xl sm:text-3xl font-black text-gradient">{s.number}</p><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">{s.label}</p></div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.6 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <motion.div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ TOOLS MARQUEE ═══════════════════ */}
      <section className="py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <FadeIn className="text-center flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-display mb-3 tracking-tight">Technologies I Use</h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">I leverage cutting-edge technologies and industry-leading tools to build exceptional digital solutions for your ideas</p>
          </FadeIn>
        </div>

        {/* Single Row Left-to-Right Scrolling Marquee */}
        <div className="relative flex overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="flex gap-6 pr-6 animate-marquee-reverse group-hover:[animation-play-state:paused]">
            {tools.map((tool, i) => (
              <div key={`s1-${i}`} className="flex-shrink-0 py-4">
                <div className="group/card flex flex-col items-center gap-4 w-[280px] h-[320px] px-6 py-8 rounded-[1.5rem] bg-card border border-border hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 backdrop-blur-sm cursor-default hover:-translate-y-2">
                  <div className="w-20 h-20 rounded-full bg-background flex items-center justify-center p-4 shadow-inner">
                    <img src={tool.logo} alt={tool.name} className={`w-10 h-10 object-contain ${tool.invert ? 'invert' : ''}`} loading="lazy" />
                  </div>
                  <div className="text-center flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-3 group-hover/card:text-primary transition-colors">{tool.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">{tool.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-6 pr-6 animate-marquee-reverse group-hover:[animation-play-state:paused]" aria-hidden="true">
            {tools.map((tool, i) => (
              <div key={`s2-${i}`} className="flex-shrink-0 py-4">
                <div className="group/card flex flex-col items-center gap-4 w-[280px] h-[320px] px-6 py-8 rounded-[1.5rem] bg-card border border-border hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 backdrop-blur-sm cursor-default hover:-translate-y-2">
                  <div className="w-20 h-20 rounded-full bg-background flex items-center justify-center p-4 shadow-inner">
                    <img src={tool.logo} alt={tool.name} className={`w-10 h-10 object-contain ${tool.invert ? 'invert' : ''}`} loading="lazy" />
                  </div>
                  <div className="text-center flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-3 group-hover/card:text-primary transition-colors">{tool.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">{tool.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ SERVICES ═══════════════════ */}
      {services.length > 0 && (
        <section className="py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-display mb-3 tracking-tight">What I <span className="text-gradient">Do</span></h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">I offer comprehensive services to help businesses grow and succeed.</p>
            </FadeIn>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((s) => (
                <StaggerItem key={s._id}>
                  <div className="group p-8 rounded-[1.5rem] bg-card border border-border/50 hover:border-primary/50 transition-all duration-500 shadow-sm hover:shadow-md">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300"><span className="text-2xl">💼</span></div>
                    <h3 className="text-lg font-bold mb-2">{s.title}</h3>
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
        <section className="py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
              <div><h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-display mb-3 tracking-tight">Featured <span className="text-gradient">Projects</span></h2><p className="text-muted-foreground text-sm sm:text-base max-w-xl">A selection of my recent work.</p></div>
              <Link to="/projects" className="group flex items-center gap-2 text-primary text-sm font-bold hover:gap-3 transition-all duration-300">View All Projects<ArrowRight className="w-4 h-4" /></Link>
            </FadeIn>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p) => (
                <StaggerItem key={p._id}>
                  <Link to={`/projects/${p.slug}`} className="group block h-full">
                    <div className="h-full relative overflow-hidden rounded-[1.5rem] bg-card border border-border/50 hover:border-primary/50 transition-all duration-500 shadow-sm hover:shadow-lg flex flex-col">
                      <div className="aspect-video overflow-hidden bg-primary/5">
                        {p.image?.url ? <img src={p.image.url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          : <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>}
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{p.title}</h3>
                        <p className="text-muted-foreground text-xs leading-relaxed mb-4 line-clamp-2 flex-1">{p.description}</p>
                        <div className="flex flex-wrap gap-2">{p.tags?.slice(0, 3).map(t => <span key={t} className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-primary/10 text-primary">{t}</span>)}</div>
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
        <section className="py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-display mb-3 tracking-tight">What People <span className="text-gradient">Say</span></h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">Feedback from clients and collaborators I've had the pleasure of working with.</p>
            </FadeIn>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <StaggerItem key={t._id}>
                  <div className="group relative h-full p-6 sm:p-8 rounded-[1.5rem] bg-card border border-border/50 hover:border-primary/30 transition-all duration-500 shadow-sm hover:shadow-lg flex flex-col">
                    {/* Quote icon */}
                    <Quote className="w-8 h-8 text-primary/20 mb-4" />

                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700'}`} />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-5 flex-1">"{t.content}"</p>

                    {/* Author */}
                    <div className="flex items-center gap-3 mt-auto pt-4 border-t border-border/50">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-xs font-bold text-primary">
                        {t.avatar?.url ? <img src={t.avatar.url} alt={t.name} className="w-full h-full rounded-full object-cover" /> : t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{t.name}</p>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">{[t.role, t.company].filter(Boolean).join(' · ')}</p>
                      </div>
                    </div>

                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* ═══════════════════ RECENT BLOG ═══════════════════ */}
      {posts.length > 0 && (
        <section className="py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
              <div><h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-display mb-3 tracking-tight">Latest <span className="text-gradient">Articles</span></h2><p className="text-muted-foreground text-sm sm:text-base max-w-xl">Thoughts, tutorials, and insights.</p></div>
              <Link to="/blog" className="group flex items-center gap-2 text-primary text-sm font-bold hover:gap-3 transition-all duration-300">View All Articles<ArrowRight className="w-4 h-4" /></Link>
            </FadeIn>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((p) => (
                <StaggerItem key={p._id}>
                  <Link to={`/blog/${p.slug}`} className="group block h-full">
                    <div className="h-full relative overflow-hidden rounded-[1.5rem] bg-card border border-border/50 hover:border-primary/50 transition-all duration-500 shadow-sm hover:shadow-lg flex flex-col">
                      <div className="aspect-video overflow-hidden bg-primary/5">
                        {p.image?.url ? <img src={p.image.url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          : <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>}
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{new Date(p.createdAt || p.date).toLocaleDateString()}</span>
                          <span className="text-[10px] font-bold text-muted-foreground">•</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{p.readTime}</span>
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
      <section className="py-16 pb-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 p-8 sm:p-12 text-center border border-primary/20 shadow-lg">
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm -z-10" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-display mb-3 tracking-tight">Let's Work <span className="text-gradient">Together</span></h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto mb-6">Have a project in mind? I'd love to hear about it.</p>
              <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                Start a Project<ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </PageTransition>
  );
}
