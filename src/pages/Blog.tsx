import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, Search, Tag, Sparkles, BookOpen } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import FadeIn from '@/components/animations/FadeIn';
import { publicApi } from '@/services/api';
import { useSEO } from '@/hooks/useSEO';

interface BlogPost {
  _id: string; title: string; slug: string; excerpt: string; image: { url: string };
  createdAt: string; readTime: string; tags: string[]; views: number; author: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    publicApi.getBlog().then(r => setPosts((r.data || []) as unknown as BlogPost[])).catch(() => { }).finally(() => setLoading(false));
  }, []);

  useSEO({
    title: 'Blog',
    description: 'Read articles, tutorials, and insights on modern web development, architecture, and technology by Anand.',
    url: 'https://anandverse.space/blog'
  });

  const allTags = Array.from(new Set(posts.flatMap(p => p.tags || [])));

  const filteredPosts = posts.filter(p => {
    const matchesSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || p.tags?.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

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
              <span>Engineering Insights</span>
            </div>
            <h1 className="section-heading text-5xl sm:text-6xl">
              My <span className="text-gradient">Blog</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
              Thoughts, tutorials, and deep dives into modern web development, architecture, and technology.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass-card p-3 md:p-4">
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="Search articles..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="input-field pl-10" />
              </div>
              <div className="flex flex-wrap gap-2 justify-center md:justify-end flex-1">
                <button onClick={() => setSelectedTag(null)} className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all duration-300 ${!selectedTag ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105' : 'glass-card !rounded-xl cursor-pointer text-muted-foreground hover:text-foreground'}`}>All Topics</button>
                {allTags.map(tag => (
                  <button key={tag} onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                    className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all duration-300 ${selectedTag === tag ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105' : 'glass-card !rounded-xl cursor-pointer text-muted-foreground hover:text-foreground'}`}>{tag}</button>
                ))}
              </div>
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
              <motion.div key={`${searchQuery}-${selectedTag}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post, i) => (
                  <motion.article key={post._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1, duration: 0.4 }} className="h-full">
                    <Link to={`/blog/${post.slug}`} className="group block h-full">
                      <div className="h-full flex flex-col glass-card overflow-hidden relative hover:-translate-y-1 transition-all duration-500">
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <div className="relative aspect-[16/10] overflow-hidden bg-muted/30 p-2">
                          <div className="w-full h-full rounded-[1.2rem] overflow-hidden border border-border/50 relative">
                            {post.image?.url ? <img src={post.image.url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 group-hover:-rotate-1 transition-transform duration-700 ease-out" />
                              : <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-card/50"><BookOpen className="w-10 h-10 mb-3 opacity-20" /></div>}
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none" />
                          </div>
                        </div>
                        <div className="flex-1 p-6 flex flex-col relative z-10">
                          <div className="flex items-center gap-2 mb-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md"><Calendar className="w-3 h-3 text-primary" />{new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md"><Clock className="w-3 h-3 text-primary" />{post.readTime}</span>
                          </div>
                          <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">{post.title}</h3>
                          <p className="text-muted-foreground text-xs mb-4 flex-1 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                          <div className="flex flex-wrap gap-1.5 mb-5">
                            {post.tags?.slice(0, 3).map(t => <span key={t} className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-primary/10 text-primary border border-primary/20"><Tag className="w-2.5 h-2.5" />{t}</span>)}
                          </div>
                          <div className="pt-3 border-t border-border/50 w-full flex justify-between items-center group-hover:border-primary/30 transition-colors">
                            <span className="text-xs font-bold text-foreground">Read Article</span>
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:-rotate-45 transition-all duration-300">
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {!loading && filteredPosts.length === 0 && (
            <FadeIn>
              <div className="text-center py-32 rounded-3xl border-2 border-dashed border-border glass-card max-w-3xl mx-auto">
                <Search className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">No Articles Found</h3>
                <p className="text-muted-foreground text-lg">We couldn't find any articles matching your search criteria.</p>
                <button onClick={() => { setSearchQuery(''); setSelectedTag(null) }} className="mt-6 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:bg-primary/90 transition-all">Clear Filters</button>
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
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-primary-foreground mx-auto mb-6 shadow-xl shadow-primary/20 rotate-3">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display mb-4 tracking-tight">Stay <span className="text-gradient">Inspired</span></h2>
                <p className="text-muted-foreground text-sm sm:text-base mb-8 max-w-2xl mx-auto leading-relaxed">Join my newsletter to get the latest articles, tutorials, and insights delivered straight to your inbox.</p>
                <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto relative">
                  <div className="relative flex-1">
                    <input type="email" placeholder="Enter your email address" required className="input-field" />
                  </div>
                  <button type="submit" className="px-6 py-3 bg-foreground text-background rounded-xl font-bold text-sm hover:shadow-xl hover:shadow-foreground/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap">Subscribe</button>
                </form>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </PageTransition>
  );
}
