import { useState } from 'react';
import useAdminData from '@/hooks/useAdminData';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, Loader2 } from 'lucide-react';

interface Service { _id: string; title: string; description: string; icon: string; category: string; features: string[]; isActive: boolean; order: number; }
const emptyForm = { title: '', description: '', icon: 'Code2', category: 'general', features: '' };

export default function Services() {
  const { data, loading, createItem, updateItem, deleteItem, toggleField } = useAdminData<Service>('services');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const openCreate = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (s: Service) => { setForm({ title: s.title, description: s.description, icon: s.icon || 'Code2', category: s.category || 'general', features: s.features?.join('\n') || '' }); setEditId(s._id); setShowForm(true); };
  const handleSave = async () => {
    setSaving(true);
    try { const payload = { ...form, features: form.features.split('\n').map(f => f.trim()).filter(Boolean) }; if (editId) await updateItem(editId, payload); else await createItem(payload); setShowForm(false); } finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display tracking-tight">Services Management</h1>
          <p className="text-muted-foreground text-sm mt-2">{data.filter(s => s.isActive).length} active out of {data.length} total services</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95">
          <Plus className="w-5 h-5" /> Add Service
        </button>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((s) => (
          <div key={s._id} className={`p-6 rounded-3xl bg-card border shadow-sm transition-all duration-300 group flex flex-col ${s.isActive ? 'border-border hover:shadow-xl hover:border-primary/30' : 'border-border opacity-60 grayscale-[50%]'}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <span className="font-bold text-xs uppercase tracking-wider">{s.icon || 'ICN'}</span>
              </div>
              <button onClick={() => toggleField(s._id, 'active')} title={s.isActive ? 'Deactivate' : 'Activate'} className="hover:scale-110 transition-transform">
                {s.isActive ? <ToggleRight className="w-8 h-8 text-green-500" /> : <ToggleLeft className="w-8 h-8 text-muted-foreground" />}
              </button>
            </div>
            
            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{s.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">{s.description}</p>
            
            {s.features?.length > 0 && (
              <div className="mb-6 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 border-b border-border/50 pb-2">Features</p>
                <ul className="text-sm text-foreground/80 space-y-2">
                  {s.features.slice(0, 3).map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span className="line-clamp-1">{f}</span>
                    </li>
                  ))}
                  {s.features.length > 3 && (
                    <li className="text-xs text-muted-foreground italic pl-3.5">+ {s.features.length - 3} more...</li>
                  )}
                </ul>
              </div>
            )}
            
            <div className="flex items-center gap-3 border-t border-border pt-4 mt-auto">
              <button onClick={() => openEdit(s)} className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl bg-muted/50 hover:bg-primary/10 hover:text-primary text-foreground transition-colors"><Pencil className="w-4 h-4" /> Edit</button>
              <button onClick={() => deleteItem(s._id)} className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors ml-auto"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-border rounded-3xl bg-card/50 col-span-full">
            <h3 className="text-xl font-bold text-foreground mb-2">No services offered</h3>
            <p className="text-muted-foreground">Add your first service listing to get started.</p>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200" onClick={() => setShowForm(false)}>
          <div className="bg-card border border-border shadow-2xl rounded-3xl w-full max-w-lg overflow-y-auto max-h-[90vh] p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black">{editId ? 'Edit Service' : 'New Service'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-5">
              <div><label className="text-sm font-semibold text-foreground mb-1.5 block">Service Title *</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-5 py-3 bg-background border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" /></div>
              <div><label className="text-sm font-semibold text-foreground mb-1.5 block">Description *</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full px-5 py-3 bg-background border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none leading-relaxed" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div><label className="text-sm font-semibold text-foreground mb-1.5 block">Icon Name (Lucide)</label><input value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className="w-full px-5 py-3 bg-background border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" /></div>
                <div><label className="text-sm font-semibold text-foreground mb-1.5 block">Category</label><input value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-5 py-3 bg-background border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" /></div>
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Features <span className="text-muted-foreground text-xs font-normal ml-2">(One feature per line)</span></label>
                <textarea value={form.features} onChange={e => setForm({...form, features: e.target.value})} rows={5} className="w-full px-5 py-3 bg-background border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none leading-relaxed" placeholder="Feature 1&#10;Feature 2&#10;Feature 3" />
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t border-border mt-8">
                <button onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl text-sm font-bold bg-muted hover:bg-muted/80 text-foreground transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={saving || !form.title || !form.description} className="px-8 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />} {editId ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
