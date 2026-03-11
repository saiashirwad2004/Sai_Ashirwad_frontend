import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Github, Sparkles, FolderKanban } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import FadeIn from '@/components/animations/FadeIn';
import { publicApi } from '@/services/api';
import { useSEO } from '@/hooks/useSEO';

interface Project {
  _id: string; title: string; slug: string; description: string;
  image: { url: string }; tags: string[]; github: string; live: string; category: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    publicApi.getProjects().then(r => setProjects((r.data || []) as unknown as Project[])).catch(() => { }).finally(() => setLoading(false));
  }, []);

  useSEO({
    title: 'Projects',
    description: 'Explore the portfolio of Anand, featuring full-stack applications, creative coding, and professional projects.',
    url: 'https://anandverse.space/projects'
  });

  const allTags = Array.from(new Set(projects.flatMap(p => p.tags || [])));
  const categories = ['All', ...allTags.slice(0, 6)];

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.tags?.includes(activeCategory));

  return (
    <PageTransition>
      <section className="page-hero">
        {/* Background Gradients */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[160px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-500/6 rounded-full blur-[140px] -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
          <FadeIn className="text-center max-w-3xl mx-auto space-y-6">
            <div className="badge-pill">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Portfolio Masterpieces</span>
            </div>
            <h1 className="section-heading text-5xl sm:text-6xl">
              My <span className="text-gradient">Projects</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
              A curated collection of my recent creative endeavors, showcasing my journey from initial concept to polished deployment.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((c) => (
                <button key={c} onClick={() => setActiveCategory(c)}
                  className={`px-5 py-2 rounded-xl text-[13px] font-bold transition-all duration-300 ${activeCategory === c ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105' : 'glass-card !rounded-xl cursor-pointer text-muted-foreground hover:text-foreground'}`}>
                  {c}
                </button>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-32"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg shadow-primary/20" /></div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={activeCategory} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProjects.map((p, i) => (
                  <motion.div key={p._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1, duration: 0.4 }}>
                    <div className="group h-full flex flex-col glass-card overflow-hidden relative hover:-translate-y-1 transition-all duration-500">
                      {/* Inner Glow Hack */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      <div className="relative aspect-[4/3] overflow-hidden bg-muted/30 p-2">
                        <div className="w-full h-full rounded-[1.2rem] overflow-hidden relative border border-border/50">
                          {p.image?.url ? <img src={p.image.url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out" />
                            : <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-card/50"><FolderKanban className="w-10 h-10 mb-3 opacity-20" />No Image</div>}

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-background/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-4">
                            <div className="flex items-center gap-3 translate-y-6 group-hover:translate-y-0 transition-all duration-500">
                              {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="p-3 rounded-full glass-card text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-110 transition-all duration-300"><Github className="w-5 h-5" /></a>}
                              {p.live && <a href={p.live} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="p-3 rounded-full glass-card text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-110 transition-all duration-300"><ExternalLink className="w-5 h-5" /></a>}
                            </div>
                            <Link to={`/projects/${p.slug}`} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-xs font-bold opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 hover:shadow-lg shadow-primary/30">
                              View Project
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 p-6 flex flex-col relative z-10">
                        <div className="flex items-center justify-between mb-2">
                          <Link to={`/projects/${p.slug}`} className="flex-1"><h3 className="text-xl font-bold group-hover:text-primary transition-colors truncate pr-2">{p.title}</h3></Link>
                          <Link to={`/projects/${p.slug}`} className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:-rotate-45 transition-all duration-300 flex-shrink-0">
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                        <p className="text-muted-foreground text-[13px] leading-relaxed mb-4 flex-1 line-clamp-3">{p.description}</p>
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
                          {p.tags?.slice(0, 3).map(t => (
                            <span key={t} className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                              {t}
                            </span>
                          ))}
                          {(p.tags?.length || 0) > 3 && (
                            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-muted text-muted-foreground">
                              +{(p.tags?.length || 0) - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {!loading && filteredProjects.length === 0 && (
            <FadeIn>
              <div className="text-center py-32 rounded-3xl border-2 border-dashed border-border glass-card max-w-3xl mx-auto">
                <FolderKanban className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">No Projects Found</h3>
                <p className="text-muted-foreground text-lg">We couldn't find any projects matching the '{activeCategory}' category.</p>
                <button onClick={() => setActiveCategory('All')} className="mt-6 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:bg-primary/90 transition-all">View All Projects</button>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn>
            <div className="relative overflow-hidden rounded-3xl glass-card p-8 sm:p-12 md:p-16 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-transparent pointer-events-none" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-primary-foreground mx-auto mb-6 shadow-xl shadow-primary/20 -rotate-3">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display mb-4 tracking-tight">Have a Visionary <span className="text-gradient">Project?</span></h2>
                <p className="text-muted-foreground text-sm sm:text-base mb-8 max-w-2xl mx-auto leading-relaxed">Let's collaborate to build an extraordinary digital experience that stands out from the rest.</p>
                <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-bold text-sm hover:shadow-2xl hover:shadow-foreground/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group">
                  Start a Conversation
                  <span className="w-6 h-6 rounded-full bg-background/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </PageTransition>
  );
}
