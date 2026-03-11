import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Tag, Twitter, Linkedin, Facebook, Sparkles, BookOpen, Share2, ArrowRight } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import FadeIn from '@/components/animations/FadeIn';
import { publicApi } from '@/services/api';

interface BlogPost {
  _id: string; title: string; slug: string; excerpt: string; content: string;
  image: { url: string }; tags: string[]; author: string; readTime: string;
  createdAt: string; views: number;
}

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    publicApi.getBlogBySlug(id)
      .then(r => setPost(r.data as unknown as BlogPost))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
    publicApi.getBlog({ limit: '3' })
      .then(r => setRelated(((r.data || []) as unknown as BlogPost[]).filter(p => p.slug !== id).slice(0, 2)))
      .catch(() => { });
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg shadow-primary/20" /></div>;
  if (notFound || !post) return <Navigate to="/blog" replace />;

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Check out: ${post.title}`;

  return (
    <PageTransition>
      <div className="pt-24 pb-6 relative z-20 overflow-visible">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/blog" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted font-bold text-[13px] transition-all duration-300 shadow-sm hover:shadow-md backdrop-blur-md">
            <ArrowLeft className="w-4 h-4" /> Back to Articles
          </Link>
        </div>
      </div>

      <section className="relative z-10 pb-16">
        {/* Abstract Background Gradients */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px] -z-10 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex flex-wrap gap-2 mb-6">
              {(post.tags || []).map(t => (
                <span key={t} className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm">
                  <Tag className="w-3 h-3" />{t}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display mb-6 leading-[1.1] tracking-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-10 p-4 rounded-[1.5rem] bg-card/40 backdrop-blur-xl shadow-xl border border-border/50 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-inner">
                  <span className="text-white font-bold text-base">{(post.author || 'A')[0]}</span>
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">{post.author || 'Anand'}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider">Author</p>
                </div>
              </div>

              <div className="hidden sm:block w-px h-8 bg-border" />

              <div className="flex items-center gap-4 flex-1 justify-end sm:justify-start text-xs">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-semibold">{new Date(post.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-semibold">{post.readTime}</span>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="relative aspect-[16/9] rounded-[1.5rem] overflow-hidden mb-12 bg-card/40 backdrop-blur-xl shadow-xl border border-border p-2 shadow-xl">
              <div className="w-full h-full rounded-[1.2rem] overflow-hidden relative">
                {post.image?.url ? (
                  <img src={post.image.url} alt={post.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-muted/50 border border-border/50">
                    <BookOpen className="w-16 h-16 text-muted-foreground/30 mb-3" />
                    <span className="text-sm font-medium text-muted-foreground">Article Media</span>
                  </div>
                )}
                {/* Subtle overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="pb-24 relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn delay={0.2}>
            <article className="prose dark:prose-invert max-w-none text-muted-foreground font-medium text-sm marker:text-primary">
              {post.excerpt && (
                <p className="text-lg sm:text-xl leading-relaxed text-foreground font-semibold mb-10 pb-10 border-b border-border">
                  <span className="text-3xl text-primary font-serif leading-none mr-2 float-left mt-2">"</span>
                  {post.excerpt}
                </p>
              )}

              {(post.content || '').split('\n\n').map((para, i) => {
                if (para.startsWith('# ') && !para.startsWith('## ')) return <h1 key={i} className="text-3xl font-black mt-12 mb-5 text-foreground tracking-tight font-display">{para.replace('# ', '')}</h1>;
                if (para.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-10 mb-4 text-foreground tracking-tight font-display flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary shrink-0" />{para.replace('## ', '')}</h2>;
                if (para.startsWith('### ')) return <h3 key={i} className="text-xl font-bold mt-8 mb-3 text-foreground font-display">{para.replace('### ', '')}</h3>;
                if (para.startsWith('```')) { const code = para.replace(/```\w*\n?/g, ''); return <div key={i} className="my-6 relative group"><div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-xl blur opacity-50 group-hover:opacity-100 transition-opacity duration-500" /><pre className="relative bg-[#0d1117] border border-border/50 rounded-xl p-4 overflow-x-auto shadow-xl"><code className="text-xs font-mono leading-relaxed text-[#c9d1d9]">{code}</code></pre></div>; }
                if (para.startsWith('- ') || para.startsWith('* ')) { return <ul key={i} className="list-disc list-outside ml-6 space-y-2 mb-6">{para.split('\n').map((item, j) => <li key={j} className="pl-1.5">{item.replace(/^[\-\*]\s/, '')}</li>)}</ul>; }
                if (para.match(/^\d+\.\s/)) { return <ol key={i} className="list-decimal list-outside ml-6 space-y-2 mb-6 font-semibold text-foreground">{para.split('\n').map((item, j) => <li key={j} className="pl-1.5 leading-relaxed text-muted-foreground font-medium">{item.replace(/^\d+\.\s/, '')}</li>)}</ol>; }
                return <p key={i} className="leading-relaxed mb-6">{para}</p>;
              })}
            </article>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-16 p-6 rounded-[1.5rem] bg-card/40 backdrop-blur-xl shadow-xl border border-border flex flex-col items-center gap-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-2.5 text-base font-bold">
                <Share2 className="w-5 h-5 text-primary" /> Share this Masterpiece
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs bg-[#1DA1F2]/10 text-[#1DA1F2] border border-[#1DA1F2]/20 hover:bg-[#1DA1F2] hover:text-white transition-all duration-300 font-bold">
                  <Twitter className="w-4 h-4" /> Twitter (X)
                </a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs bg-[#0A66C2]/10 text-[#0A66C2] border border-[#0A66C2]/20 hover:bg-[#0A66C2] hover:text-white transition-all duration-300 font-bold">
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs bg-[#1877F2]/10 text-[#1877F2] border border-[#1877F2]/20 hover:bg-[#1877F2] hover:text-white transition-all duration-300 font-bold">
                  <Facebook className="w-4 h-4" /> Facebook
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Related Articles Component */}
      {related.length > 0 && (
        <section className="py-24 relative bg-muted/20 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
              <h2 className="text-3xl font-black font-display tracking-tight">Keep <span className="text-gradient">Reading</span></h2>
              <Link to="/blog" className="inline-flex items-center gap-1.5 text-primary text-sm font-bold hover:gap-2.5 transition-all duration-300 bg-primary/10 px-4 py-2 rounded-lg hover:bg-primary/20">
                View All Articles <ArrowRight className="w-4 h-4" />
              </Link>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map((rp, i) => (
                <motion.article key={rp._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="h-full">
                  <Link to={`/blog/${rp.slug}`} className="group block h-full">
                    <div className="flex flex-col sm:flex-row gap-5 p-5 rounded-[1.5rem] bg-card/40 backdrop-blur-xl shadow-xl border border-border hover:border-primary/50 transition-all duration-500 shadow-sm hover:shadow-xl h-full items-center">
                      <div className="w-full sm:w-40 aspect-video sm:aspect-square sm:h-auto flex-shrink-0 rounded-[1.2rem] overflow-hidden bg-primary/5 border border-border/50 relative">
                        {rp.image?.url ? (
                          <img src={rp.image.url} alt={rp.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
                            <BookOpen className="w-8 h-8 text-muted-foreground/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-overlay" />
                      </div>

                      <div className="flex-1 min-w-0 py-1.5">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-primary" />{new Date(rp.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-2">{rp.title}</h3>
                        <p className="text-muted-foreground line-clamp-2 leading-relaxed text-xs">{rp.excerpt}</p>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageTransition>
  );
}
