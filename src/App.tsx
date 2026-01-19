import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { InstallPromptBanner } from "@/components/pwa/InstallPromptBanner";
import { CookieConsent } from "./components/CookieConsent";
import { PageLoader } from "@/components/PageLoader";
import { ScrollToTop } from "@/components/ScrollToTop";
import { WhatsAppButton } from "@/components/WhatsAppButton";

// Eagerly load the index page for better initial load
import Index from "./pages/Index";

// Lazy load all other pages for code splitting
const Services = lazy(() => import("./pages/Services"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const About = lazy(() => import("./pages/About"));
const Insights = lazy(() => import("./pages/Insights"));
const PostDetail = lazy(() => import("./pages/PostDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Install = lazy(() => import("./pages/Install"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Lazy load admin pages
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects"));
const AdminPosts = lazy(() => import("./pages/admin/AdminPosts"));
const AdminSocial = lazy(() => import("./pages/admin/AdminSocial"));
const AdminSocialAnalytics = lazy(() => import("./pages/admin/AdminSocialAnalytics"));
const AdminTestimonials = lazy(() => import("./pages/admin/AdminTestimonials"));
const AdminLeads = lazy(() => import("./pages/admin/AdminLeads"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminNewsletter = lazy(() => import("./pages/admin/AdminNewsletter"));
const AdminPricing = lazy(() => import("./pages/admin/AdminPricing"));
const AdminFAQ = lazy(() => import("./pages/admin/AdminFAQ"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <InstallPromptBanner />
            <Suspense fallback={<PageLoader />}>
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
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/projects" element={<ProtectedRoute requireAdmin><AdminProjects /></ProtectedRoute>} />
                <Route path="/admin/posts" element={<ProtectedRoute requireAdmin><AdminPosts /></ProtectedRoute>} />
                <Route path="/admin/social" element={<ProtectedRoute requireAdmin><AdminSocial /></ProtectedRoute>} />
                <Route path="/admin/social/analytics" element={<ProtectedRoute requireAdmin><AdminSocialAnalytics /></ProtectedRoute>} />
                <Route path="/admin/testimonials" element={<ProtectedRoute requireAdmin><AdminTestimonials /></ProtectedRoute>} />
                <Route path="/admin/leads" element={<ProtectedRoute requireAdmin><AdminLeads /></ProtectedRoute>} />
                <Route path="/admin/newsletter" element={<ProtectedRoute requireAdmin><AdminNewsletter /></ProtectedRoute>} />
                <Route path="/admin/pricing" element={<ProtectedRoute requireAdmin><AdminPricing /></ProtectedRoute>} />
                <Route path="/admin/faqs" element={<ProtectedRoute requireAdmin><AdminFAQ /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute requireAdmin><AdminUsers /></ProtectedRoute>} />
                <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><AdminSettings /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <CookieConsent />
            <WhatsAppButton />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
