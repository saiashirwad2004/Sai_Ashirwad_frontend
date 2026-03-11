import { useState, useEffect } from 'react';
import { Plus, Trash2, Mail, Users, RefreshCw, Loader2, ShieldAlert, ShieldCheck, MailCheck, Clock, UserIcon, X } from 'lucide-react';
import { userApi, ApiError } from '../services/api';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'admin' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userApi.getUsers();
      setUsers(res.data as User[]);
    } catch (error) {
      if (error instanceof ApiError) toast.error(error.message);
      else toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the user "${name}"?`)) {
      try {
        await userApi.deleteUser(id);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        if (error instanceof ApiError) toast.error(error.message);
        else toast.error('Failed to delete user');
      }
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    try {
      await userApi.inviteUser(formData);
      toast.success('Invitation sent successfully!');
      setShowInviteModal(false);
      setFormData({ name: '', email: '', role: 'admin' });
      fetchUsers();
    } catch (error) {
      if (error instanceof ApiError) toast.error(error.message);
      else toast.error('Failed to send invitation');
    } finally {
      setInviting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" /> User Management
          </h1>
          <p className="text-muted-foreground text-sm mt-2">Manage admin accounts, roles, and pending invitations.</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" /> Invite User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {users.map((user) => (
          <div key={user._id} className="group rounded-3xl bg-card border border-border p-6 shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 relative overflow-hidden flex flex-col h-full">
            {/* Background decoration */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
            
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-primary-foreground text-lg font-black shadow-inner flex-shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${user.role === 'superadmin' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'}`}>
                  {user.role === 'superadmin' ? <ShieldAlert className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                  {user.role}
                </span>
              </div>
            </div>

            <div className="mb-6 relative z-10 flex-1">
              <h3 className="text-xl font-bold text-foreground truncate" title={user.name}>{user.name}</h3>
              <p className="text-muted-foreground text-sm truncate flex items-center gap-1.5 mt-1" title={user.email}>
                <Mail className="w-3.5 h-3.5 flex-shrink-0" /> {user.email}
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-border/50 relative z-10">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Joined
                </span>
                <span className="font-medium text-foreground">{new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5" /> Status
                </span>
                <span className={`font-bold flex items-center gap-1 ${user.isActive ? 'text-green-500' : 'text-orange-500'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-orange-500 animate-pulse'}`} />
                  {user.isActive ? 'Active' : 'Pending Invite'}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex justify-end gap-2 relative z-10">
              <button
                onClick={() => handleDelete(user._id, user.name)}
                className="inline-flex items-center justify-center p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-colors"
                title="Delete User"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        
        {users.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-3xl bg-card/50">
            <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">No users found</h3>
            <p className="text-muted-foreground">Invite a new admin to get started.</p>
          </div>
        )}
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-3xl border border-border shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MailCheck className="w-5 h-5 text-primary" />
                </div>
                Invite Admin
              </h2>
              <button 
                onClick={() => setShowInviteModal(false)}
                className="p-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleInvite} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-5 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm font-medium"
                  placeholder="e.g. Anand"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-5 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm font-medium"
                  placeholder="anand@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Role Authorization</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-5 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm font-medium appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
                >
                  <option value="admin">Administrator (Standard Access)</option>
                  <option value="superadmin">Super Administrator (Full Access)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border/50">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-5 py-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-xl transition-all font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviting}
                  className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none font-bold text-sm inline-flex items-center gap-2"
                >
                  {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  {inviting ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
