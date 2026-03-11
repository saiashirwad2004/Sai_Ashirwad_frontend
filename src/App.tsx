import { BrowserRouter as Router, Routes, Route, useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { cloneElement, lazy, Suspense } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { FallingPattern } from '@/components/ui/falling-pattern';
import { Component as EtheralShadow } from '@/components/ui/etheral-shadow';
import ScrollToTop from '@/components/ScrollToTop';
import FloatingActions from '@/components/FloatingActions';
import ErrorBoundary from '@/components/ErrorBoundary';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

// ── Lazy-loaded public pages ────────────────────────
const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));
const Projects = lazy(() => import('@/pages/Projects'));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
const Blog = lazy(() => import('@/pages/Blog'));
const BlogDetail = lazy(() => import('@/pages/BlogDetail'));
const Contact = lazy(() => import('@/pages/Contact'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('@/pages/TermsOfService'));

// ── Lazy-loaded auth pages ──────────────────────────
const Setup = lazy(() => import('@/pages/Setup'));
const Login = lazy(() => import('@/pages/Login'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const AcceptInvite = lazy(() => import('@/pages/AcceptInvite'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// ── Lazy-loaded admin pages ─────────────────────────
const AdminLayout = lazy(() => import('@/admin/AdminLayout'));
const Dashboard = lazy(() => import('@/admin/Dashboard'));
const HeroManager = lazy(() => import('@/admin/HeroManager'));
const AboutManager = lazy(() => import('@/admin/AboutManager'));
const AdminProjects = lazy(() => import('@/admin/Projects'));
const AdminBlogPosts = lazy(() => import('@/admin/BlogPosts'));
const AdminServices = lazy(() => import('@/admin/Services'));
const AdminTestimonials = lazy(() => import('@/admin/Testimonials'));
const AdminMessages = lazy(() => import('@/admin/Messages'));
const AdminSettings = lazy(() => import('@/admin/Settings'));
const UserManagement = lazy(() => import('@/admin/UserManagement'));
const AdminFileManager = lazy(() => import('@/admin/FileManager'));

// ── Full-page loading spinner ───────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        className="w-10 h-10 border-[3px] border-primary/20 border-t-primary rounded-full shadow-lg shadow-primary/10"
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-muted-foreground text-xs font-semibold uppercase tracking-widest"
      >
        Loading…
      </motion.p>
    </div>
  );
}

function PublicLayout() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <div className="min-h-screen text-foreground relative flex flex-col">
      {/* Falling pattern background */}
      <div className="fixed inset-0 z-0 bg-background">
        <FallingPattern className="h-full w-full [mask-image:radial-gradient(ellipse_at_center,transparent,var(--background))]" />
      </div>
      {/* Etheral shadow overlay */}
      <div className="fixed inset-0 z-[1] pointer-events-none">
        <EtheralShadow
          color="rgba(59, 130, 246, 0.15)"
          animation={{ scale: 100, speed: 90 }}
          noise={{ opacity: 0.3, scale: 1.2 }}
          sizing="fill"
        />
      </div>
      <Navigation />
      <main className="flex-1 relative z-10">
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            {outlet && cloneElement(outlet, { key: location.pathname })}
          </AnimatePresence>
        </Suspense>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Routes location={location}>
      {/* Public site with nav/footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
      </Route>

      {/* Auth pages (no nav/footer) */}
      <Route path="/setup" element={<Setup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/accept-invite/:token" element={<AcceptInvite />} />

      {/* Admin panel (protected, own layout) */}
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="hero" element={<HeroManager />} />
        <Route path="about" element={<AboutManager />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="blog" element={<AdminBlogPosts />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="files" element={<AdminFileManager />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="users" element={<UserManagement />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <AnimatedRoutes />
          </Suspense>
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'bg-card text-foreground border border-border shadow-2xl rounded-2xl p-4',
              success: { iconTheme: { primary: '#3b82f6', secondary: '#ffffff' } }
            }}
          />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
