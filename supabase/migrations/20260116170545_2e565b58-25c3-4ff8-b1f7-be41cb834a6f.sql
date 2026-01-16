-- Create social_posts table for manual social media management
CREATE TABLE public.social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL CHECK (platform IN ('tiktok', 'youtube', 'instagram', 'facebook')),
  video_url TEXT NOT NULL,
  embed_id TEXT NOT NULL,
  title TEXT,
  thumbnail_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  status content_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view published featured social posts"
ON public.social_posts
FOR SELECT
USING ((status = 'published'::content_status) OR is_admin());

CREATE POLICY "Admins can insert social posts"
ON public.social_posts
FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "Admins can update social posts"
ON public.social_posts
FOR UPDATE
USING (is_admin());

CREATE POLICY "Admins can delete social posts"
ON public.social_posts
FOR DELETE
USING (is_admin());

-- Add trigger for updated_at
CREATE TRIGGER update_social_posts_updated_at
BEFORE UPDATE ON public.social_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();