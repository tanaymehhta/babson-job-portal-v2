// Update the handle_new_user trigger to auto-verify alumni
// Run with: node scripts/update-signup-trigger.mjs

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const sqlMigration = `
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
    -- Auto-verify alumni users for immediate job posting access
    case when user_role = 'alumni' then true else false end
  );
  return new;
end;
$$;

-- Recreate trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
`;

async function updateTrigger() {
    console.log('🔧 Updating signup trigger...\n');

    try {
        // Execute the SQL migration - note this requires executing raw SQL
        // which may need to be done through the Supabase dashboard SQL editor
        console.log('⚠️  Note: This SQL needs to be executed in the Supabase SQL Editor:');
        console.log('🔗 https://supabase.com/dashboard/project/pwvvanowugjfotqqsspe/sql/new\n');
        console.log('📋 Copy and paste this SQL:\n');
        console.log('─'.repeat(80));
        console.log(sqlMigration);
        console.log('─'.repeat(80));
        console.log('\n✅ After running this SQL, new alumni signups will be automatically verified!');

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

updateTrigger();
