-- Insert sample video posts using an existing user
DO $$
DECLARE
  sample_user_id uuid;
BEGIN
  SELECT user_id INTO sample_user_id FROM public.profiles LIMIT 1;
  
  IF sample_user_id IS NOT NULL THEN
    -- Video Post 1: Tech Tutorial
    INSERT INTO public.posts (user_id, title, content, category, tags)
    VALUES (
      sample_user_id,
      'Introduction to React Hooks - Complete Tutorial',
      'Learn how to use React Hooks effectively in your projects! This comprehensive tutorial covers useState, useEffect, useContext, and custom hooks.

https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4

#ReactJS #WebDevelopment #JavaScript #Tutorial',
      'Technology',
      ARRAY['react', 'javascript', 'tutorial', 'webdev']
    );

    -- Video Post 2: Career Advice
    INSERT INTO public.posts (user_id, title, content, category, tags)
    VALUES (
      sample_user_id,
      'Day in the Life of a Software Engineer at Google',
      'Ever wondered what it''s like to work at a big tech company? Here''s a glimpse into my daily routine as a software engineer at Google.

https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4

#TechCareer #Google #SoftwareEngineering #DayInTheLife',
      'Career',
      ARRAY['career', 'google', 'software-engineering', 'tech']
    );

    -- Video Post 3: Productivity Tips
    INSERT INTO public.posts (user_id, title, content, category, tags)
    VALUES (
      sample_user_id,
      'My Morning Routine for Maximum Productivity',
      'Starting your day right can make all the difference! Here are my top productivity tips and morning routine that helped me become more efficient.

https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4

#Productivity #MorningRoutine #LifeHacks #Success',
      'Resources',
      ARRAY['productivity', 'morning-routine', 'tips', 'success']
    );

    -- Video Post 4: Coding Project Demo
    INSERT INTO public.posts (user_id, title, content, category, tags)
    VALUES (
      sample_user_id,
      'Building a Full-Stack App from Scratch - Live Demo',
      'Watch as I build a complete full-stack application using React, Node.js, and PostgreSQL. From setup to deployment!

https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4

This video covers:
- Project setup and architecture
- Frontend development with React
- Backend API with Node.js
- Database design and queries
- Deployment to production

#FullStack #WebDev #React #NodeJS #PostgreSQL',
      'Technology',
      ARRAY['fullstack', 'react', 'nodejs', 'postgresql', 'tutorial']
    );

    -- Video Post 5: Interview Tips
    INSERT INTO public.posts (user_id, title, content, category, tags)
    VALUES (
      sample_user_id,
      'How I Passed My Technical Interview at Microsoft',
      'Sharing my experience and tips for acing technical interviews at top tech companies. From preparation to the actual interview process.

https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4

Key takeaways:
- How to prepare effectively
- Common interview patterns
- Behavioral interview tips
- Salary negotiation strategies

#TechInterview #Microsoft #CareerAdvice #JobSearch',
      'Career',
      ARRAY['interview', 'microsoft', 'career', 'job-search', 'tips']
    );
  END IF;
END $$;