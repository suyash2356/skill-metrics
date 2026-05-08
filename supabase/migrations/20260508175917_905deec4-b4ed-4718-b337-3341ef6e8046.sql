
UPDATE public.resources SET domain = 'Technology'
WHERE is_active AND domain IN ('General','Web Development')
AND category IN ('Networking','Programming','Development','Computer Applications');

UPDATE public.resources SET domain = 'Business & Finance'
WHERE is_active AND domain = 'General' AND category = 'Business Administration';

-- Generic platforms with category='General' -> Technology (most common use)
UPDATE public.resources SET domain = 'Technology'
WHERE is_active AND domain = 'General' AND category = 'General';
