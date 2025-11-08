-- Fix storage RLS policies for timetables bucket
-- Remove overly permissive policy
DROP POLICY IF EXISTS "Allow authenticated to view their own files" ON storage.objects;

-- Create proper user-scoped policies
CREATE POLICY "Users can view their own files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'timetables' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'timetables' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'timetables' AND auth.uid()::text = (storage.foldername(name))[1]);