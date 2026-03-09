
-- Add missing exam categories
INSERT INTO categories (name, type, description, icon, color, is_active, display_order) VALUES
  ('GMAT', 'exam', 'Graduate Management Admission Test for MBA programs', 'GraduationCap', 'from-purple-500 to-indigo-500', true, 120),
  ('IELTS', 'exam', 'International English Language Testing System', 'GraduationCap', 'from-blue-500 to-cyan-500', true, 121),
  ('JEE', 'exam', 'Joint Entrance Examination for engineering in India', 'GraduationCap', 'from-orange-500 to-red-500', true, 122),
  ('LSAT', 'exam', 'Law School Admission Test', 'GraduationCap', 'from-slate-500 to-gray-700', true, 123),
  ('MCAT', 'exam', 'Medical College Admission Test', 'GraduationCap', 'from-green-500 to-emerald-500', true, 124),
  ('NEET', 'exam', 'National Eligibility cum Entrance Test for medical in India', 'GraduationCap', 'from-teal-500 to-cyan-500', true, 125),
  ('SAT', 'exam', 'Scholastic Assessment Test for college admissions', 'GraduationCap', 'from-blue-600 to-indigo-500', true, 126),
  ('TOEFL', 'exam', 'Test of English as a Foreign Language', 'GraduationCap', 'from-sky-500 to-blue-500', true, 127)
ON CONFLICT DO NOTHING;

-- Add missing domain categories (orphaned resource categories)
INSERT INTO categories (name, type, description, icon, color, is_active, display_order) VALUES
  ('Communication', 'non-tech', 'Communication, public speaking, and interpersonal skills', 'MessageCircle', 'from-pink-500 to-rose-500', true, 130),
  ('Marketing', 'non-tech', 'Marketing strategy, branding, and growth', 'Megaphone', 'from-orange-500 to-amber-500', true, 131),
  ('Performing Arts', 'non-tech', 'Dance, theater, acting, and stage performance', 'Drama', 'from-purple-500 to-pink-500', true, 132),
  ('Database', 'tech', 'Database design, SQL, NoSQL, and data management', 'Database', 'from-cyan-500 to-blue-500', true, 133),
  ('DSA', 'tech', 'Data Structures and Algorithms', 'Code', 'from-green-600 to-emerald-500', true, 134),
  ('JavaScript', 'tech', 'JavaScript programming language and ecosystem', 'Code', 'from-yellow-500 to-amber-500', true, 135),
  ('System Design', 'tech', 'System architecture, scalability, and design patterns', 'Cpu', 'from-gray-500 to-slate-600', true, 136),
  ('Business', 'non-tech', 'Business fundamentals, strategy, and entrepreneurship', 'Briefcase', 'from-blue-500 to-indigo-500', true, 137)
ON CONFLICT DO NOTHING;

-- Remove duplicate exam categories with prefix
DELETE FROM categories WHERE name LIKE 'Exam Prep -%';

-- Fix Digital Marketing: should be non-tech (marketing is not a tech domain)
UPDATE categories SET type = 'non-tech' WHERE name = 'Digital Marketing' AND type = 'tech';

-- Fix UI/UX Design: it's a design field, non-tech
UPDATE categories SET type = 'non-tech' WHERE name = 'UI/UX Design' AND type = 'tech';
