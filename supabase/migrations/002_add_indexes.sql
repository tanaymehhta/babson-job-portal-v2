-- Add index on jobs(posted_by) to speed up alumni dashboard queries
create index if not exists idx_jobs_posted_by on jobs(posted_by);

-- Add index on applications(job_id) to speed up application counts
create index if not exists idx_applications_job_id on applications(job_id);
