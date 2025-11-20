-- Relax RLS policy for jobs table to allow all alumni to post
-- Previously it required is_verified = true

drop policy if exists "jobs_insert" on jobs;

create policy "jobs_insert" on jobs for insert with check (
  exists (
    select 1 from profiles
    where id = auth.uid() and role = 'alumni'
  )
);
