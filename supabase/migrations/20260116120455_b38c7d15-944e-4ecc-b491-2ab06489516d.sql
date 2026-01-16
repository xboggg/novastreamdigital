-- Create storage bucket for blog post images
INSERT INTO storage.buckets (id, name, public) VALUES ('post-images', 'post-images', true);

-- Allow public read access to post images
CREATE POLICY "Public can view post images"
ON storage.objects FOR SELECT
USING (bucket_id = 'post-images');

-- Allow authenticated admins to upload post images
CREATE POLICY "Admins can upload post images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'post-images' AND is_admin());

-- Allow admins to update post images
CREATE POLICY "Admins can update post images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'post-images' AND is_admin());

-- Allow admins to delete post images
CREATE POLICY "Admins can delete post images"
ON storage.objects FOR DELETE
USING (bucket_id = 'post-images' AND is_admin());