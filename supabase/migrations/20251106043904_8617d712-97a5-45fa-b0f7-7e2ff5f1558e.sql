-- Update the timetables bucket to allow larger files (25MB)
UPDATE storage.buckets 
SET file_size_limit = 26214400  -- 25MB in bytes
WHERE id = 'timetables';