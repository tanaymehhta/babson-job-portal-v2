-- Auto-verify alumni users on signup
-- This migration updates the handle_new_user trigger to automatically set is_verified = true for alumni users

-- Drop existing trigger and function
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Recreate function with auto-verification for alumni
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  user_role text;
begin
  user_role := coalesce(new.raw_user_meta_data->>'role', 'student');
  
  insert into public.profiles (id, role, full_name, email, is_verified)
  values (
    new.id,
    user_role,
    new.raw_user_meta_data->>'full_name',
    new.email,
    -- Auto-verify alumni users, students remain unverified by default
    case when user_role = 'alumni' then true else false end
  );
  return new;
end;
$$;

-- Recreate trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Update existing alumni users to be verified (for testing)
update public.profiles
set is_verified = true
where role = 'alumni' and is_verified = false;
