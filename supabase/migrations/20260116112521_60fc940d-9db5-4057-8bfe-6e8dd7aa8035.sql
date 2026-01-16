-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true);

-- Allow authenticated users to upload files
CREATE POLICY "Admins can upload project images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'project-images' 
  AND (SELECT is_admin())
);

-- Allow authenticated users to update their uploaded files
CREATE POLICY "Admins can update project images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'project-images'
  AND (SELECT is_admin())
);

-- Allow authenticated users to delete their uploaded files
CREATE POLICY "Admins can delete project images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'project-images'
  AND (SELECT is_admin())
);

-- Allow public read access to project images
CREATE POLICY "Public can view project images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'project-images');