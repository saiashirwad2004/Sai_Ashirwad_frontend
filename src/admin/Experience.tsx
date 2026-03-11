import { useState } from 'react';
import useAdminData from '@/hooks/useAdminData';
import { Plus, Pencil, Trash2, X, Loader2, Briefcase, GraduationCap, Award, Heart } from 'lucide-react';

interface Experience { _id: string; title: string; organization: string; period: string; description: string; type: string; location: string; current: boolean; order: number; }
const types = ['work', 'education', 'certification', 'volunteer'];
const typeIcons: Record<string, typeof Briefcase> = { work: Briefcase, education: GraduationCap, certification: Award, volunteer: Heart };
const typeColors: Record<string, string> = { work: 'blue', education: 'purple', certification: 'green', volunteer: 'pink' };
const emptyForm = { title: '', organization: '', period: '', description: '', type: 'work', location: '', current: false };

export default function ExperiencePage() {
  const { data, loading, createItem, updateItem, deleteItem } = useAdminData<Experience>('experience');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const openCreate = (type?: string) => { setForm({ ...emptyForm, type: type || 'work' }); setEditId(null); setShowForm(true); };
  const openEdit = (e: Experience) => { setForm({ title: e.title, organization: e.organization, period: e.period, description: e.description || '', type: e.type, location: e.location || '', current: e.current }); setEditId(e._id); setShowForm(true); };
  const handleSave = async () => { setSaving(true); try { if (editId) await updateItem(editId, form); else await createItem(form); setShowForm(false); } finally { setSaving(false); } };

  const grouped = types.reduce((acc, t) => { acc[t] = data.filter(e => e.type === t).sort((a, b) => a.order - b.order); return acc; }, {} as Record<string, Experience[]>);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold font-display">Experience</h1><p className="text-gray-400 text-sm mt-1">{data.length} entries</p></div>
        <button onClick={() => openCreate()} className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600"><Plus className="w-4 h-4" /> Add Entry</button>
      </div>

      {types.map((type) => {
        const Icon = typeIcons[type];
        return (
          <div key={type} className="rounded-2xl bg-[#111827] border border-white/5 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold capitalize flex items-center gap-2"><Icon className="w-4 h-4" /> {type} <span className="text-xs text-gray-500 font-normal">({grouped[type]?.length || 0})</span></h2>
              <button onClick={() => openCreate(type)} className="text-xs text-blue-400 hover:text-blue-300">+ Add</button>
            </div>
            {grouped[type]?.length ? (
              <div className="space-y-3">
                {grouped[type].map((e) => (
                  <div key={e._id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                    <div className={`w-2 h-2 rounded-full bg-${typeColors[type]}-400 mt-2 flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2"><h3 className="font-medium text-sm">{e.title}</h3>{e.current && <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">Current</span>}</div>
                      <p className="text-sm text-gray-400">{e.organization}{e.location ? ` · ${e.location}` : ''}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{e.period}</p>
                      {e.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{e.description}</p>}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button onClick={() => openEdit(e)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => deleteItem(e._id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-600 text-sm text-center py-4">No {type} entries</p>}
          </div>
        );
      })}

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6"><h2 className="text-lg font-bold">{editId ? 'Edit' : 'New'} Entry</h2><button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400"><X className="w-5 h-5" /></button></div>
            <div className="space-y-4">
              <div><label className="text-sm text-gray-400 mb-1 block">Title *</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-white/10 rounded-xl text-sm focus:border-blue-500/50 focus:outline-none" placeholder="Software Engineer" /></div>
              <div><label className="text-sm text-gray-400 mb-1 block">Organization *</label><input value={form.organization} onChange={e => setForm({...form, organization: e.target.value})} className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-white/10 rounded-xl text-sm focus:border-blue-500/50 focus:outline-none" placeholder="Google" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-gray-400 mb-1 block">Type</label><select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-white/10 rounded-xl text-sm focus:border-blue-500/50 focus:outline-none">{types.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                <div><label className="text-sm text-gray-400 mb-1 block">Period *</label><input value={form.period} onChange={e => setForm({...form, period: e.target.value})} className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-white/10 rounded-xl text-sm focus:border-blue-500/50 focus:outline-none" placeholder="2022 - Present" /></div>
              </div>
              <div><label className="text-sm text-gray-400 mb-1 block">Location</label><input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-white/10 rounded-xl text-sm focus:border-blue-500/50 focus:outline-none" /></div>
              <div><label className="text-sm text-gray-400 mb-1 block">Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-white/10 rounded-xl text-sm focus:border-blue-500/50 focus:outline-none resize-none" /></div>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.current} onChange={e => setForm({...form, current: e.target.checked})} className="rounded accent-blue-500" /><span className="text-sm text-gray-400">Currently here</span></label>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl text-sm border border-white/10 hover:bg-white/5">Cancel</button>
                <button onClick={handleSave} disabled={saving || !form.title || !form.organization || !form.period} className="px-6 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 disabled:opacity-50 inline-flex items-center gap-2">{saving && <Loader2 className="w-4 h-4 animate-spin" />} {editId ? 'Update' : 'Create'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
