import { useState } from 'react';
import { NavLink, useNavigate, useLocation, useOutlet } from 'react-router-dom';
import { cloneElement } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, Sparkles, UserCircle, FolderKanban, FileText, Briefcase,
  Star, MessageSquare, Settings, Users, LogOut, Menu, X, Upload, ChevronLeft,
} from 'lucide-react';

const navSections = [
  {
    title: 'Content',
    items: [
      { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
      { to: '/admin/hero', icon: Sparkles, label: 'Hero Section' },
      { to: '/admin/about', icon: UserCircle, label: 'About / Skills' },
      { to: '/admin/projects', icon: FolderKanban, label: 'Projects' },
      { to: '/admin/blog', icon: FileText, label: 'Blog Posts' },
      { to: '/admin/services', icon: Briefcase, label: 'Services' },
      { to: '/admin/testimonials', icon: Star, label: 'Testimonials' },
    ],
  },
  {
    title: 'Communication',
    items: [
      { to: '/admin/messages', icon: MessageSquare, label: 'Messages' },
    ],
  },
  {
    title: 'System',
    items: [
      { to: '/admin/files', icon: Upload, label: 'File Manager' },
      { to: '/admin/settings', icon: Settings, label: 'Site Settings' },
      { to: '/admin/users', icon: Users, label: 'User Management' },
    ],
  },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const outlet = useOutlet();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      {sidebarOpen && <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-card/50 backdrop-blur-xl border-r border-border transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${collapsed ? 'w-[80px]' : 'w-72'}`}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-border">
          {!collapsed && <span className="text-2xl font-black font-display bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">AnandVerse</span>}
          <button onClick={() => { if (window.innerWidth >= 1024) setCollapsed(!collapsed); else setSidebarOpen(false); }} className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors ml-auto">
            {sidebarOpen ? <X className="w-5 h-5" /> : <ChevronLeft className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-2">
              {!collapsed && <p className="px-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">{section.title}</p>}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${isActive ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' : 'text-muted-foreground hover:text-foreground hover:bg-muted'} ${collapsed ? 'justify-center' : ''}`}>
                    <item.icon className={`w-5 h-5 flex-shrink-0 ${collapsed ? 'w-6 h-6' : ''}`} />
                    {!collapsed && <span>{item.label}</span>}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className={`flex items-center gap-4 p-2 rounded-2xl bg-muted/50 border border-transparent hover:border-border transition-colors ${collapsed ? 'justify-center p-3' : 'p-3'}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-primary-foreground shadow-inner font-bold flex-shrink-0">
              {user?.name?.charAt(0) || 'A'}
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate uppercase tracking-wider">{user?.role}</p>
                </div>
                <button onClick={handleLogout} className="p-2 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Logout">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 flex items-center justify-between px-6 lg:px-10 border-b border-border bg-background/80 backdrop-blur-xl z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2.5 rounded-xl hover:bg-muted text-muted-foreground transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold font-display hidden sm:block">Admin Management Overview</h1>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <div className="px-4 py-1.5 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-wider hidden md:block">
              System Online
            </div>
            <NavLink to="/" target="_blank" className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 px-5 py-2.5 rounded-xl bg-primary/10 transition-colors">
              View Live Site <Sparkles className="w-4 h-4" />
            </NavLink>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10 relative">
          <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 blur-3xl -z-10 rounded-full" />
          <div className="max-w-[1600px] mx-auto">
            <AnimatePresence mode="wait">
              {outlet && cloneElement(outlet, { key: location.pathname })}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
