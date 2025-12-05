-- Insert sample multi-photo carousel post
INSERT INTO public.posts (user_id, title, content, category, tags, created_at)
SELECT 
  (SELECT user_id FROM public.profiles LIMIT 1),
  'My Travel Photography Collection 📸',
  'Just got back from an amazing trip! Here are some of my favorite shots from the journey. Each photo captures a unique moment that I''ll cherish forever.

![Beach Sunset](https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800)

![Mountain Vista](https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800)

![City Skyline](https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800)

![Forest Path](https://images.unsplash.com/photo-1448375240586-882707db888b?w=800)

What''s your favorite travel destination? Let me know in the comments!',
  'Design',
  ARRAY['travel', 'photography', 'nature', 'adventure'],
  NOW() - INTERVAL '2 hours'
WHERE EXISTS (SELECT 1 FROM public.profiles LIMIT 1);

-- Insert sample document post
INSERT INTO public.posts (user_id, title, content, category, tags, created_at)
SELECT 
  (SELECT user_id FROM public.profiles LIMIT 1),
  'Free Learning Resources: Complete Study Guide 📚',
  'I''ve compiled some amazing free resources that helped me in my learning journey. Feel free to download and use them!

Here are the documents I''m sharing:

[Attachment: React-Complete-Guide-2024.pdf](https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.jpg)

[Attachment: JavaScript-Cheatsheet.pdf](https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.jpg)

[Attachment: System-Design-Notes.docx](https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.jpg)

These resources cover everything from basics to advanced concepts. Hope they help you in your learning journey!',
  'Programming',
  ARRAY['resources', 'learning', 'free', 'programming'],
  NOW() - INTERVAL '4 hours'
WHERE EXISTS (SELECT 1 FROM public.profiles LIMIT 1);

-- Insert sample post with both images and documents
INSERT INTO public.posts (user_id, title, content, category, tags, created_at)
SELECT 
  (SELECT user_id FROM public.profiles LIMIT 1),
  'Complete Web Development Course Materials 🚀',
  'Sharing my complete course materials for web development! Includes slides, code samples, and reference documents.

Course preview images:

![Course Overview](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800)

![Coding Session](https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800)

![Project Demo](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800)

Download the course materials:

[Attachment: Course-Slides-Week1.pptx](https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.jpg)

[Attachment: Project-Starter-Code.zip](https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.jpg)

[Attachment: Reference-Documentation.pdf](https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.jpg)

Let me know if you have any questions about the materials!',
  'Web Development',
  ARRAY['webdev', 'course', 'tutorial', 'coding'],
  NOW() - INTERVAL '1 hour'
WHERE EXISTS (SELECT 1 FROM public.profiles LIMIT 1);