-- Fix for handle_new_user trigger
-- This script drops the existing trigger and function and recreates them with explicit search_path
-- and public schema references to avoid path resolution issues.

-- 1. Drop existing trigger and function
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists handle_new_user();
drop function if exists public.handle_new_user(); -- In case it was created in public

-- 2. Recreate function with security definer and search_path
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  return new;
end;
$$;

-- 3. Recreate trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4. Ensure profiles table has correct permissions (just in case)
grant all on table public.profiles to postgres;
grant all on table public.profiles to service_role;
