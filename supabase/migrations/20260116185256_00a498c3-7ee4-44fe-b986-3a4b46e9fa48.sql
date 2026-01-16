-- Create storage bucket for social post thumbnails
INSERT INTO storage.buckets (id, name, public)
VALUES ('social-thumbnails', 'social-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to view thumbnails
CREATE POLICY "Anyone can view social thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'social-thumbnails');

-- Allow admins to upload thumbnails
CREATE POLICY "Admins can upload social thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'social-thumbnails' AND (SELECT is_admin()));

-- Allow admins to update thumbnails
CREATE POLICY "Admins can update social thumbnails"
ON storage.objects FOR UPDATE
USING (bucket_id = 'social-thumbnails' AND (SELECT is_admin()));

-- Allow admins to delete thumbnails
CREATE POLICY "Admins can delete social thumbnails"
ON storage.objects FOR DELETE
USING (bucket_id = 'social-thumbnails' AND (SELECT is_admin()));