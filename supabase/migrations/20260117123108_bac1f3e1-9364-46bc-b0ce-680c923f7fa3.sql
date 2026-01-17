-- Create a public view for social posts that excludes analytics columns
CREATE VIEW public.social_posts_public
WITH (security_invoker=on) AS
  SELECT 
    id, 
    platform, 
    video_url, 
    embed_id, 
    title, 
    thumbnail_url,
    status,
    display_order,
    is_featured,
    created_at,
    updated_at
  FROM public.social_posts
  WHERE status = 'published'::content_status;
  -- Excludes view_count and click_count

-- Drop the old public SELECT policy
DROP POLICY IF EXISTS "Public can view published featured social posts" ON public.social_posts;

-- Create new policy that only allows admins to SELECT from the base table
CREATE POLICY "Only admins can select from social_posts base table"
  ON public.social_posts
  FOR SELECT
  USING (is_admin());

-- Grant SELECT on the public view to authenticated and anon roles
GRANT SELECT ON public.social_posts_public TO authenticated, anon;