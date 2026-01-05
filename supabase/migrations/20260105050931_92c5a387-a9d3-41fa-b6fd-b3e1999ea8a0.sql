-- Create resources table to store all learning resources
CREATE TABLE public.resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  link TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  is_free BOOLEAN NOT NULL DEFAULT true,
  icon TEXT DEFAULT '📚',
  color TEXT DEFAULT 'blue',
  related_skills TEXT[] DEFAULT '{}',
  relevant_backgrounds TEXT[] DEFAULT '{}',
  provider TEXT,
  duration TEXT,
  rating DECIMAL(2,1),
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admins table to store admin user IDs
CREATE TABLE public.admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on resources
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Resources are viewable by everyone
CREATE POLICY "Resources are viewable by everyone" 
ON public.resources 
FOR SELECT 
USING (is_active = true);

-- Only admins can insert resources
CREATE POLICY "Admins can insert resources" 
ON public.resources 
FOR INSERT 
WITH CHECK (
  EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
);

-- Only admins can update resources
CREATE POLICY "Admins can update resources" 
ON public.resources 
FOR UPDATE 
USING (
  EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
);

-- Only admins can delete resources
CREATE POLICY "Admins can delete resources" 
ON public.resources 
FOR DELETE 
USING (
  EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
);

-- Enable RLS on admins table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Only admins can view admin list
CREATE POLICY "Admins can view admin list" 
ON public.admins 
FOR SELECT 
USING (
  EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
);

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.admins WHERE user_id = user_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to add first admin (can only be called once when no admins exist)
CREATE OR REPLACE FUNCTION public.register_first_admin(admin_user_id UUID, admin_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Only allow if no admins exist yet
  IF EXISTS (SELECT 1 FROM public.admins LIMIT 1) THEN
    RETURN FALSE;
  END IF;
  
  INSERT INTO public.admins (user_id, email) VALUES (admin_user_id, admin_email);
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update updated_at
CREATE TRIGGER update_resources_updated_at
BEFORE UPDATE ON public.resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some initial resources (migrated from code)
INSERT INTO public.resources (title, description, link, category, difficulty, is_free, icon, color, related_skills, relevant_backgrounds, provider) VALUES
-- Machine Learning
('fast.ai - Practical Deep Learning', 'Free course teaching deep learning from top-down approach. Perfect for beginners who want practical skills first.', 'https://course.fast.ai/', 'Machine Learning', 'beginner', true, '🧠', 'purple', ARRAY['Python', 'Deep Learning', 'PyTorch'], ARRAY['student', 'professional', 'self-learner'], 'fast.ai'),
('Andrew Ng Machine Learning Specialization', 'Comprehensive ML course by Andrew Ng on Coursera. Industry standard introduction to machine learning.', 'https://www.coursera.org/specializations/machine-learning-introduction', 'Machine Learning', 'beginner', false, '🤖', 'blue', ARRAY['Python', 'Machine Learning', 'TensorFlow'], ARRAY['student', 'professional'], 'Coursera'),
('Kaggle Learn', 'Free micro-courses on ML, Python, SQL, and more with hands-on exercises and competitions.', 'https://www.kaggle.com/learn', 'Machine Learning', 'beginner', true, '📊', 'cyan', ARRAY['Python', 'Machine Learning', 'Data Science'], ARRAY['student', 'self-learner'], 'Kaggle'),

-- Data Science
('Python for Data Science Handbook', 'Free online book covering NumPy, Pandas, Matplotlib, and Scikit-Learn fundamentals.', 'https://jakevdp.github.io/PythonDataScienceHandbook/', 'Data Science', 'beginner', true, '📕', 'green', ARRAY['Python', 'NumPy', 'Pandas', 'Data Analysis'], ARRAY['student', 'professional', 'self-learner'], 'Jake VanderPlas'),
('DataCamp', 'Interactive learning platform for data science with hands-on coding exercises.', 'https://www.datacamp.com/', 'Data Science', 'beginner', false, '📈', 'green', ARRAY['Python', 'R', 'SQL', 'Data Science'], ARRAY['student', 'professional'], 'DataCamp'),
('Mode Analytics SQL Tutorial', 'Free comprehensive SQL tutorial with real-world examples and practice datasets.', 'https://mode.com/sql-tutorial/', 'Data Science', 'beginner', true, '🗃️', 'orange', ARRAY['SQL', 'Data Analysis', 'Database'], ARRAY['student', 'self-learner'], 'Mode Analytics'),

-- Web Development
('The Odin Project', 'Free full-stack curriculum covering HTML, CSS, JavaScript, Node.js, and Ruby on Rails.', 'https://www.theodinproject.com/', 'Web Development', 'beginner', true, '🌐', 'orange', ARRAY['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'], ARRAY['student', 'self-learner'], 'The Odin Project'),
('freeCodeCamp', 'Free coding bootcamp with 3000+ hours of curriculum and certifications.', 'https://www.freecodecamp.org/', 'Web Development', 'beginner', true, '⚡', 'green', ARRAY['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'], ARRAY['student', 'self-learner'], 'freeCodeCamp'),
('MDN Web Docs', 'Comprehensive documentation for web technologies by Mozilla. The definitive web development reference.', 'https://developer.mozilla.org/', 'Web Development', 'intermediate', true, '📖', 'blue', ARRAY['HTML', 'CSS', 'JavaScript', 'Web APIs'], ARRAY['student', 'professional', 'self-learner'], 'Mozilla'),

-- Python
('Python Official Tutorial', 'Official Python documentation and tutorial. Best authoritative resource for Python.', 'https://docs.python.org/3/tutorial/', 'Python', 'beginner', true, '🐍', 'yellow', ARRAY['Python'], ARRAY['student', 'self-learner'], 'Python.org'),
('Real Python', 'Comprehensive Python tutorials with practical examples for all skill levels.', 'https://realpython.com/', 'Python', 'intermediate', false, '🐍', 'blue', ARRAY['Python', 'Django', 'Flask'], ARRAY['student', 'professional'], 'Real Python'),
('Automate the Boring Stuff with Python', 'Free book teaching practical Python programming for automating everyday tasks.', 'https://automatetheboringstuff.com/', 'Python', 'beginner', true, '🤖', 'green', ARRAY['Python', 'Automation'], ARRAY['student', 'self-learner'], 'Al Sweigart'),

-- Cloud & DevOps
('AWS Free Tier + Training', 'Free AWS cloud training resources and 12-month free tier access.', 'https://aws.amazon.com/training/', 'Cloud Computing', 'beginner', true, '☁️', 'orange', ARRAY['AWS', 'Cloud', 'DevOps'], ARRAY['professional', 'student'], 'Amazon'),
('Google Cloud Skills Boost', 'Free labs and courses for Google Cloud Platform certifications.', 'https://www.cloudskillsboost.google/', 'Cloud Computing', 'intermediate', true, '🌩️', 'blue', ARRAY['GCP', 'Cloud', 'Kubernetes'], ARRAY['professional', 'student'], 'Google'),
('Docker Official Tutorial', 'Learn Docker containerization from the official documentation.', 'https://docs.docker.com/get-started/', 'DevOps', 'beginner', true, '🐳', 'blue', ARRAY['Docker', 'Containers', 'DevOps'], ARRAY['professional', 'student'], 'Docker'),

-- Cyber Security
('TryHackMe', 'Gamified cybersecurity training platform with hands-on labs.', 'https://tryhackme.com/', 'Cyber Security', 'beginner', true, '🔐', 'green', ARRAY['Security', 'Penetration Testing', 'Linux'], ARRAY['student', 'professional'], 'TryHackMe'),
('OWASP Web Security Testing Guide', 'Comprehensive guide for web application security testing.', 'https://owasp.org/www-project-web-security-testing-guide/', 'Cyber Security', 'intermediate', true, '🛡️', 'blue', ARRAY['Security', 'Web Security', 'Penetration Testing'], ARRAY['professional'], 'OWASP'),
('Cybrary', 'Free cybersecurity courses and certification prep materials.', 'https://www.cybrary.it/', 'Cyber Security', 'beginner', true, '🔒', 'purple', ARRAY['Security', 'CompTIA', 'Networking'], ARRAY['student', 'self-learner'], 'Cybrary');
