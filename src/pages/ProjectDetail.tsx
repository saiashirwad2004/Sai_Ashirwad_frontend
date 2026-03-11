import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Calendar, Tag, ArrowRight, Sparkles, FolderKanban } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import FadeIn from '@/components/animations/FadeIn';
import { publicApi } from '@/services/api';

interface Project {
  _id: string; title: string; slug: string; description: string; longDescription: string;
  image: { url: string }; tags: string[]; github: string; live: string; featured: boolean; createdAt: string;
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [related, setRelated] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    publicApi.getProjectBySlug(id)
      .then(r => { setProject(r.data as unknown as Project); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
    publicApi.getProjects({ limit: '3' })
      .then(r => setRelated(((r.data || []) as unknown as Project[]).filter(p => p.slug !== id).slice(0, 2)))
      .catch(() => { });
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg shadow-primary/20" /></div>;
  if (notFound || !project) return <Navigate to="/projects" replace />;

  return (
    <PageTransition>
      <div className="pt-24 pb-6 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/projects" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted font-bold text-[13px] transition-all duration-300 shadow-sm hover:shadow-md">
            <ArrowLeft className="w-4 h-4" /> Back to Projects
          </Link>
        </div>
      </div>

      <section className="relative z-10 pb-20">
        {/* Abstract Backgrounds */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* Left Content Column */}
            <div className="lg:col-span-5 order-2 lg:order-1 pt-4">
              <FadeIn>
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-foreground text-xs font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span>{new Date(project.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  </div>
                  {project.featured && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-primary/10 text-primary border border-primary/20">
                      <Sparkles className="w-3.5 h-3.5" />
                      Featured Project
                    </span>
                  )}
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-display mb-6 leading-[1.1] tracking-tight">
                  {project.title.split(' ').map((word, i, arr) => (
                    i === arr.length - 1 ? <span key={i} className="text-gradient">{word}</span> : <span key={i}>{word} </span>
                  ))}
                </h1>

                <p className="text-sm sm:text-base text-muted-foreground mb-8 leading-relaxed font-medium">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-10">
                  {(project.tags || []).map(t => (
                    <span key={t} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-[13px] font-bold shadow-sm">
                      <Tag className="w-3.5 h-3.5 text-primary" />{t}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 active:scale-95 group">
                      <ExternalLink className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                      Live Demo
                    </a>
                  )}
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border text-foreground rounded-xl text-sm font-bold hover:bg-muted hover:shadow-md transition-all duration-300 hover:scale-105 active:scale-95 group">
                      <Github className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                      Source Code
                    </a>
                  )}
                </div>
              </FadeIn>
            </div>

            {/* Right Image/Showcase Column */}
            <div className="lg:col-span-7 order-1 lg:order-2 relative">
              <FadeIn delay={0.2} direction="right">
                <div className="relative rounded-[1.5rem] overflow-hidden bg-card border border-border p-3 shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10 opacity-50 pointer-events-none" />

                  <div className="relative aspect-[4/3] rounded-[1.2rem] overflow-hidden bg-muted/50 border border-border/50 group">
                    {project.image?.url ? (
                      <img src={project.image.url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-card">
                        <span className="text-4xl mb-3 opacity-50">🚀</span>
                        <span className="font-medium text-sm">Project Media</span>
                      </div>
                    )}

                    {/* Glass Overlay on Bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/90 via-background/40 to-transparent pointer-events-none" />
                  </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-primary/10 rounded-full blur-xl -z-10" />
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-500/10 rounded-full blur-xl -z-10" />
              </FadeIn>
            </div>

          </div>
        </div>
      </section>

      {/* Project Long Description */}
      {project.longDescription && (
        <section className="py-16 relative bg-muted/20 border-y border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="prose dark:prose-invert max-w-none text-muted-foreground text-sm font-medium">
                <div className="flex items-center gap-2 mb-6 text-foreground">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white shadow-md shadow-primary/20">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold m-0 pl-2">About the Project</h2>
                </div>

                <div className="whitespace-pre-line leading-relaxed bg-card border border-border rounded-[1.5rem] p-6 sm:p-8 shadow-sm">
                  {project.longDescription}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Related Projects */}
      {related.length > 0 && (
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
              <h2 className="text-3xl font-black font-display tracking-tight">Discover More <span className="text-gradient">Projects</span></h2>
              <Link to="/projects" className="inline-flex items-center gap-1.5 text-primary text-sm font-bold hover:gap-2.5 transition-all duration-300 bg-primary/10 px-4 py-2 rounded-lg hover:bg-primary/20">
                View All Portfolio <ArrowRight className="w-4 h-4" />
              </Link>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map((rp, i) => (
                <motion.div key={rp._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Link to={`/projects/${rp.slug}`} className="group block h-full">
                    <div className="relative overflow-hidden rounded-[1.5rem] bg-card border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 h-full flex flex-col">
                      <div className="aspect-[16/9] overflow-hidden bg-muted/50 relative p-2">
                        <div className="w-full h-full rounded-[1.2rem] overflow-hidden border border-border/50 relative">
                          {rp.image?.url ? <img src={rp.image.url} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 group-hover:rotate-1 transition-transform duration-700 ease-out" /> : <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-card"><FolderKanban className="w-10 h-10 mb-2 opacity-20" /></div>}
                          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-bold group-hover:text-primary transition-colors pr-2 truncate">{rp.title}</h3>
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:-rotate-45 transition-all duration-300 flex-shrink-0">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                        <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed flex-1">{rp.description}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageTransition>
  );
}
