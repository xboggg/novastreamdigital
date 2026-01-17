import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { InstallPromptBanner } from "@/components/pwa/InstallPromptBanner";
import { NotificationPrompt } from "@/components/pwa/NotificationPrompt";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import ProjectDetail from "./pages/ProjectDetail";
import About from "./pages/About";
import Insights from "./pages/Insights";
import PostDetail from "./pages/PostDetail";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import Install from "./pages/Install";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminPosts from "./pages/admin/AdminPosts";
import AdminSocial from "./pages/admin/AdminSocial";
import AdminSocialAnalytics from "./pages/admin/AdminSocialAnalytics";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminLeads from "./pages/admin/AdminLeads";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminNewsletter from "./pages/admin/AdminNewsletter";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <InstallPromptBanner />
            <NotificationPrompt />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/portfolio/:slug" element={<ProjectDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/insights/:slug" element={<PostDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/install" element={<Install />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/projects" element={<ProtectedRoute requireAdmin><AdminProjects /></ProtectedRoute>} />
              <Route path="/admin/posts" element={<ProtectedRoute requireAdmin><AdminPosts /></ProtectedRoute>} />
              <Route path="/admin/social" element={<ProtectedRoute requireAdmin><AdminSocial /></ProtectedRoute>} />
              <Route path="/admin/social/analytics" element={<ProtectedRoute requireAdmin><AdminSocialAnalytics /></ProtectedRoute>} />
              <Route path="/admin/testimonials" element={<ProtectedRoute requireAdmin><AdminTestimonials /></ProtectedRoute>} />
              <Route path="/admin/leads" element={<ProtectedRoute requireAdmin><AdminLeads /></ProtectedRoute>} />
              <Route path="/admin/newsletter" element={<ProtectedRoute requireAdmin><AdminNewsletter /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><AdminSettings /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
