-- Drop old check constraint and add new one that includes tech/non-tech
ALTER TABLE categories DROP CONSTRAINT categories_type_check;
ALTER TABLE categories ADD CONSTRAINT categories_type_check CHECK (type = ANY (ARRAY['domain', 'exam', 'tech', 'non-tech']));

-- Update tech categories
UPDATE categories SET type = 'tech' WHERE name IN (
  'AI/ML', 'Artificial Intelligence', 'Blockchain', 'Cloud Computing',
  'Computer Applications', 'Computer Science', 'Cybersecurity',
  'Data Science', 'Development', 'DevOps',
  'Digital Marketing', 'Full Stack Development',
  'Mobile Development', 'Networking',
  'Programming', 'Python',
  'UI/UX Design', 'Web Development'
) AND type = 'domain';

-- Update non-tech categories
UPDATE categories SET type = 'non-tech' WHERE name IN (
  'Accounting', 'Animation', 'Architecture', 'Business Administration',
  'Creative Writing', 'Culinary Arts', 'Design',
  'Education', 'Environmental Science', 'Fashion Design',
  'Film & Video', 'Finance', 'Fine Arts', 'General',
  'Graphic Design', 'Health & Fitness', 'Interior Design',
  'Investment', 'Journalism', 'Law', 'Management',
  'Music', 'Philosophy', 'Photography',
  'Project Management', 'Psychology'
) AND type = 'domain';