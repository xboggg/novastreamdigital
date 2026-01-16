-- Create function to increment view count
CREATE OR REPLACE FUNCTION public.increment_social_post_view(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE social_posts
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = post_id;
END;
$$;

-- Create function to increment click count
CREATE OR REPLACE FUNCTION public.increment_social_post_click(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE social_posts
  SET click_count = COALESCE(click_count, 0) + 1
  WHERE id = post_id;
END;
$$;

-- Grant execute permissions to anon and authenticated users
GRANT EXECUTE ON FUNCTION public.increment_social_post_view(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_social_post_click(UUID) TO anon, authenticated;