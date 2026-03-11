import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/services/api';
import {
  FolderKanban, FileText, Zap, Briefcase, Star, MessageSquare,
  Eye, Upload, TrendingUp, Clock, Mail, MailOpen,
} from 'lucide-react';

interface DashboardData {
  stats: {
    projects: { total: number; published: number };
    blog: { total: number; published: number; totalViews: number };
    skills: number;
    services: number;
    experience: number;
    testimonials: { approved: number; pending: number };
    messages: { total: number; unread: number; starred: number };
    files: number;
  };
  recentMessages: { _id: string; name: string; email: string; subject: string; read: boolean; createdAt: string }[];
  recentPosts: { _id: string; title: string; published: boolean; views: number; date: string }[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ data: DashboardData }>('/admin/dashboard')
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!data) return <p className="text-red-400">Failed to load dashboard</p>;

  const { stats } = data;

  const cards = [
    { label: 'Projects', value: stats.projects.total, sub: `${stats.projects.published} published`, icon: FolderKanban, color: 'blue', to: '/admin/projects' },
    { label: 'Blog Posts', value: stats.blog.total, sub: `${stats.blog.published} published`, icon: FileText, color: 'purple', to: '/admin/blog' },
    { label: 'Total Views', value: stats.blog.totalViews, sub: 'across all posts', icon: Eye, color: 'green', to: '/admin/blog' },
    { label: 'Skills', value: stats.skills, sub: 'configured', icon: Zap, color: 'yellow', to: '/admin/skills' },
    { label: 'Services', value: stats.services, sub: 'active', icon: Briefcase, color: 'cyan', to: '/admin/services' },
    { label: 'Experience', value: stats.experience, sub: 'entries', icon: TrendingUp, color: 'orange', to: '/admin/experience' },
    { label: 'Testimonials', value: stats.testimonials.approved, sub: `${stats.testimonials.pending} pending`, icon: Star, color: 'pink', to: '/admin/testimonials' },
    { label: 'Messages', value: stats.messages.total, sub: `${stats.messages.unread} unread`, icon: MessageSquare, color: 'indigo', to: '/admin/messages' },
    { label: 'Files', value: stats.files, sub: 'uploaded', icon: Upload, color: 'emerald', to: '/admin/files' },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-500 shadow-blue-500/5',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-500 shadow-purple-500/5',
    green: 'bg-green-500/10 border-green-500/20 text-green-500 shadow-green-500/5',
    yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500 shadow-yellow-500/5',
    cyan: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-500 shadow-cyan-500/5',
    orange: 'bg-orange-500/10 border-orange-500/20 text-orange-500 shadow-orange-500/5',
    pink: 'bg-pink-500/10 border-pink-500/20 text-pink-500 shadow-pink-500/5',
    indigo: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500 shadow-indigo-500/5',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-emerald-500/5',
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display text-foreground tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground text-sm mt-2 max-w-lg">
            Monitor your platform metrics, recent engagements, and content updates in real-time.
          </p>
        </div>
        <div className="flex gap-3">
           <Link to="/admin/blog" className="px-4 py-2 bg-card border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors">
              Write Post
           </Link>
           <Link to="/admin/projects" className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium shadow-lg hover:bg-primary/90 transition-colors">
              Add Project
           </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link key={card.label} to={card.to} className="group block h-full">
            <div className="h-full p-6 rounded-3xl bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
              <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20 ${colorMap[card.color].split(' ')[0]}`} />
              <div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm border ${colorMap[card.color]}`}>
                  <card.icon className="w-6 h-6 stroke-[1.5]" />
                </div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">{card.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-foreground tracking-tight">{card.value}</span>
                </div>
              </div>
              <p className="text-xs font-medium text-muted-foreground mt-4 pt-4 border-t border-border flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${colorMap[card.color].split(' ')[0].replace('bg-', 'bg-').replace('/10', '')}`} />
                {card.sub}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Messages */}
        <div className="rounded-3xl bg-card border border-border shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Recent Inquiries</h2>
            </div>
            <Link to="/admin/messages" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">View All</Link>
          </div>
          <div className="flex-1 p-2">
            {data.recentMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                <Mail className="w-10 h-10 mb-3 opacity-20" />
                <p className="text-sm">No new messages</p>
              </div>
            ) : (
              <div className="space-y-1">
                {data.recentMessages.map((msg) => (
                  <Link key={msg._id} to="/admin/messages"
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-colors group">
                    <div className="flex-shrink-0 mt-1 sm:mt-0 relative">
                     <div className={`p-2.5 rounded-full ${msg.read ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
                        {msg.read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                     </div>
                     {!msg.read && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-card" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${msg.read ? 'text-muted-foreground' : 'text-foreground font-bold'}`}>{msg.subject || 'No Subject'}</p>
                      <p className="text-xs text-muted-foreground truncate mt-1 font-medium">{msg.name} <span className="opacity-50 mx-1">•</span> {msg.email}</p>
                    </div>
                    <div className="flex-shrink-0 text-xs text-muted-foreground font-medium sm:text-right hidden sm:block opacity-60 group-hover:opacity-100 transition-opacity">
                      {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Posts */}
        <div className="rounded-3xl bg-card border border-border shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 text-purple-500 rounded-xl">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Content Feed</h2>
            </div>
            <Link to="/admin/blog" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">Manage Content</Link>
          </div>
          <div className="flex-1 p-2">
            {data.recentPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                <FileText className="w-10 h-10 mb-3 opacity-20" />
                <p className="text-sm">No recent publications</p>
              </div>
            ) : (
              <div className="space-y-1">
                {data.recentPosts.map((post) => (
                  <div key={post._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{post.title}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground font-medium">
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 opacity-70" /> {new Date(post.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className="opacity-50">•</span>
                        <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5 opacity-70" /> {post.views} Views</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg ${post.published ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${post.published ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
