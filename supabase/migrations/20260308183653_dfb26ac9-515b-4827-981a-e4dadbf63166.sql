
-- Expand post categories to support non-tech fields
ALTER TABLE posts DROP CONSTRAINT valid_post_category;
ALTER TABLE posts ADD CONSTRAINT valid_post_category CHECK (
  category IS NULL OR category = ANY (ARRAY[
    'Technology', 'Career', 'Resources', 'General', 'Non-Tech', 'Exam Prep',
    'Education', 'Programming', 'Design', 'Business', 'Science', 'Other',
    'Discussion', 'News', 'Projects', 'Web Development',
    'Arts', 'Music', 'Finance', 'Photography', 'Writing', 'Film',
    'Health', 'Culinary', 'Architecture', 'Psychology', 'Law', 'Fashion',
    'Animation', 'Environment', 'Journalism', 'Philosophy'
  ])
);
