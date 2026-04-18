import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import Turnstile from '@/components/Turnstile';
import { authApi } from '@/services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsSubmitting(true);

    try {
      await authApi.forgotPassword(email, turnstileToken);
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sent) {
    return (
      <PageTransition>
        <section className="min-h-screen flex items-center justify-center pt-20 pb-16">
          <div className="max-w-md w-full mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-green-500/10 mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold font-display mb-4">
                Check Your <span className="text-gradient">Email</span>
              </h1>
              <p className="text-muted-foreground mb-8">
                If an account with <strong className="text-foreground">{email}</strong> exists,
                we've sent a password reset link. Please check your inbox and spam folder.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-xl font-medium hover:bg-white/5 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Login
              </Link>
            </motion.div>
          </div>
        </section>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <section className="min-h-screen flex items-center justify-center pt-20 pb-16">
        <div className="max-w-md w-full mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-display mb-2">
              Forgot <span className="text-gradient">Password?</span>
            </h1>
            <p className="text-muted-foreground">
              Enter your email and we'll send you a reset link
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card p-6 sm:p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-background/40 backdrop-blur-xl shadow-xl border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="sai@example.com"
                />
              </div>

              <Turnstile onVerify={(token) => setTurnstileToken(token)} />

              <button
                type="submit"
                disabled={isSubmitting || !turnstileToken}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Send Reset Link
                  </>
                )}
              </button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
