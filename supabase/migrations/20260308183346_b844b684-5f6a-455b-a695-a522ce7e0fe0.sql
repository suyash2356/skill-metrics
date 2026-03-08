
-- Add non-tech domain categories that are missing
INSERT INTO categories (name, type, description, icon, color, display_order, is_active)
VALUES
  ('Fine Arts', 'domain', 'Drawing, painting, sculpture and visual arts', '🎨', 'pink', 50, true),
  ('Music', 'domain', 'Music theory, production, instruments and composition', '🎵', 'purple', 51, true),
  ('Creative Writing', 'domain', 'Fiction, non-fiction, poetry and storytelling', '✍️', 'orange', 52, true),
  ('Photography', 'domain', 'Digital and film photography, editing and composition', '📷', 'teal', 53, true),
  ('Film & Video', 'domain', 'Filmmaking, video editing and production', '🎬', 'red', 54, true),
  ('Graphic Design', 'domain', 'Visual design, branding, illustration and typography', '🖌️', 'indigo', 55, true),
  ('Interior Design', 'domain', 'Space planning, decoration and architectural design', '🏠', 'amber', 56, true),
  ('Fashion Design', 'domain', 'Fashion illustration, textiles, pattern-making', '👗', 'rose', 57, true),
  ('Accounting', 'domain', 'Financial accounting, auditing and taxation', '📊', 'emerald', 58, true),
  ('Investment', 'domain', 'Stock market, portfolio management and trading', '📈', 'green', 59, true),
  ('Psychology', 'domain', 'Clinical, cognitive, behavioral and social psychology', '🧠', 'violet', 60, true),
  ('Philosophy', 'domain', 'Ethics, logic, metaphysics and critical thinking', '💭', 'slate', 61, true),
  ('Culinary Arts', 'domain', 'Cooking, baking, food science and cuisine', '🍳', 'yellow', 62, true),
  ('Architecture', 'domain', 'Building design, urban planning and structural concepts', '🏛️', 'stone', 63, true),
  ('Health & Fitness', 'domain', 'Nutrition, exercise science and wellness', '💪', 'lime', 64, true),
  ('Education', 'domain', 'Teaching methods, pedagogy and curriculum design', '📚', 'sky', 65, true),
  ('Journalism', 'domain', 'News writing, reporting and media studies', '📰', 'zinc', 66, true),
  ('Animation', 'domain', '2D/3D animation, motion graphics and VFX', '🎞️', 'fuchsia', 67, true),
  ('Environmental Science', 'domain', 'Ecology, sustainability and climate studies', '🌿', 'green', 68, true),
  ('Law', 'domain', 'Legal studies, contracts and constitutional law', '⚖️', 'neutral', 69, true)
ON CONFLICT DO NOTHING;
