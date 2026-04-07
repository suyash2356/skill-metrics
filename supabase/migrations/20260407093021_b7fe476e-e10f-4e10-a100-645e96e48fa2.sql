
SELECT cron.schedule(
  'daily-tech-news-6am-ist',
  '30 0 * * *',
  $$
  SELECT net.http_post(
    url:='https://vecdjxbrkaqpvftwoafj.supabase.co/functions/v1/daily-tech-news',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlY2RqeGJya2FxcHZmdHdvYWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTg0OTksImV4cCI6MjA3MzgzNDQ5OX0.5MlACmnknf5dki0JMSNimzMJbJEf9M4V2_VzPq8mOqw"}'::jsonb,
    body:='{"time": "scheduled"}'::jsonb
  ) AS request_id;
  $$
);
