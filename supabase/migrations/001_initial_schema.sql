-- Enable pgvector extension
create extension if not exists vector;

-- Profiles Table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  role text check (role in ('alumni', 'student', 'admin')) not null,
  is_verified boolean default false,
  full_name text,
  email text,
  company_name text,
  linkedin_url text,
  bio text,
  resume_text text,
  embedding vector(1536),
  created_at timestamptz default now() not null
);

-- Jobs Table
create table jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date_posted date default current_date not null,
  company_name text not null,
  location_type text check (location_type in ('Virtual', 'Hybrid', 'Onsite')),
  location_specifics text,
  is_paid boolean default false,
  babson_connection text,
  link text,
  requirements text[],
  salary_min integer,
  salary_max integer,
  embedding vector(1536),
  posted_by uuid references profiles(id),
  status text check (status in ('active', 'closed', 'draft')) default 'active',
  created_at timestamptz default now() not null
);

-- Applications Table
create table applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs(id) on delete cascade not null,
  student_id uuid references profiles(id) on delete cascade not null,
  status text check (status in ('pending', 'reviewing', 'accepted', 'rejected')) default 'pending',
  cover_note text,
  created_at timestamptz default now() not null
);

-- Events Table
create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date timestamptz not null,
  link text,
  description text,
  location_type text check (location_type in ('Onsite', 'Virtual', 'Both')),
  location_specifics text,
  industry text check (industry in ('Consulting', 'Technology', 'CPG', 'Product Management', 'Healthcare', 'Venture Capital / Private Equity', 'Real Estate')),
  event_type text check (event_type in ('Networking Event', 'Employer-Sponsored', 'Workshop')),
  embedding vector(1536),
  created_at timestamptz default now() not null
);

-- RLS Policies
alter table profiles enable row level security;
alter table jobs enable row level security;
alter table applications enable row level security;
alter table events enable row level security;

create policy "profiles_select" on profiles for select using (true);
create policy "profiles_insert" on profiles for insert with check (auth.uid() = id);
create policy "profiles_update" on profiles for update using (auth.uid() = id);

create policy "jobs_select" on jobs for select using (true);
create policy "jobs_insert" on jobs for insert with check (
  exists (
    select 1 from profiles
    where id = auth.uid() and role = 'alumni' and is_verified = true
  )
);
create policy "jobs_update" on jobs for update using (posted_by = auth.uid());

create policy "applications_select_student" on applications for select using (student_id = auth.uid());
create policy "applications_select_alumni" on applications for select using (
  exists (select 1 from jobs where jobs.id = applications.job_id and jobs.posted_by = auth.uid())
);
create policy "applications_insert" on applications for insert with check (student_id = auth.uid());

create policy "events_select" on events for select using (true);

-- Vector Search Functions
create or replace function match_jobs(query_embedding vector(1536), match_threshold float, match_count int)
returns table (id uuid, title text, company_name text, similarity float)
language plpgsql
as $$
begin
  return query
  select jobs.id, jobs.title, jobs.company_name, 1 - (jobs.embedding <=> query_embedding) as similarity
  from jobs
  where 1 - (jobs.embedding <=> query_embedding) > match_threshold
  order by jobs.embedding <=> query_embedding
  limit match_count;
end;
$$;

create or replace function match_events(query_embedding vector(1536), match_threshold float, match_count int)
returns table (id uuid, title text, event_type text, similarity float)
language plpgsql
as $$
begin
  return query
  select events.id, events.title, events.event_type, 1 - (events.embedding <=> query_embedding) as similarity
  from events
  where 1 - (events.embedding <=> query_embedding) > match_threshold
  order by events.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into profiles (id, role, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
