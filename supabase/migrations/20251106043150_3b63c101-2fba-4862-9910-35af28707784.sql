-- Create storage bucket for timetable uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'timetables',
  'timetables',
  false,
  5242880, -- 5MB limit
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']
);

-- Create RLS policies for timetables bucket
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'timetables');

CREATE POLICY "Allow authenticated to view their own files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'timetables');