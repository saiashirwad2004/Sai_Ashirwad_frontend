import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Save, Loader2, Globe, Link2, Search as SearchIcon, Code, Shield, Mail } from 'lucide-react';

interface SiteConfig {
  _id: string; siteName: string; siteTagline: string;
  footerText: string; copyrightName: string; maintenanceMode: boolean;
  socialLinks: { github: string; linkedin: string; twitter: string; instagram: string; youtube: string; website: string; dribbble: string };
  seoTitle: string; seoDescription: string; seoKeywords: string[];
  analyticsId: string; customCSS: string; customHead: string;
  email: string; phone: string; location: string;
}

export default function Settings() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    api<{ data: SiteConfig }>('/admin/settings').then(r => setConfig(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true); setSaved(false);
    try {
      const res = await api<{ data: SiteConfig }>('/admin/settings', { method: 'PUT', body: config });
      setConfig(res.data); setSaved(true); setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  };

  const update = (path: string, value: unknown) => {
    if (!config) return;
    const keys = path.split('.');
    const updated = { ...config };
    let obj: Record<string, unknown> = updated;
    for (let i = 0; i < keys.length - 1; i++) { obj[keys[i]] = { ...(obj[keys[i]] as Record<string, unknown>) }; obj = obj[keys[i]] as Record<string, unknown>; }
    obj[keys[keys.length - 1]] = value;
    setConfig(updated as SiteConfig);
  };

  if (loading || !config) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'contact', label: 'Contact Info', icon: Mail },
    { id: 'social', label: 'Social Links', icon: Link2 },
    { id: 'seo', label: 'SEO', icon: SearchIcon },
    { id: 'advanced', label: 'Advanced', icon: Code },
  ];

  const InputField = ({ label, value, onChange, rows }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) => (
    <div>
      <label className="text-sm font-semibold text-foreground mb-1.5 block">{label}</label>
      {rows ? <textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={rows} className="w-full px-5 py-3 bg-background border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none font-mono" />
        : <input value={value || ''} onChange={e => onChange(e.target.value)} className="w-full px-5 py-3 bg-background border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all font-medium" />}
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display tracking-tight flex items-center gap-3">
            <Globe className="w-8 h-8 text-primary" /> Site Settings
          </h1>
          <p className="text-muted-foreground text-sm mt-2">Global site configuration, SEO, and advanced configurations.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 ${saved ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90'}`}>
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} {saved ? 'Saved Successfully!' : 'Save Changes'}
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-border/50 hide-scrollbar scroll-smooth">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeTab === t.id ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-sm animate-in zoom-in-95 duration-300">
        {activeTab === 'general' && (
          <div className="space-y-5">
            <InputField label="Site Name" value={config.siteName} onChange={v => update('siteName', v)} />
            <InputField label="Site Tagline" value={config.siteTagline} onChange={v => update('siteTagline', v)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputField label="Footer Text" value={config.footerText} onChange={v => update('footerText', v)} />
              <InputField label="Copyright Name" value={config.copyrightName} onChange={v => update('copyrightName', v)} />
            </div>

            <div className="flex items-center justify-between p-5 rounded-2xl bg-muted/50 border border-border mt-4">
              <div>
                <p className="text-sm font-bold text-foreground flex items-center gap-2"><Shield className="w-5 h-5 text-orange-500" /> Maintenance Mode</p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">When active, visitors see a maintenance page preventing access to public routes.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={config.maintenanceMode} onChange={() => update('maintenanceMode', !config.maintenanceMode)} />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-5">
            <InputField label="Public Email Address" value={config.email} onChange={v => update('email', v)} />
            <InputField label="Public Phone Number" value={config.phone} onChange={v => update('phone', v)} />
            <InputField label="Location / Address" value={config.location} onChange={v => update('location', v)} />
          </div>
        )}

        {activeTab === 'social' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {Object.entries(config.socialLinks || {}).map(([key, value]) => (
              <InputField key={key} label={key.charAt(0).toUpperCase() + key.slice(1) + " URL"} value={value as string} onChange={v => update(`socialLinks.${key}`, v)} />
            ))}
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-5">
            <InputField label="SEO Title" value={config.seoTitle} onChange={v => update('seoTitle', v)} />
            <InputField label="SEO Description" value={config.seoDescription} onChange={v => update('seoDescription', v)} rows={3} />
            <InputField label="Keywords (comma separated)" value={(config.seoKeywords || []).join(', ')} onChange={v => update('seoKeywords', v.split(',').map((k: string) => k.trim()).filter(Boolean))} />
            <InputField label="Google Analytics ID (G-XXXXXXXX)" value={config.analyticsId} onChange={v => update('analyticsId', v)} />
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-5">
            <InputField label="Custom CSS" value={config.customCSS} onChange={v => update('customCSS', v)} rows={6} />
            <InputField label="Custom Head HTML (scripts, meta tags)" value={config.customHead} onChange={v => update('customHead', v)} rows={6} />
          </div>
        )}
      </div>
    </div>
  );
}
