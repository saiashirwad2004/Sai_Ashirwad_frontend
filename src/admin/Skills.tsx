import { useState } from 'react';
import useAdminData from '@/hooks/useAdminData';
import { Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react';

interface Skill { _id: string; name: string; level: number; category: string; icon: string; order: number; }
const categories = ['frontend', 'backend', 'database', 'tools', 'other'];
const emptyForm = { name: '', level: 50, category: 'frontend', icon: '' };

export default function Skills() {
  const { data, loading, createItem, updateItem, deleteItem } = useAdminData<Skill>('skills');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const openCreate = (cat?: string) => { setForm({ ...emptyForm, category: cat || 'frontend' }); setEditId(null); setShowForm(true); };
  const openEdit = (s: Skill) => { setForm({ name: s.name, level: s.level, category: s.category, icon: s.icon || '' }); setEditId(s._id); setShowForm(true); };
  const handleSave = async () => {
    setSaving(true);
    try { if (editId) await updateItem(editId, form); else await createItem(form); setShowForm(false); } finally { setSaving(false); }
  };

  const grouped = categories.reduce((acc, cat) => { acc[cat] = data.filter(s => s.category === cat).sort((a, b) => a.order - b.order); return acc; }, {} as Record<string, Skill[]>);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  const catColors: Record<string, string> = { frontend: 'blue', backend: 'green', database: 'purple', tools: 'orange', other: 'gray' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold font-display">Skills</h1><p className="text-gray-400 text-sm mt-1">{data.length} skills across {categories.length} categories</p></div>
        <button onClick={() => openCreate()} className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600"><Plus className="w-4 h-4" /> Add Skill</button>
      </div>

      {categories.map((cat) => (
        <div key={cat} className="rounded-2xl bg-[#111827] border border-white/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold capitalize flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full bg-${catColors[cat]}-400`} /> {cat}
              <span className="text-xs text-gray-500 font-normal">({grouped[cat]?.length || 0})</span>
            </h2>
            <button onClick={() => openCreate(cat)} className="text-xs text-blue-400 hover:text-blue-300">+ Add</button>
          </div>
          {grouped[cat]?.length ? (
            <div className="space-y-3">
              {grouped[cat].map((s) => (
                <div key={s._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium">{s.name}</span>
                      <span className="text-xs text-gray-400">{s.level}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full bg-${catColors[cat]}-500 transition-all`} style={{ width: `${s.level}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => deleteItem(s._id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm text-center py-4">No skills in this category</p>
          )}
        </div>
      ))}

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6"><h2 className="text-lg font-bold">{editId ? 'Edit' : 'New'} Skill</h2><button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400"><X className="w-5 h-5" /></button></div>
            <div className="space-y-4">
              <div><label className="text-sm text-gray-400 mb-1 block">Name *</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-white/10 rounded-xl text-sm focus:border-blue-500/50 focus:outline-none" /></div>
              <div><label className="text-sm text-gray-400 mb-1 block">Category</label><select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-white/10 rounded-xl text-sm focus:border-blue-500/50 focus:outline-none">{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <div><label className="text-sm text-gray-400 mb-1 block">Proficiency Level: {form.level}%</label><input type="range" min={0} max={100} value={form.level} onChange={e => setForm({...form, level: parseInt(e.target.value)})} className="w-full accent-blue-500" /></div>
              <div><label className="text-sm text-gray-400 mb-1 block">Icon (optional)</label><input value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-white/10 rounded-xl text-sm focus:border-blue-500/50 focus:outline-none" placeholder="Lucide icon name" /></div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl text-sm border border-white/10 hover:bg-white/5">Cancel</button>
                <button onClick={handleSave} disabled={saving || !form.name} className="px-6 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 disabled:opacity-50 inline-flex items-center gap-2">{saving && <Loader2 className="w-4 h-4 animate-spin" />} {editId ? 'Update' : 'Create'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
