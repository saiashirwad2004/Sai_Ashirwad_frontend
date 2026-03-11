import { BrowserRouter as Router, Routes, Route, useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { cloneElement } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ParticleBackground from '@/components/three/ParticleBackground';
import ScrollToTop from '@/components/ScrollToTop';
import FloatingActions from '@/components/FloatingActions';
import ErrorBoundary from '@/components/ErrorBoundary';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

import Home from '@/pages/Home';
import About from '@/pages/About';
import Projects from '@/pages/Projects';
import ProjectDetail from '@/pages/ProjectDetail';
import Blog from '@/pages/Blog';
import BlogDetail from '@/pages/BlogDetail';
import Contact from '@/pages/Contact';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import Setup from '@/pages/Setup';
import Login from '@/pages/Login';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import AcceptInvite from '@/pages/AcceptInvite';
import NotFound from '@/pages/NotFound';

import AdminLayout from '@/admin/AdminLayout';
import Dashboard from '@/admin/Dashboard';
import HeroManager from '@/admin/HeroManager';
import AboutManager from '@/admin/AboutManager';
import AdminProjects from '@/admin/Projects';
import AdminBlogPosts from '@/admin/BlogPosts';
import AdminServices from '@/admin/Services';
import AdminTestimonials from '@/admin/Testimonials';
import AdminMessages from '@/admin/Messages';
import AdminSettings from '@/admin/Settings';
import UserManagement from '@/admin/UserManagement';
import AdminFileManager from '@/admin/FileManager';

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
