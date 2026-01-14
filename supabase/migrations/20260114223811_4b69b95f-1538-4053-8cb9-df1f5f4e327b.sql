-- Create app_role enum for admin roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create profiles table for user roles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT,
  role app_role DEFAULT 'user' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create content status enum
CREATE TYPE public.content_status AS ENUM ('draft', 'published');

-- Create lead status enum  
CREATE TYPE public.lead_status AS ENUM ('new', 'read', 'contacted', 'converted', 'closed');

-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  content TEXT,
  category TEXT,
  image_url TEXT,
  tags TEXT[],
  featured BOOLEAN DEFAULT false,
  status content_status DEFAULT 'draft' NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create posts table for blog/insights
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  excerpt TEXT,
  content TEXT,
  category TEXT,
  featured_image TEXT,
  tags TEXT[],
  reading_time INTEGER,
  status content_status DEFAULT 'draft' NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  company TEXT,
  role TEXT,
  content TEXT NOT NULL,
  avatar_url TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  featured BOOLEAN DEFAULT false,
  status content_status DEFAULT 'draft' NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create leads table for contact form submissions
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  services TEXT[],
  message TEXT,
  budget TEXT,
  timeline TEXT,
  referral_source TEXT,
  status lead_status DEFAULT 'new' NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create pricing_packages table
CREATE TABLE public.pricing_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price TEXT,
  price_suffix TEXT DEFAULT '/project',
  features TEXT[],
  highlighted BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create faqs table
CREATE TABLE public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Create is_admin helper function (SECURITY DEFINER to prevent recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
$$;

-- Profile policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Projects policies
CREATE POLICY "Public can view published projects" ON public.projects
  FOR SELECT USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins can insert projects" ON public.projects
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update projects" ON public.projects
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete projects" ON public.projects
  FOR DELETE USING (public.is_admin());

-- Posts policies
CREATE POLICY "Public can view published posts" ON public.posts
  FOR SELECT USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins can insert posts" ON public.posts
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update posts" ON public.posts
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete posts" ON public.posts
  FOR DELETE USING (public.is_admin());

-- Testimonials policies
CREATE POLICY "Public can view published testimonials" ON public.testimonials
  FOR SELECT USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins can insert testimonials" ON public.testimonials
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update testimonials" ON public.testimonials
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete testimonials" ON public.testimonials
  FOR DELETE USING (public.is_admin());

-- Leads policies (blind insert for public, full access for admin)
CREATE POLICY "Anyone can submit leads" ON public.leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view leads" ON public.leads
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update leads" ON public.leads
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete leads" ON public.leads
  FOR DELETE USING (public.is_admin());

-- Pricing packages policies (public read, admin write)
CREATE POLICY "Anyone can view pricing" ON public.pricing_packages
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert pricing" ON public.pricing_packages
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update pricing" ON public.pricing_packages
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete pricing" ON public.pricing_packages
  FOR DELETE USING (public.is_admin());

-- FAQs policies (public read, admin write)
CREATE POLICY "Anyone can view faqs" ON public.faqs
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert faqs" ON public.faqs
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update faqs" ON public.faqs
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete faqs" ON public.faqs
  FOR DELETE USING (public.is_admin());

-- Create trigger function for profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$;

-- Create trigger to auto-create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample pricing packages
INSERT INTO public.pricing_packages (name, description, price, price_suffix, features, highlighted, display_order) VALUES
('Starter', 'Perfect for small businesses and personal brands', '$3,500', 'starting from', 
 ARRAY['5-7 page responsive website', 'Mobile-first design', 'Basic SEO optimization', 'Contact form integration', '2 rounds of revisions', '30-day support'], 
 false, 1),
('Professional', 'For growing businesses needing more features', '$7,500', 'starting from',
 ARRAY['10-15 page responsive website', 'Custom design system', 'Advanced SEO & analytics', 'CMS integration', 'E-commerce ready (up to 50 products)', '4 rounds of revisions', '60-day support', 'Performance optimization'],
 true, 2),
('Enterprise', 'Full-scale digital solutions for larger organizations', '$15,000', 'starting from',
 ARRAY['Unlimited pages', 'Custom web application features', 'Advanced integrations & APIs', 'Priority support', 'Dedicated project manager', 'Ongoing maintenance options', 'Training & documentation', 'Performance & security audits'],
 false, 3);

-- Insert sample FAQs
INSERT INTO public.faqs (question, answer, category, display_order) VALUES
('How long does a typical project take?', 'Project timelines vary based on scope and complexity. A standard 5-7 page website typically takes 4-6 weeks, while larger web applications can take 3-6 months. We''ll provide a detailed timeline during our initial consultation.', 'Process', 1),
('What is your design process?', 'Our process includes discovery & research, wireframing, visual design, development, testing, and launch. We maintain close collaboration throughout, with regular check-ins and approval stages to ensure the final product exceeds expectations.', 'Process', 2),
('Do you offer ongoing support?', 'Yes! All projects include a support period (30-90 days depending on package). We also offer monthly retainer packages for ongoing updates, maintenance, security monitoring, and new feature development.', 'Support', 3),
('What technologies do you use?', 'We use modern, industry-standard technologies including React, TypeScript, and Tailwind CSS for frontends, with flexible backend solutions based on project needs. We prioritize performance, accessibility, and maintainability.', 'Technical', 4),
('How do payments work?', 'We typically structure payments as 50% upfront to begin work, with the remaining 50% due upon project completion. For larger projects, we can arrange milestone-based payment schedules.', 'Billing', 5),
('Can you work with our existing brand guidelines?', 'Absolutely! We love working with established brand systems. If you have existing guidelines, we''ll ensure the website design aligns perfectly with your brand identity while enhancing the digital experience.', 'Process', 6);

-- Insert sample testimonials
INSERT INTO public.testimonials (client_name, company, role, content, rating, featured, status, display_order) VALUES
('Sarah Mitchell', 'Bloom & Grow', 'Founder', 'Working with NovaStream was transformative for our brand. They didn''t just build a website—they crafted an experience that truly represents who we are. Our online presence has never been stronger.', 5, true, 'published', 1),
('Marcus Chen', 'TechFlow Solutions', 'CEO', 'The team understood our complex requirements immediately and delivered a web application that exceeded every expectation. Professional, responsive, and incredibly talented.', 5, true, 'published', 2),
('Elena Rodriguez', 'Artisan Collective', 'Creative Director', 'Beautiful, thoughtful design work. They took our vision and elevated it to something we couldn''t have imagined. The attention to detail is remarkable.', 5, true, 'published', 3);

-- Insert sample projects
INSERT INTO public.projects (title, slug, description, category, tags, featured, status, display_order) VALUES
('Luxe Fashion E-commerce', 'luxe-fashion', 'A premium e-commerce experience for a luxury fashion brand, featuring elegant product displays and seamless checkout.', 'E-commerce', ARRAY['E-commerce', 'Fashion', 'Luxury'], true, 'published', 1),
('TechFlow Analytics Dashboard', 'techflow-dashboard', 'A comprehensive SaaS analytics dashboard with real-time data visualization and intuitive user management.', 'Web Application', ARRAY['Dashboard', 'SaaS', 'Analytics'], true, 'published', 2),
('Creative Portfolio', 'creative-portfolio', 'A stunning portfolio website for a creative agency, showcasing their work with immersive galleries and smooth animations.', 'Portfolio', ARRAY['Portfolio', 'Creative', 'Agency'], true, 'published', 3),
('Corporate Solutions', 'corporate-solutions', 'A professional corporate website for a consulting firm, emphasizing trust, expertise, and clear communication.', 'Corporate', ARRAY['Corporate', 'Business', 'Professional'], false, 'published', 4);