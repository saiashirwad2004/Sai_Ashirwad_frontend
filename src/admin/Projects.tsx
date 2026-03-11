import { useState } from 'react';
import useAdminData from '@/hooks/useAdminData';
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, StarOff, ExternalLink, Github, X, Loader2, Search, Upload } from 'lucide-react';
import { uploadApi } from '@/services/api';
import toast from 'react-hot-toast';

interface Project {
  _id: string; title: string; slug: string; description: string; longDescription: string;
  image: { url: string }; tags: string[]; category: string; github: string; live: string;
  featured: boolean; published: boolean; order: number; date: string;
}

const emptyForm = { title: '', description: '', longDescription: '', category: 'web', tags: '', github: '', live: '', imageUrl: '' };

export default function Projects() {
  const { data, loading, createItem, updateItem, deleteItem, toggleField } = useAdminData<Project>('projects');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const openCreate = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (p: Project) => {
    setForm({ title: p.title, description: p.description, longDescription: p.longDescription || '', category: p.category || 'web', tags: p.tags.join(', '), github: p.github || '', live: p.live || '', imageUrl: p.image?.url || '' });
    setEditId(p._id); setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { title: form.title, description: form.description, longDescription: form.longDescription, category: form.category, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean), github: form.github, live: form.live, image: { url: form.imageUrl, publicId: '' } };
      if (editId) await updateItem(editId, payload); else await createItem(payload);
      setShowForm(false);
    } finally { setSaving(false); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const fd = new FormData(); fd.append('image', file); fd.append('folder', 'projects');
    try {
      const res = await uploadApi.uploadImage(fd) as any;
      if (res.success && res.file) {
        setForm(prev => ({ ...prev, imageUrl: res.file.url }));
        toast.success("Image uploaded!");
      }
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const filtered = data.filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display tracking-tight">Projects Management</h1>
          <p className="text-muted-foreground text-sm mt-2">{data.length} total · {data.filter(p => p.published).length} published · {data.filter(p => p.featured).length} featured</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95">
          <Plus className="w-5 h-5" /> Add Project
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..." 
               className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm" />
      </div>

      <div className="grid gap-6">
        {filtered.map((p) => (
          <div key={p._id} className="p-5 rounded-3xl bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col xl:flex-row gap-6 group">
            {p.image?.url ? 
              <img src={p.image.url} alt={p.title} className="w-full xl:w-48 h-48 xl:h-auto object-cover rounded-2xl flex-shrink-0 border border-border/50 group-hover:scale-[1.02] transition-transform duration-500" /> 
              : <div className="w-full xl:w-48 h-48 xl:h-auto rounded-2xl bg-muted border border-border flex items-center justify-center flex-shrink-0"><span className="text-muted-foreground text-sm font-medium">No Image</span></div>
            }
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{p.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1.5 leading-relaxed line-clamp-2">{p.description}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 ${p.published ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${p.published ? 'bg-green-500' : 'bg-yellow-500'}`} /> {p.published ? 'Live' : 'Draft'}
                  </span>
                  {p.featured && <span className="text-xs font-bold px-3 py-1 rounded-lg bg-pink-500/10 text-pink-500 flex items-center gap-1.5"><Star className="w-3.5 h-3.5 fill-pink-500" /> Featured</span>}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {p.tags.map(t => <span key={t} className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-medium">{t}</span>)}
              </div>
              
              <div className="flex items-center gap-2 mt-6 flex-wrap">
                <button onClick={() => openEdit(p)} className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl bg-muted/50 hover:bg-primary/10 hover:text-primary text-foreground transition-colors"><Pencil className="w-4 h-4" /> Edit</button>
                <button onClick={() => toggleField(p._id, 'published')} className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl bg-muted/50 hover:bg-muted text-foreground transition-colors">
                  {p.published ? <><EyeOff className="w-4 h-4" /> Unpublish</> : <><Eye className="w-4 h-4" /> Publish</>}
                </button>
                <button onClick={() => toggleField(p._id, 'featured')} className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl bg-muted/50 hover:bg-muted text-foreground transition-colors">
                  {p.featured ? <><StarOff className="w-4 h-4" /> Unfeature</> : <><Star className="w-4 h-4" /> Feature</>}
                </button>
                
                <div className="flex-1 w-full sm:w-auto" />
                
                {p.live && <a href={p.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 transition-colors"><ExternalLink className="w-4 h-4" /> Live Site</a>}
                {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl bg-muted/50 hover:bg-muted text-foreground transition-colors"><Github className="w-4 h-4" /> Code</a>}
                <button onClick={() => setDeleteId(p._id)} className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors sm:ml-2"><Trash2 className="w-4 h-4" /> Delete</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-border rounded-3xl bg-card/50">
            <h3 className="text-xl font-bold text-foreground mb-2">No projects found</h3>
            <p className="text-muted-foreground">Try adjusting your search query, or add a new project.</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200" onClick={() => setShowForm(false)}>
          <div className="bg-card border border-border shadow-2xl rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black">{editId ? 'Edit Project' : 'New Project'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-5">
              <div><label className="text-sm font-semibold text-foreground mb-1.5 block">Title *</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-5 py-3 bg-background border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" /></div>
              <div><label className="text-sm font-semibold text-foreground mb-1.5 block">Short Description *</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} className="w-full px-5 py-3 bg-background border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none" /></div>
              <div><label className="text-sm font-semibold text-foreground mb-1.5 block">Long Description</label><textarea value={form.longDescription} onChange={e => setForm({...form, longDescription: e.target.value})} rows={4} className="w-full px-5 py-3 bg-background border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div><label className="text-sm font-semibold text-foreground mb-1.5 block">Category</label><input value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-5 py-3 bg-background border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" /></div>
                <div><label className="text-sm font-semibold text-foreground mb-1.5 block">Tags (comma separated)</label><input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} className="w-full px-5 py-3 bg-background border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" placeholder="React, Node.js, MongoDB" /></div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Project Cover Image</label>
                <div className="flex gap-4 items-center">
                  {form.imageUrl ? (
                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-border flex-shrink-0 relative group">
                      <img src={form.imageUrl} alt="Project preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button onClick={() => setForm(prev => ({ ...prev, imageUrl: '' }))} className="p-1.5 bg-red-500 rounded-lg text-white"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-xl border border-dashed border-border flex items-center justify-center bg-muted/30">
                      <Upload className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input type="file" id="projectImageUpload" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    <label htmlFor="projectImageUpload" className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-muted text-foreground border border-border rounded-xl text-sm font-bold cursor-pointer transition-all hover:bg-muted/80 ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                      {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      {uploadingImage ? 'Uploading...' : 'Upload Image'}
                    </label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div><label className="text-sm font-semibold text-foreground mb-1.5 block">GitHub URL</label><input value={form.github} onChange={e => setForm({...form, github: e.target.value})} className="w-full px-5 py-3 bg-background border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" /></div>
                <div><label className="text-sm font-semibold text-foreground mb-1.5 block">Live URL</label><input value={form.live} onChange={e => setForm({...form, live: e.target.value})} className="w-full px-5 py-3 bg-background border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" /></div>
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t border-border mt-8">
                <button onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl text-sm font-bold bg-muted hover:bg-muted/80 text-foreground transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={saving || !form.title || !form.description} className="px-8 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />} {editId ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-[60] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200" onClick={() => setDeleteId(null)}>
          <div className="bg-card border border-border shadow-2xl rounded-3xl p-8 max-w-sm w-full text-center" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
               <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Delete Project?</h3>
            <p className="text-muted-foreground text-sm mb-8">This action cannot be undone. Are you sure you want to permanently delete this project?</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => { deleteItem(deleteId); setDeleteId(null); }} className="w-full py-3 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">Yes, Delete Project</button>
              <button onClick={() => setDeleteId(null)} className="w-full py-3 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-sm font-bold transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
