import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { authApi, ApiError } from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function AcceptInvite() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (!token) {
      toast.error('Invalid invitation link');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authApi.acceptInvite(token, password);
      
      // Store token automatically
      if (res.token) {
        localStorage.setItem('token', res.token as string);
        toast.success('Account activated successfully!');
        setSuccess(true);
        setTimeout(() => {
          navigate('/admin');
        }, 2000);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error('Failed to activate account');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background/40 backdrop-blur-xl shadow-xl flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold font-display text-foreground">Welcome to AnandVerse</h1>
          <p className="text-muted-foreground">Your account has been successfully set up. Redirecting to your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/40 backdrop-blur-xl shadow-xl flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block mb-6">
            <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              AnandVerse
            </span>
          </Link>
          <h1 className="text-3xl font-bold font-display text-foreground mb-2">Accept Invitation</h1>
          <p className="text-muted-foreground">Set your password to activate your admin account</p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  placeholder="At least 6 characters"
                  minLength={6}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background/40 backdrop-blur-xl shadow-xl border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  placeholder="Must match password"
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative group bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center gap-2">
                {isLoading ? 'Activating account...' : 'Set Password Component'}
                {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
