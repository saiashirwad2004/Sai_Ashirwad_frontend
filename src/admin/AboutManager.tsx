import { useState, useEffect } from 'react';
import api, { uploadApi } from '@/services/api';
import useAdminData from '@/hooks/useAdminData';
import { Save, Loader2, User, Zap, GraduationCap, Plus, Pencil, Trash2, X, Briefcase, Award, Heart, Users, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

/* ── Types ─────────────────────────────────────────────── */
interface AboutConfig {
  ownerName: string; ownerTitle: string; ownerBio: string; email: string; phone: string; location: string; resumeUrl: string;
  aboutDescription: string; aboutImage: { url: string; publicId: string };
}
interface Skill { _id: string; name: string; level: number; category: string; icon: string; order: number; }
interface Experience { _id: string; title: string; organization: string; period: string; description: string; type: string; location: string; current: boolean; order: number; }

const skillCats = ['frontend', 'backend', 'database', 'tools', 'other'];
const expTypes = ['work', 'education', 'certification', 'volunteer', 'mentorship'];
const typeIcons: Record<string, typeof Briefcase> = { work: Briefcase, education: GraduationCap, certification: Award, volunteer: Heart, mentorship: Users };

export default function AboutManager() {
  /* ── About Config ──────────────────────────────────────── */
  const [config, setConfig] = useState<AboutConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [configSaving, setConfigSaving] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => {
    api<{ data: AboutConfig }>('/admin/settings').then(r => setConfig(r.data)).catch(console.error).finally(() => setConfigLoading(false));
  }, []);

  const saveConfig = async () => {
    if (!config) return;
    setConfigSaving(true); setConfigSaved(false);
    try { const res = await api<{ data: AboutConfig }>('/admin/settings', { method: 'PUT', body: config }); setConfig(res.data); setConfigSaved(true); setTimeout(() => setConfigSaved(false), 3000); } finally { setConfigSaving(false); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const fd = new FormData(); fd.append('image', file); fd.append('folder', 'about');
    try {
      const res = await uploadApi.uploadImage(fd) as any;
      if (res.success && res.file) {
        setConfig((prev) => prev ? { ...prev, aboutImage: { url: res.file.url, publicId: res.file.publicId } } : prev);
        toast.success("Image uploaded!");
      }
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingResume(true);
    const fd = new FormData(); fd.append('file', file); fd.append('folder', 'resumes');
    try {
      const res = await uploadApi.uploadFile(fd) as any;
      if (res.success && res.file) {
        setConfig((prev) => prev ? { ...prev, resumeUrl: res.file.url } : prev);
        toast.success("Resume uploaded!");
      }
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploadingResume(false);
    }
  };

  /* ── Skills ────────────────────────────────────────────── */
  const skills = useAdminData<Skill>('skills');
  const [skillForm, setSkillForm] = useState({ name: '', level: 50, category: 'frontend', icon: '' });
  const [skillEditId, setSkillEditId] = useState<string | null>(null);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [skillSaving, setSkillSaving] = useState(false);

  const openSkillCreate = (cat?: string) => { setSkillForm({ name: '', level: 50, category: cat || 'frontend', icon: '' }); setSkillEditId(null); setShowSkillForm(true); };
  const openSkillEdit = (s: Skill) => { setSkillForm({ name: s.name, level: s.level, category: s.category, icon: s.icon || '' }); setSkillEditId(s._id); setShowSkillForm(true); };
  const saveSkill = async () => { setSkillSaving(true); try { if (skillEditId) await skills.updateItem(skillEditId, skillForm); else await skills.createItem(skillForm); setShowSkillForm(false); } finally { setSkillSaving(false); } };

  /* ── Experience ─────────────────────────────────────────── */
  const experience = useAdminData<Experience>('experience');
  const [expForm, setExpForm] = useState({ title: '', organization: '', period: '', description: '', type: 'work', location: '', current: false });
  const [expEditId, setExpEditId] = useState<string | null>(null);
  const [showExpForm, setShowExpForm] = useState(false);
  const [expSaving, setExpSaving] = useState(false);

  const openExpCreate = (type?: string) => { setExpForm({ title: '', organization: '', period: '', description: '', type: type || 'work', location: '', current: false }); setExpEditId(null); setShowExpForm(true); };
  const openExpEdit = (e: Experience) => { setExpForm({ title: e.title, organization: e.organization, period: e.period, description: e.description || '', type: e.type, location: e.location || '', current: e.current }); setExpEditId(e._id); setShowExpForm(true); };
  const saveExp = async () => { setExpSaving(true); try { if (expEditId) await experience.updateItem(expEditId, expForm); else await experience.createItem(expForm); setShowExpForm(false); } finally { setExpSaving(false); } };

  /* ── Active section ─────────────────────────────────────── */
  const [activeSection, setActiveSection] = useState<'about' | 'skills' | 'experience'>('about');

  if (configLoading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  const sections = [
    { id: 'about' as const, label: 'About Info', icon: User },
    { id: 'skills' as const, label: 'Skills', icon: Zap },
    { id: 'experience' as const, label: 'Experience', icon: GraduationCap },
  ];

  const grouped = skillCats.reduce((acc, cat) => { acc[cat] = skills.data.filter(s => s.category === cat).sort((a, b) => a.order - b.order); return acc; }, {} as Record<string, Skill[]>);
  const expGrouped = expTypes.reduce((acc, t) => { acc[t] = experience.data.filter(e => e.type === t).sort((a, b) => a.order - b.order); return acc; }, {} as Record<string, Experience[]>);

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display tracking-tight">About Management</h1>
          <p className="text-muted-foreground text-sm mt-2">Manage owner info, skills lineup, and professional experience</p>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-border/50 hide-scrollbar scroll-smooth">
        {sections.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeSection === s.id ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}>
            <s.icon className="w-4 h-4" /> {s.label}
            {s.id === 'skills' && <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeSection === s.id ? 'bg-background/20 text-primary-foreground' : 'bg-muted-foreground/10 text-muted-foreground'}`}>{skills.data.length}</span>}
            {s.id === 'experience' && <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeSection === s.id ? 'bg-background/20 text-primary-foreground' : 'bg-muted-foreground/10 text-muted-foreground'}`}>{experience.data.length}</span>}
          </button>
        ))}
      </div>

      {/* ═══════════════ ABOUT INFO ═══════════════ */}
      {activeSection === 'about' && config && (
        <div className="rounded-3xl bg-card/40 backdrop-blur-xl shadow-xl border border-border p-6 sm:p-8 shadow-sm animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between border-b border-border pb-6 mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2"><User className="w-6 h-6 text-primary" /> Owner Information</h2>
            <button onClick={saveConfig} disabled={configSaving} className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md ${configSaved ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90'} disabled:opacity-50`}>
              {configSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {configSaved ? 'Saved Successfully!' : 'Save Changes'}
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div><label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Full Name</label><input value={config.ownerName || ''} onChange={e => setConfig({ ...config, ownerName: e.target.value })} className="w-full px-4 py-3 bg-background/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all font-bold" /></div>
              <div><label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Title / Role</label><input value={config.ownerTitle || ''} onChange={e => setConfig({ ...config, ownerTitle: e.target.value })} className="w-full px-4 py-3 bg-background/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" /></div>
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Short Bio</label>
              <textarea value={config.ownerBio || ''} onChange={e => setConfig({ ...config, ownerBio: e.target.value })} rows={3} className="w-full px-4 py-3 bg-background/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none leading-relaxed" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div><label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Email</label><input value={config.email || ''} onChange={e => setConfig({ ...config, email: e.target.value })} className="w-full px-4 py-3 bg-background/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" /></div>
              <div><label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Phone</label><input value={config.phone || ''} onChange={e => setConfig({ ...config, phone: e.target.value })} className="w-full px-4 py-3 bg-background/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" /></div>
              <div><label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Location</label><input value={config.location || ''} onChange={e => setConfig({ ...config, location: e.target.value })} className="w-full px-4 py-3 bg-background/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" /></div>
            </div>
            
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Resume (PDF)</label>
              <div className="flex flex-col gap-2">
                <input type="file" id="resumeUpload" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
                <label htmlFor="resumeUpload" className={`flex items-center justify-center gap-2 w-full px-4 py-3 bg-background/40 backdrop-blur-xl shadow-xl border border-dashed hover:border-primary border-border rounded-xl text-sm font-bold cursor-pointer transition-all ${uploadingResume ? 'opacity-50 pointer-events-none' : ''}`}>
                  {uploadingResume ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploadingResume ? 'Uploading...' : 'Upload New Resume'}
                </label>
                {config.resumeUrl && (
                  <div className="mt-2 text-sm text-primary font-medium flex items-center justify-between bg-primary/5 p-3 rounded-lg border border-primary/10">
                    <span className="truncate max-w-xs">{config.resumeUrl.split('/').pop()}</span>
                    <a href={config.resumeUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded-md shadow-sm">View File</a>
                  </div>
                )}
              </div>
            </div>
            <div><label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Detailed About Description</label><textarea value={config.aboutDescription || ''} onChange={e => setConfig({ ...config, aboutDescription: e.target.value })} rows={5} className="w-full px-4 py-3 bg-background/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none leading-relaxed" /></div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">About Image</label>
              <div className="flex gap-4 items-center">
                {config.aboutImage?.url ? (
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-border flex-shrink-0 relative group">
                    <img src={config.aboutImage.url} alt="About preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={() => setConfig({ ...config, aboutImage: { url: '', publicId: '' } })} className="p-1.5 bg-red-500 rounded-lg text-white"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-xl border border-dashed border-border flex items-center justify-center bg-muted/30">
                    <User className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                )}
                <div className="flex-1">
                  <input type="file" id="aboutImageUpload" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <label htmlFor="aboutImageUpload" className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-muted text-foreground border border-border rounded-xl text-sm font-bold cursor-pointer transition-all hover:bg-muted/80 ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                    {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploadingImage ? 'Uploading...' : 'Upload New Image'}
                  </label>
                  <p className="text-xs text-muted-foreground mt-2">Recommended size: 800x800px or larger square image.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ SKILLS ═══════════════ */}
      {activeSection === 'skills' && (
        <div className="space-y-6 animate-in zoom-in-95 duration-300">
          <div className="flex justify-end"><button onClick={() => openSkillCreate()} className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-0.5"><Plus className="w-4 h-4" /> Add Skill</button></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillCats.map(cat => (
              <div key={cat} className="rounded-3xl bg-card/40 backdrop-blur-xl shadow-xl border border-border p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5 border-b border-border pb-3">
                  <h3 className="text-lg font-bold capitalize flex items-center gap-2">
                    {cat} <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{grouped[cat]?.length || 0}</span>
                  </h3>
                  <button onClick={() => openSkillCreate(cat)} className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">+ Add New</button>
                </div>
                
                <div className="space-y-3">
                  {grouped[cat]?.length > 0 ? grouped[cat].map(s => (
                    <div key={s._id} className="flex items-center gap-4 py-3 px-4 rounded-2xl border border-transparent hover:border-border hover:bg-muted/50 transition-all group">
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-bold text-foreground">{s.name}</span>
                          <span className="text-xs font-black text-primary">{s.level}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" style={{ width: `${s.level}%` }} />
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openSkillEdit(s)} className="p-2 rounded-xl hover:bg-background/40 backdrop-blur-xl shadow-xl text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => skills.deleteItem(s._id)} className="p-2 rounded-xl hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  )) : (
                    <div className="py-6 text-center text-muted-foreground text-sm border border-dashed border-border rounded-2xl bg-muted/20">Empty section</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════ EXPERIENCE ═══════════════ */}
      {activeSection === 'experience' && (
        <div className="space-y-6 animate-in zoom-in-95 duration-300">
          <div className="flex justify-end"><button onClick={() => openExpCreate()} className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-0.5"><Plus className="w-4 h-4" /> Add Timeline Entry</button></div>
          
          <div className="space-y-6">
            {expTypes.map(type => {
              const Icon = typeIcons[type]; return (
              <div key={type} className="rounded-3xl bg-card/40 backdrop-blur-xl shadow-xl border border-border p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
                  <h3 className="text-xl font-bold capitalize flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary"><Icon className="w-5 h-5" /></div>
                    {type} <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium ml-2">{expGrouped[type]?.length || 0}</span>
                  </h3>
                  <button onClick={() => openExpCreate(type)} className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">+ Add {type}</button>
                </div>
                
                <div className="space-y-4">
                  {expGrouped[type]?.length > 0 ? expGrouped[type].map(e => (
                    <div key={e._id} className="group relative pl-8 py-2">
                       {/* Timeline visual */}
                      <div className="absolute left-[11px] top-4 bottom-0 w-0.5 bg-border group-last:bottom-auto group-last:h-full" />
                      <div className="absolute left-[7px] top-4 w-2.5 h-2.5 rounded-full bg-primary border-2 border-card shadow-[0_0_0_2px_theme(colors.primary.DEFAULT/0.2)]" />
                      
                      <div className="p-5 rounded-2xl border border-transparent hover:border-border hover:bg-muted/30 transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-base font-bold text-foreground">{e.title}</span>
                            {e.current && <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-green-500/10 text-green-500">Current</span>}
                            <span className="text-xs font-bold text-muted-foreground whitespace-nowrap ml-auto sm:ml-0 bg-muted px-2 py-1 rounded-md">{e.period}</span>
                          </div>
                          <p className="text-sm text-primary font-medium mt-1">{e.organization}</p>
                          {e.location && <p className="text-xs text-muted-foreground mt-1">📍 {e.location}</p>}
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button onClick={() => openExpEdit(e)} className="p-2 rounded-xl bg-background/40 backdrop-blur-xl shadow-xl border border-border hover:bg-muted text-foreground transition-colors"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => experience.deleteItem(e._id)} className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="py-8 text-center text-muted-foreground border-2 border-dashed border-border rounded-2xl bg-muted/20">
                      No {type} entries found
                    </div>
                  )}
                </div>
              </div>
            );})}
          </div>
        </div>
      )}

      {/* ═══════════════ SKILL MODAL ═══════════════ */}
      {showSkillForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200" onClick={() => setShowSkillForm(false)}>
          <div className="bg-card/40 backdrop-blur-xl shadow-xl border border-border shadow-2xl rounded-3xl w-full max-w-md p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black">{skillEditId ? 'Edit Skill' : 'New Skill'}</h2>
              <button onClick={() => setShowSkillForm(false)} className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-5">
              <div><label className="text-sm font-semibold text-foreground mb-1.5 block">Skill Name *</label><input value={skillForm.name} onChange={e => setSkillForm({...skillForm, name: e.target.value})} className="w-full px-5 py-3 bg-background/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all font-bold" /></div>
              <div><label className="text-sm font-semibold text-foreground mb-1.5 block">Category</label><select value={skillForm.category} onChange={e => setSkillForm({...skillForm, category: e.target.value})} className="w-full px-5 py-3 bg-background/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all capitalize">{skillCats.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-3 flex justify-between items-center">Proficiency <span className="font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md">{skillForm.level}%</span></label>
                <input type="range" min={0} max={100} value={skillForm.level} onChange={e => setSkillForm({...skillForm, level: parseInt(e.target.value)})} className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer" />
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t border-border mt-8">
                <button onClick={() => setShowSkillForm(false)} className="px-6 py-3 rounded-xl text-sm font-bold bg-muted hover:bg-muted/80 text-foreground transition-colors">Cancel</button>
                <button onClick={saveSkill} disabled={skillSaving || !skillForm.name} className="px-8 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2">{skillSaving && <Loader2 className="w-4 h-4 animate-spin" />} {skillEditId ? 'Update Skill' : 'Add Skill'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ EXPERIENCE MODAL ═══════════════ */}
      {showExpForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200" onClick={() => setShowExpForm(false)}>
          <div className="bg-card/40 backdrop-blur-xl shadow-xl border border-border shadow-2xl rounded-3xl w-full max-w-lg overflow-y-auto max-h-[90vh] p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black">{expEditId ? 'Edit Entry' : 'New Timeline Entry'}</h2>
              <button onClick={() => setShowExpForm(false)} className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-5">
              <div><label className="text-sm font-semibold text-foreground mb-1.5 block">Title / Role *</label><input value={expForm.title} onChange={e => setExpForm({...expForm, title: e.target.value})} className="w-full px-5 py-3 bg-background/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all font-bold" /></div>
              <div><label className="text-sm font-semibold text-foreground mb-1.5 block">Organization / Company *</label><input value={expForm.organization} onChange={e => setExpForm({...expForm, organization: e.target.value})} className="w-full px-5 py-3 bg-background/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div><label className="text-sm font-semibold text-foreground mb-1.5 block">Type</label><select value={expForm.type} onChange={e => setExpForm({...expForm, type: e.target.value})} className="w-full px-5 py-3 bg-background/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all capitalize">{expTypes.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                <div><label className="text-sm font-semibold text-foreground mb-1.5 block">Period *</label><input value={expForm.period} onChange={e => setExpForm({...expForm, period: e.target.value})} className="w-full px-5 py-3 bg-background/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" placeholder="e.g. 2022 - Present" /></div>
              </div>
              <div><label className="text-sm font-semibold text-foreground mb-1.5 block">Location</label><input value={expForm.location} onChange={e => setExpForm({...expForm, location: e.target.value})} className="w-full px-5 py-3 bg-background/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" /></div>
              <div><label className="text-sm font-semibold text-foreground mb-1.5 block">Description</label><textarea value={expForm.description} onChange={e => setExpForm({...expForm, description: e.target.value})} rows={4} className="w-full px-5 py-3 bg-background/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none leading-relaxed" /></div>
              
              <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-border bg-background/40 backdrop-blur-xl shadow-xl hover:bg-muted/50 transition-colors">
                <div className="relative flex items-center justify-center w-5 h-5 rounded border border-primary bg-background/40 backdrop-blur-xl shadow-xl">
                  <input type="checkbox" checked={expForm.current} onChange={e => setExpForm({...expForm, current: e.target.checked})} className="absolute opacity-0 w-full h-full cursor-pointer peer" />
                  {expForm.current && <div className="w-3 h-3 bg-primary rounded-[2px]" />}
                </div>
                <span className="text-sm font-bold text-foreground">I currently work here / am enrolled here</span>
              </label>
              
              <div className="flex justify-end gap-3 pt-6 border-t border-border mt-8">
                <button onClick={() => setShowExpForm(false)} className="px-6 py-3 rounded-xl text-sm font-bold bg-muted hover:bg-muted/80 text-foreground transition-colors">Cancel</button>
                <button onClick={saveExp} disabled={expSaving || !expForm.title || !expForm.organization || !expForm.period} className="px-8 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2">{expSaving && <Loader2 className="w-4 h-4 animate-spin" />} {expEditId ? 'Save Entry' : 'Add Entry'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
