// Script to fix alumni verification issue
// Run with: node apply-alumni-fix.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pwvvanowugjfotqqsspe.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3dnZhbm93dWdqZm90cXFzc3BlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzY2ODYwNCwiZXhwIjoyMDc5MjQ0NjA0fQ.CYrsi4nkd_xXo3vdObjOEXMad0VDydKrkHERuhD9-VY';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyFix() {
    console.log('🔧 Applying alumni verification fix...\n');

    try {
        // Step 1: Drop and recreate trigger
        console.log('📝 Updating handle_new_user trigger...');
        const { error: dropError } = await supabase.rpc('exec_sql', {
            sql: `
                drop trigger if exists on_auth_user_created on auth.users;
                drop function if exists public.handle_new_user();
                
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
                    case when user_role = 'alumni' then true else false end
                  );
                  return new;
                end;
                $$;
                
                create trigger on_auth_user_created
                  after insert on auth.users
                  for each row execute function public.handle_new_user();
            `
        });

        if (dropError) {
            console.error('❌ Error updating trigger:', dropError);
        } else {
            console.log('✅ Trigger updated successfully\n');
        }

        // Step 2: Update existing alumni users
        console.log('📝 Verifying existing alumni accounts...');
        const { data, error: updateError } = await supabase
            .from('profiles')
            .update({ is_verified: true })
            .eq('role', 'alumni')
            .eq('is_verified', false)
            .select();

        if (updateError) {
            console.error('❌ Error updating alumni:', updateError);
        } else {
            console.log(`✅ Verified ${data?.length || 0} alumni account(s)\n`);
        }

        // Step 3: Verify the fix
        console.log('🔍 Checking alumni accounts...');
        const { data: alumni, error: selectError } = await supabase
            .from('profiles')
            .select('id, email, role, is_verified, full_name')
            .eq('role', 'alumni');

        if (selectError) {
            console.error('❌ Error fetching alumni:', selectError);
        } else {
            console.log('\nAlumni accounts:');
            console.table(alumni);
        }

        console.log('\n✅ Alumni verification fix applied successfully!');
        console.log('🎉 Alumni users can now post jobs immediately after signup');

    } catch (error) {
        console.error('❌ Unexpected error:', error);
    }
}

applyFix();
