import { useState, useRef, useEffect } from 'react';
import { uploadApi } from '@/services/api';
import { Upload, Trash2, Image as ImageIcon, FileIcon, Search, Loader2, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

interface FileItem {
  _id: string; filename: string; originalName: string; mimeType: string; size: number;
  url: string; storage: string; folder: string; createdAt: string;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

export default function FileManager() {
  const [data, setData] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await uploadApi.getFiles();
      setData(res.files as FileItem[]); // Backend returns { success: true, files: ... }
    } catch (e) {
      console.error(e); toast.error('Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const deleteFile = async (id: string) => {
    try {
      await uploadApi.deleteFile(id);
      fetchAll();
      toast.success('File deleted successfully');
    } catch(e) { console.error(e); toast.error('Failed to delete file'); }
  };
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'file'>('all');
  const fileInput = useRef<HTMLInputElement>(null);
  const imageInput = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File, type: 'image' | 'file') => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append(type, file);
      formData.append('folder', 'admin-uploads');
      
      if (type === 'image') {
        await uploadApi.uploadImage(formData);
      } else {
        await uploadApi.uploadFile(formData);
      }
      
      toast.success(`${type === 'image' ? 'Image' : 'File'} uploaded successfully!`);
      fetchAll();
    } catch(e) {
      toast.error('Failed to upload file');
    } finally { setUploading(false); }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.[0]) uploadFile(e.target.files[0], 'image'); };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.[0]) uploadFile(e.target.files[0], 'file'); };

  const copyUrl = (url: string) => { 
    navigator.clipboard.writeText(url); 
    toast.success('URL copied to clipboard!');
  };

  const filtered = data
    .filter(f => filterType === 'all' ? true : filterType === 'image' ? f.mimeType.startsWith('image/') : !f.mimeType.startsWith('image/'))
    .filter(f => !search || f.originalName.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display tracking-tight flex items-center gap-3">
            <FileIcon className="w-8 h-8 text-primary" /> File Manager
          </h1>
          <p className="text-muted-foreground text-sm mt-2">{data.length} files stored</p>
        </div>
        <div className="flex gap-3">
          <input ref={imageInput} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
          <input ref={fileInput} type="file" className="hidden" onChange={handleFileSelect} />
          <button onClick={() => imageInput.current?.click()} disabled={uploading} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 disabled:opacity-50">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />} Upload Image
          </button>
          <button onClick={() => fileInput.current?.click()} disabled={uploading} className="inline-flex items-center gap-2 px-5 py-2.5 border border-border bg-card/40 backdrop-blur-xl shadow-xl text-foreground rounded-xl text-sm font-bold hover:bg-muted transition-colors disabled:opacity-50">
            <Upload className="w-4 h-4" /> Upload File
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files by name..." className="w-full pl-12 pr-4 py-3 bg-card/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {(['all', 'image', 'file'] as const).map(f => (
            <button key={f} onClick={() => setFilterType(f)} className={`px-4 py-2.5 rounded-xl text-sm font-bold capitalize whitespace-nowrap transition-all ${filterType === f ? 'bg-primary/10 text-primary border border-primary/20' : 'border border-border bg-card/40 backdrop-blur-xl shadow-xl text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
              {f === 'file' ? 'Other Files' : f + 's'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {filtered.map((f) => (
          <div key={f._id} className="group rounded-3xl bg-card/40 backdrop-blur-xl shadow-xl border border-border overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all duration-300">
            <div className="aspect-square bg-muted/50 flex flex-col items-center justify-center overflow-hidden relative">
              {f.mimeType.startsWith('image/') ? (
                <img src={f.url} alt={f.originalName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <FileIcon className="w-12 h-12 text-muted-foreground/50 group-hover:scale-110 transition-transform duration-500" />
              )}
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button onClick={() => copyUrl(f.url)} className="p-3 bg-card/40 backdrop-blur-xl shadow-xl rounded-2xl shadow-lg border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors text-foreground" title="Copy URL">
                  <Copy className="w-5 h-5" />
                </button>
                <button onClick={() => deleteFile(f._id)} className="p-3 bg-card/40 backdrop-blur-xl shadow-xl rounded-2xl shadow-lg border border-border hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors text-red-500" title="Delete">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4 border-t border-border">
              <p className="text-sm font-bold truncate text-foreground mb-1 group-hover:text-primary transition-colors" title={f.originalName}>{f.originalName}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{formatSize(f.size)}</span>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${f.storage === 'cloudinary' ? 'bg-blue-500/10 text-blue-500' : 'bg-muted-foreground/10 text-muted-foreground'}`}>{f.storage}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filtered.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-border rounded-3xl bg-card/40 backdrop-blur-xl shadow-xl">
          <FileIcon className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">No files found</h3>
          <p className="text-muted-foreground">Upload some files or change your search filter.</p>
        </div>
      )}
    </div>
  );
}
