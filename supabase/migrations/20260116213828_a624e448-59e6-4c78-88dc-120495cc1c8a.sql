-- Add metrics columns to social_posts table
ALTER TABLE public.social_posts 
ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS click_count integer DEFAULT 0;

-- Create index for faster sorting
CREATE INDEX IF NOT EXISTS idx_social_posts_display_order ON public.social_posts(display_order);