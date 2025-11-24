-- Create enum for application status
create type application_status as enum (
  'saved',
  'preparing',
  'applied',
  'interview_round_1',
  'interview_round_2',
  'interview_round_3',
  'interview_final',
  'offer_received',
  'accepted',
  'rejected',
  'withdrawn'
);

-- Create job_applications table
create table job_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  role text not null,
  company text not null,
  location text not null,
  pay text,
  status application_status not null,
  date_applied date,
  application_deadline date,
  next_steps text,
  link text,
  resume_version text,
  contact_person text,
  interview_stage text,
  comments text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table job_applications enable row level security;

-- Policies
create policy "Users can view their own applications"
  on job_applications for select
  using (auth.uid() = user_id);

create policy "Users can insert their own applications"
  on job_applications for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own applications"
  on job_applications for update
  using (auth.uid() = user_id);

create policy "Users can delete their own applications"
  on job_applications for delete
  using (auth.uid() = user_id);

-- Indexes
create index job_applications_user_id_idx on job_applications(user_id);
create index job_applications_status_idx on job_applications(status);
