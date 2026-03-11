import { useState } from 'react';
import useAdminData from '@/hooks/useAdminData';
import { Plus, Pencil, Trash2, CheckCircle, XCircle, Star, StarOff, X, Loader2 } from 'lucide-react';

interface Testimonial { _id: string; name: string; role: string; company: string; content: string; avatar: { url: string }; rating: number; approved: boolean; featured: boolean; createdAt: string; }
const emptyForm = { name: '', role: '', company: '', content: '', rating: 5 };

export default function Testimonials() {
  const { data, loading, createItem, updateItem, deleteItem, toggleField } = useAdminData<Testimonial>('testimonials');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  const openCreate = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (t: Testimonial) => { setForm({ name: t.name, role: t.role || '', company: t.company || '', content: t.content, rating: t.rating }); setEditId(t._id); setShowForm(true); };
  const handleSave = async () => { setSaving(true); try { if (editId) await updateItem(editId, form); else await createItem({ ...form, approved: true }); setShowForm(false); } finally { setSaving(false); } };

  const filtered = data.filter(t => filter === 'all' ? true : filter === 'pending' ? !t.approved : t.approved);
  const pending = data.filter(t => !t.approved).length;

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display tracking-tight">Testimonials Hub</h1>
          <p className="text-muted-foreground text-sm mt-2">{data.filter(t => t.approved).length} approved reviews · {pending} pending review</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95">
          <Plus className="w-5 h-5" /> Add Testimonial
        </button>
      </div>

      <div className="flex gap-2 p-1 bg-card/40 backdrop-blur-xl shadow-xl border border-border rounded-xl shadow-sm w-max">
        {(['all', 'pending', 'approved'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold capitalize transition-all whitespace-nowrap inline-flex items-center gap-2 ${filter === f ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}>
            {f} 
            {f === 'pending' && pending > 0 && <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${filter === f ? 'bg-background/20 text-primary-foreground' : 'bg-yellow-500/10 text-yellow-500'}`}>{pending} New</span>}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => (
          <div key={t._id} className={`p-6 rounded-3xl bg-card/40 backdrop-blur-xl shadow-xl border shadow-sm transition-all duration-300 group flex flex-col ${!t.approved ? 'border-yellow-500/30' : t.featured ? 'border-primary/30 shadow-primary/5' : 'border-border hover:border-primary/30'}`}>
            <div className="flex items-start justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black shadow-inner flex-shrink-0 ${t.featured ? 'bg-gradient-to-br from-primary to-purple-500 text-primary-foreground' : 'bg-muted text-foreground'}`}>
                  {t.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-base text-foreground line-clamp-1">{t.name}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">{[t.role, t.company].filter(Boolean).join(' at ')}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 mb-4">
              {[1,2,3,4,5].map(i => <Star key={i} className={`w-4 h-4 ${i <= t.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />)}
            </div>

            <p className="text-foreground/80 text-sm leading-relaxed mb-6 flex-1 italic">"{t.content}"</p>
            
            <div className="flex items-center gap-2 flex-wrap border-t border-border pt-4 mt-auto">
              <button onClick={() => toggleField(t._id, 'approved')} className={`inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl transition-colors ${t.approved ? 'hover:bg-yellow-500/10 text-green-500 hover:text-yellow-500' : 'bg-green-500/10 hover:bg-green-500/20 text-green-500'}`}>
                {t.approved ? <><XCircle className="w-4 h-4" /> Reject</> : <><CheckCircle className="w-4 h-4" /> Approve</>}
              </button>
              
              {t.approved && (
                <button onClick={() => toggleField(t._id, 'featured')} className={`inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl transition-colors ${t.featured ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}>
                  {t.featured ? <><StarOff className="w-4 h-4" /> Unfeature</> : <><Star className="w-4 h-4" /> Feature</>}
                </button>
              )}
              
              <button onClick={() => openEdit(t)} className="p-2 rounded-xl bg-muted/50 hover:bg-primary/10 hover:text-primary text-foreground transition-colors ml-auto"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => deleteItem(t._id)} className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
            
            {!t.approved && (
              <div className="absolute top-4 right-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md">Pending</div>
            )}
            {t.featured && t.approved && (
               <div className="absolute top-4 right-4 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md">Featured</div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-border rounded-3xl bg-card/40 backdrop-blur-xl shadow-xl col-span-full">
            <h3 className="text-xl font-bold text-foreground mb-2">No testimonials found</h3>
            <p className="text-muted-foreground">Try changing your filters or adding a new testimonial.</p>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200" onClick={() => setShowForm(false)}>
          <div className="bg-card/40 backdrop-blur-xl shadow-xl border border-border shadow-2xl rounded-3xl w-full max-w-lg overflow-y-auto max-h-[90vh] p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black">{editId ? 'Edit Testimonial' : 'New Testimonial'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-5">
              <div><label className="text-sm font-semibold text-foreground mb-1.5 block">Client Name *</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-5 py-3 bg-background/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div><label className="text-sm font-semibold text-foreground mb-1.5 block">Job Role</label><input value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full px-5 py-3 bg-background/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" /></div>
                <div><label className="text-sm font-semibold text-foreground mb-1.5 block">Company</label><input value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="w-full px-5 py-3 bg-background/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" /></div>
              </div>
              <div><label className="text-sm font-semibold text-foreground mb-1.5 block">Testimonial Content *</label><textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={5} className="w-full px-5 py-3 bg-background/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none leading-relaxed" /></div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-3 flex items-center justify-between">Rating <span className="text-primary font-black bg-primary/10 px-2 py-0.5 rounded-md">{form.rating} / 5</span></label>
                <input type="range" min={1} max={5} value={form.rating} onChange={e => setForm({...form, rating: parseInt(e.target.value)})} className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer" />
                <div className="flex justify-between text-xs text-muted-foreground mt-2 font-bold px-1"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span></div>
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t border-border mt-8">
                <button onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl text-sm font-bold bg-muted hover:bg-muted/80 text-foreground transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={saving || !form.name || !form.content} className="px-8 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />} {editId ? 'Save Changes' : 'Add Testimonial'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
