-- Migration to move all NovaStream tables to dedicated 'novastream' schema
-- This keeps NovaStream data separate from other services on the self-hosted Supabase

-- Create the novastream schema
CREATE SCHEMA IF NOT EXISTS novastream;

-- Grant usage to authenticated and anon roles
GRANT USAGE ON SCHEMA novastream TO postgres, anon, authenticated, service_role;

-- Grant all privileges on schema
GRANT ALL ON SCHEMA novastream TO postgres, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA novastream TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA novastream TO postgres, service_role;

-- Set default privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA novastream
GRANT ALL ON TABLES TO postgres, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA novastream
GRANT ALL ON SEQUENCES TO postgres, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA novastream
GRANT SELECT ON TABLES TO anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA novastream
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

-- Create enums in novastream schema
CREATE TYPE novastream.app_role AS ENUM ('admin', 'user');
CREATE TYPE novastream.content_status AS ENUM ('draft', 'published');
CREATE TYPE novastream.lead_status AS ENUM ('new', 'read', 'contacted', 'converted', 'closed');

-- Create profiles table
CREATE TABLE novastream.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT,
  role novastream.app_role DEFAULT 'user' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create projects table
CREATE TABLE novastream.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  content TEXT,
  category TEXT,
  image_url TEXT,
  website_url TEXT,
  tags TEXT[],
  featured BOOLEAN DEFAULT false,
  status novastream.content_status DEFAULT 'draft' NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create posts table for blog
CREATE TABLE novastream.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  excerpt TEXT,
  content TEXT,
  category TEXT,
  featured_image TEXT,
  tags TEXT[],
  reading_time INTEGER,
  status novastream.content_status DEFAULT 'draft' NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create testimonials table
CREATE TABLE novastream.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  company TEXT,
  role TEXT,
  content TEXT NOT NULL,
  avatar_url TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  featured BOOLEAN DEFAULT false,
  status novastream.content_status DEFAULT 'draft' NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create leads table for contact form submissions
CREATE TABLE novastream.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  services TEXT[],
  message TEXT,
  budget TEXT,
  timeline TEXT,
  referral_source TEXT,
  status novastream.lead_status DEFAULT 'new' NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create pricing_packages table
CREATE TABLE novastream.pricing_packages (
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
CREATE TABLE novastream.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create newsletter_subscribers table
CREATE TABLE novastream.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- Create social_posts table
CREATE TABLE novastream.social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  platforms TEXT[] NOT NULL DEFAULT '{}',
  scheduled_for TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  media_urls TEXT[] DEFAULT '{}',
  hashtags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE novastream.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE novastream.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE novastream.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE novastream.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE novastream.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE novastream.pricing_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE novastream.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE novastream.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE novastream.social_posts ENABLE ROW LEVEL SECURITY;

-- Create is_admin helper function
CREATE OR REPLACE FUNCTION novastream.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = novastream
AS $$
  SELECT EXISTS (
    SELECT 1 FROM novastream.profiles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
$$;

-- Profile policies
CREATE POLICY "Users can view own profile" ON novastream.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON novastream.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON novastream.profiles
  FOR SELECT USING (novastream.is_admin());

-- Projects policies
CREATE POLICY "Public can view published projects" ON novastream.projects
  FOR SELECT USING (status = 'published' OR novastream.is_admin());

CREATE POLICY "Admins can insert projects" ON novastream.projects
  FOR INSERT WITH CHECK (novastream.is_admin());

CREATE POLICY "Admins can update projects" ON novastream.projects
  FOR UPDATE USING (novastream.is_admin());

CREATE POLICY "Admins can delete projects" ON novastream.projects
  FOR DELETE USING (novastream.is_admin());

-- Posts policies
CREATE POLICY "Public can view published posts" ON novastream.posts
  FOR SELECT USING (status = 'published' OR novastream.is_admin());

CREATE POLICY "Admins can insert posts" ON novastream.posts
  FOR INSERT WITH CHECK (novastream.is_admin());

CREATE POLICY "Admins can update posts" ON novastream.posts
  FOR UPDATE USING (novastream.is_admin());

CREATE POLICY "Admins can delete posts" ON novastream.posts
  FOR DELETE USING (novastream.is_admin());

-- Testimonials policies
CREATE POLICY "Public can view published testimonials" ON novastream.testimonials
  FOR SELECT USING (status = 'published' OR novastream.is_admin());

CREATE POLICY "Admins can insert testimonials" ON novastream.testimonials
  FOR INSERT WITH CHECK (novastream.is_admin());

CREATE POLICY "Admins can update testimonials" ON novastream.testimonials
  FOR UPDATE USING (novastream.is_admin());

CREATE POLICY "Admins can delete testimonials" ON novastream.testimonials
  FOR DELETE USING (novastream.is_admin());

-- Leads policies
CREATE POLICY "Anyone can submit leads" ON novastream.leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view leads" ON novastream.leads
  FOR SELECT USING (novastream.is_admin());

CREATE POLICY "Admins can update leads" ON novastream.leads
  FOR UPDATE USING (novastream.is_admin());

CREATE POLICY "Admins can delete leads" ON novastream.leads
  FOR DELETE USING (novastream.is_admin());

-- Pricing packages policies
CREATE POLICY "Anyone can view pricing" ON novastream.pricing_packages
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert pricing" ON novastream.pricing_packages
  FOR INSERT WITH CHECK (novastream.is_admin());

CREATE POLICY "Admins can update pricing" ON novastream.pricing_packages
  FOR UPDATE USING (novastream.is_admin());

CREATE POLICY "Admins can delete pricing" ON novastream.pricing_packages
  FOR DELETE USING (novastream.is_admin());

-- FAQs policies
CREATE POLICY "Anyone can view faqs" ON novastream.faqs
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert faqs" ON novastream.faqs
  FOR INSERT WITH CHECK (novastream.is_admin());

CREATE POLICY "Admins can update faqs" ON novastream.faqs
  FOR UPDATE USING (novastream.is_admin());

CREATE POLICY "Admins can delete faqs" ON novastream.faqs
  FOR DELETE USING (novastream.is_admin());

-- Newsletter policies
CREATE POLICY "Anyone can subscribe" ON novastream.newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view subscribers" ON novastream.newsletter_subscribers
  FOR SELECT USING (novastream.is_admin());

CREATE POLICY "Admins can manage subscribers" ON novastream.newsletter_subscribers
  FOR ALL USING (novastream.is_admin());

-- Social posts policies
CREATE POLICY "Admins can manage social posts" ON novastream.social_posts
  FOR ALL USING (novastream.is_admin());

-- Create trigger function for profile creation on signup
CREATE OR REPLACE FUNCTION novastream.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = novastream
AS $$
BEGIN
  INSERT INTO novastream.profiles (user_id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$;

-- Create trigger to auto-create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created_novastream ON auth.users;
CREATE TRIGGER on_auth_user_created_novastream
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION novastream.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION novastream.update_updated_at_column()
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
  BEFORE UPDATE ON novastream.profiles
  FOR EACH ROW EXECUTE FUNCTION novastream.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON novastream.projects
  FOR EACH ROW EXECUTE FUNCTION novastream.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON novastream.posts
  FOR EACH ROW EXECUTE FUNCTION novastream.update_updated_at_column();

CREATE TRIGGER update_social_posts_updated_at
  BEFORE UPDATE ON novastream.social_posts
  FOR EACH ROW EXECUTE FUNCTION novastream.update_updated_at_column();

-- Expose schema to PostgREST
COMMENT ON SCHEMA novastream IS 'NovaStream Digital website schema';
