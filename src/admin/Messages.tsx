import { useState } from 'react';
import useAdminData from '@/hooks/useAdminData';
import api from '@/services/api';
import { Mail, MailOpen, Star, Trash2, Reply, Search, CheckCheck, Clock, X, Loader2 } from 'lucide-react';

interface Message { _id: string; name: string; email: string; subject: string; message: string; read: boolean; starred: boolean; replied: boolean; repliedAt: string; createdAt: string; }

export default function Messages() {
  const { data, loading, fetchAll, deleteItem } = useAdminData<Message>('messages');
  const [selected, setSelected] = useState<Message | null>(null);
  const [replyForm, setReplyForm] = useState({ subject: '', body: '' });
  const [replying, setReplying] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred'>('all');

  const toggleRead = async (id: string) => { await api(`/admin/messages/${id}/read`, { method: 'PUT' }); fetchAll(); };
  const toggleStar = async (id: string) => { await api(`/admin/messages/${id}/star`, { method: 'PUT' }); fetchAll(); };
  const markAllRead = async () => { await api('/admin/messages/bulk/read-all', { method: 'PUT' }); fetchAll(); };

  const openMessage = async (msg: Message) => {
    const res = await api<{ data: Message }>(`/admin/messages/${msg._id}`);
    setSelected(res.data);
    setReplyForm({ subject: `Re: ${msg.subject}`, body: '' });
    fetchAll();
  };

  const sendReply = async () => {
    if (!selected || !replyForm.body) return;
    setReplying(true);
    try {
      await api(`/admin/messages/${selected._id}/reply`, { method: 'POST', body: replyForm });
      setSelected({ ...selected, replied: true });
      fetchAll();
    } finally { setReplying(false); }
  };

  const filtered = data
    .filter(m => filter === 'all' ? true : filter === 'unread' ? !m.read : m.starred)
    .filter(m => !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()));

  const unread = data.filter(m => !m.read).length;

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display tracking-tight">Inbox Management</h1>
          <p className="text-muted-foreground text-sm mt-2">{data.length} total messages · {unread} unread inquiries</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="inline-flex items-center gap-2 px-5 py-2.5 bg-muted/50 hover:bg-muted text-foreground rounded-xl text-sm font-bold transition-all shadow-sm">
            <CheckCheck className="w-5 h-5" /> Mark All Read
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sender or subject..." 
                 className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm" />
        </div>
        <div className="flex bg-card p-1 rounded-xl border border-border shadow-sm overflow-x-auto hide-scrollbar">
          {(['all', 'unread', 'starred'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} 
                    className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all whitespace-nowrap ${filter === f ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((m) => (
          <div key={m._id} onClick={() => openMessage(m)} 
               className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 group ${!m.read ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-card border-border hover:border-primary/30'} flex flex-col sm:flex-row gap-4 items-start sm:items-center`}>
            
            <button onClick={(e) => { e.stopPropagation(); toggleStar(m._id); }} className="flex-shrink-0 mt-1 sm:mt-0 p-1 hover:bg-muted rounded-full transition-colors">
              <Star className={`w-5 h-5 ${m.starred ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground group-hover:text-yellow-500/50'}`} />
            </button>
            
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-base font-bold truncate ${!m.read ? 'text-foreground' : 'text-muted-foreground'}`}>{m.name}</span>
                <span className="text-sm text-muted-foreground opacity-60 truncate hidden sm:inline-block">&lt;{m.email}&gt;</span>
                {m.replied && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-green-500/10 text-green-500 ml-2">Replied</span>}
              </div>
              <p className={`text-sm truncate mb-0.5 ${!m.read ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>{m.subject || 'No Subject Provided'}</p>
              <p className="text-sm text-muted-foreground truncate opacity-70">{m.message}</p>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0 self-end sm:self-center w-full sm:w-auto justify-end mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mr-auto sm:mr-4"><Clock className="w-3.5 h-3.5" />{new Date(m.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}</span>
              
              <button onClick={(e) => { e.stopPropagation(); toggleRead(m._id); }} className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors" title={m.read ? 'Mark as unread' : 'Mark as read'}>
                {m.read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4 text-primary" />}
              </button>
              <button onClick={(e) => { e.stopPropagation(); deleteItem(m._id); }} className="p-2 rounded-xl hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-border rounded-3xl bg-card/50">
            <h3 className="text-xl font-bold text-foreground mb-2">Inbox Empty</h3>
            <p className="text-muted-foreground">You have no messages matching the current filters.</p>
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200" onClick={() => setSelected(null)}>
          <div className="bg-card border border-border shadow-2xl rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20">
              <h2 className="text-xl font-black truncate pr-4">{selected.subject || 'No Subject'}</h2>
              <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="overflow-y-auto p-6 flex-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/50">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-primary-foreground text-lg font-black shadow-inner flex-shrink-0">
                  {selected.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-base text-foreground">{selected.name}</p>
                  <p className="text-sm text-muted-foreground">
                    <a href={`mailto:${selected.email}`} className="text-primary hover:underline">{selected.email}</a> 
                    <span className="mx-2 opacity-30">•</span> 
                    {new Date(selected.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
              </div>
              
              <div className="bg-muted/30 rounded-2xl p-6 text-foreground text-sm leading-relaxed whitespace-pre-line mb-8 border border-border/50">
                {selected.message}
              </div>

              {selected.replied ? (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-start gap-3">
                  <CheckCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-green-600 dark:text-green-400">Response Sent</p>
                    <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-1">
                      You replied to this message on {selected.repliedAt ? new Date(selected.repliedAt).toLocaleString() : 'Unknown'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="border border-border rounded-2xl overflow-hidden bg-background">
                  <div className="bg-muted/50 p-3 border-b border-border flex items-center gap-2">
                    <Reply className="w-4 h-4 text-muted-foreground" />
                    <h3 className="text-sm font-bold text-foreground">Draft Reply</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Subject</label>
                      <input value={replyForm.subject} onChange={e => setReplyForm({...replyForm, subject: e.target.value})} className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Message</label>
                      <textarea value={replyForm.body} onChange={e => setReplyForm({...replyForm, body: e.target.value})} rows={5} placeholder="Write your response here..." className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none leading-relaxed" />
                    </div>
                    <div className="flex justify-end pt-2">
                      <button onClick={sendReply} disabled={replying || !replyForm.body} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2">
                        {replying ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Reply className="w-4 h-4" /> Send Reply</>}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
