import { useState, useEffect } from 'react';
import { Save, Loader2, Sparkles, Plus, Trash2, GripVertical, Upload, User } from 'lucide-react';
import api, { uploadApi } from '@/services/api';
import toast from 'react-hot-toast';

interface HeroConfig {
  heroHeading: string; heroSubtitle: string; heroDescription: string;
  heroCTA: { primary: { text: string; link: string }; secondary: { text: string; link: string } };
  ownerImage: { url: string; publicId: string };
  stats: { number: string; label: string }[];
}

export default function HeroManager() {
  const [config, setConfig] = useState<HeroConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    api<{ data: HeroConfig }>('/admin/settings').then(r => setConfig(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true); setSaved(false);
    try {
      const res = await api<{ data: HeroConfig }>('/admin/settings', { method: 'PUT', body: config });
      setConfig(res.data); setSaved(true); setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !config) return;
    setUploadingImage(true);
    const fd = new FormData(); fd.append('image', file); fd.append('folder', 'hero');
    try {
      const res = await uploadApi.uploadImage(fd) as any;
      if (res.success && res.file) {
        update('ownerImage', { url: res.file.url, publicId: res.file.publicId });
        toast.success("Hero image uploaded!");
      }
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const update = (path: string, value: unknown) => {
    if (!config) return;
    const keys = path.split('.');
    const updated = { ...config };
    let obj: Record<string, unknown> = updated;
    for (let i = 0; i < keys.length - 1; i++) { obj[keys[i]] = { ...(obj[keys[i]] as Record<string, unknown>) }; obj = obj[keys[i]] as Record<string, unknown>; }
    obj[keys[keys.length - 1]] = value;
    setConfig(updated as HeroConfig);
  };

  const addStat = () => { if (!config) return; setConfig({ ...config, stats: [...(config.stats || []), { number: '', label: '' }] }); };
  const removeStat = (i: number) => { if (!config) return; const s = [...(config.stats || [])]; s.splice(i, 1); setConfig({ ...config, stats: s }); };
  const updateStat = (i: number, field: 'number' | 'label', value: string) => {
    if (!config) return; const s = [...(config.stats || [])]; s[i] = { ...s[i], [field]: value }; setConfig({ ...config, stats: s });
  };

  if (loading || !config) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display tracking-tight flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" /> Hero Section
          </h1>
          <p className="text-muted-foreground text-sm mt-2">Manage the landing hero banner of your site</p>
        </div>
        <button onClick={handleSave} disabled={saving} className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 ${saved ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90'}`}>
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} {saved ? 'Saved Successfully!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hero Text */}
        <div className="rounded-3xl bg-card/40 backdrop-blur-xl shadow-xl border border-border p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-black text-sm">H</span>
            </div>
            <h2 className="text-lg font-bold text-foreground">Content Strategy</h2>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Heading</label>
              <input value={config.heroHeading || ''} onChange={e => update('heroHeading', e.target.value)} className="w-full px-4 py-3 bg-background/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all font-bold text-foreground" placeholder="Hi, I'm Anand" />
            </div>
            <div>
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Subtitle</label>
              <input value={config.heroSubtitle || ''} onChange={e => update('heroSubtitle', e.target.value)} className="w-full px-4 py-3 bg-background/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-foreground" placeholder="I build pixel-perfect, award-winning..." />
            </div>
            <div>
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Description</label>
              <textarea value={config.heroDescription || ''} onChange={e => update('heroDescription', e.target.value)} rows={4} className="w-full px-4 py-3 bg-background/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none leading-relaxed text-foreground" />
            </div>
            
            <div className="pt-4 border-t border-border">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Hero Image</label>
              <div className="flex gap-4 items-center">
                {config.ownerImage?.url ? (
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-border flex-shrink-0 relative group">
                    <img src={config.ownerImage.url} alt="Hero preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={() => update('ownerImage', { url: '', publicId: '' })} className="p-1.5 bg-red-500 rounded-lg text-white"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-xl border border-dashed border-border flex items-center justify-center bg-muted/30">
                    <User className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                )}
                <div className="flex-1">
                  <input type="file" id="heroImageUpload" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <label htmlFor="heroImageUpload" className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-muted text-foreground border border-border rounded-xl text-sm font-bold cursor-pointer transition-all hover:bg-muted/80 ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                    {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploadingImage ? 'Uploading...' : 'Upload Image'}
                  </label>
                  <p className="text-xs text-muted-foreground mt-2">Recommended: transparent PNG or neat profile picture.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* CTAs */}
          <div className="rounded-3xl bg-card/40 backdrop-blur-xl shadow-xl border border-border p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-black text-sm">C</span>
              </div>
              <h2 className="text-lg font-bold text-foreground">Action Buttons</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              <div className="space-y-4">
                <div><label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Primary Text</label><input value={config.heroCTA?.primary?.text || ''} onChange={e => update('heroCTA.primary.text', e.target.value)} className="w-full px-4 py-2.5 bg-background/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" /></div>
                <div><label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Primary Link</label><input value={config.heroCTA?.primary?.link || ''} onChange={e => update('heroCTA.primary.link', e.target.value)} className="w-full px-4 py-2.5 bg-background/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" /></div>
              </div>
              <div className="space-y-4">
                <div><label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Secondary Text</label><input value={config.heroCTA?.secondary?.text || ''} onChange={e => update('heroCTA.secondary.text', e.target.value)} className="w-full px-4 py-2.5 bg-background/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" /></div>
                <div><label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Secondary Link</label><input value={config.heroCTA?.secondary?.link || ''} onChange={e => update('heroCTA.secondary.link', e.target.value)} className="w-full px-4 py-2.5 bg-background/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" /></div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-4 border-t border-border mt-4">
              <div className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold text-center shadow-lg shadow-primary/20">{config.heroCTA?.primary?.text || 'Primary Action'}</div>
              <div className="flex-1 px-6 py-3 border border-border text-foreground hover:bg-muted rounded-xl text-sm font-bold text-center transition-colors">{config.heroCTA?.secondary?.text || 'Secondary Action'}</div>
            </div>
          </div>

          {/* Stats */}
          <div className="rounded-3xl bg-card/40 backdrop-blur-xl shadow-xl border border-border p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-black text-sm">S</span>
                </div>
                <h2 className="text-lg font-bold text-foreground">Metrics Showcase</h2>
              </div>
              <button onClick={addStat} className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors"><Plus className="w-4 h-4" /> Add Stat</button>
            </div>
            
            {(config.stats || []).length === 0 && (
              <div className="py-8 text-center border-2 border-dashed border-border rounded-2xl bg-muted/20">
                <p className="text-muted-foreground text-sm">No metrics configured. Add numbers like "50+" or "5 Years".</p>
              </div>
            )}
            
            <div className="space-y-3">
              {(config.stats || []).map((stat, i) => (
                <div key={i} className="flex items-center gap-3 bg-background/40 backdrop-blur-xl shadow-xl p-2 rounded-2xl border border-border/50 hover:border-border transition-colors group">
                  <div className="w-8 flex items-center justify-center cursor-move opacity-50 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <input value={stat.number} onChange={e => updateStat(i, 'number', e.target.value)} placeholder="50+" className="w-24 px-4 py-2.5 bg-card/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-sm font-bold text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" />
                  <input value={stat.label} onChange={e => updateStat(i, 'label', e.target.value)} placeholder="Projects Completed" className="flex-1 px-4 py-2.5 bg-card/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" />
                  <button onClick={() => removeStat(i)} className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
            
            {(config.stats || []).length > 0 && (
              <div className="flex gap-6 pt-6 border-t border-border mt-6">
                {config.stats.map((s, i) => (
                  <div key={i} className="text-center w-full">
                    <p className="text-2xl font-black text-primary">{s.number || '0'}</p>
                    <p className="text-xs font-medium text-muted-foreground mt-1 uppercase tracking-wider">{s.label || 'Metric'}</p>
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
