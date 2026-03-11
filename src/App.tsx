import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { cloneElement } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ParticleBackground from '@/components/three/ParticleBackground';
import ScrollToTop from '@/components/ScrollToTop';
import FloatingActions from '@/components/FloatingActions';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

// Lazy-loaded public pages
const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));
const Projects = lazy(() => import('@/pages/Projects'));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
const Blog = lazy(() => import('@/pages/Blog'));
const BlogDetail = lazy(() => import('@/pages/BlogDetail'));
const Contact = lazy(() => import('@/pages/Contact'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('@/pages/TermsOfService'));
const Setup = lazy(() => import('@/pages/Setup'));
const Login = lazy(() => import('@/pages/Login'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const AcceptInvite = lazy(() => import('@/pages/AcceptInvite'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Lazy-loaded admin pages
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

function PublicLayout() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <div className="min-h-screen bg-background text-foreground relative flex flex-col">
      <ParticleBackground />
      <Navigation />
      <main className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          {outlet && cloneElement(outlet, { key: location.pathname })}
        </AnimatePresence>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Suspense fallback={<LoadingSpinner />}>
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
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <ScrollToTop />
          <AnimatedRoutes />
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
