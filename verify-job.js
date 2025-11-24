const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verify() {
    console.log('🔍 Verifying On Campus Job Support (Direct DB Test)...\n');

    // 1. Try to INSERT a job with 'On Campus'
    const testJob = {
        title: 'Direct DB Test Job',
        company_name: 'Test Corp',
        location_type: 'On Campus', // This is what we are testing
        location_specifics: 'Babson Campus',
        posted_by: 'd0d8c19c-3b3d-4f4e-9f3a-8b8b8b8b8b8b', // Dummy UUID, might fail FK if not exists. 
        // We need a valid user ID. Let's fetch one first.
    };

    // Fetch a valid user ID (any profile)
    const { data: profiles } = await supabase.from('profiles').select('id').limit(1);
    if (!profiles || profiles.length === 0) {
        console.error('❌ No profiles found to use as author.');
        return;
    }
    testJob.posted_by = profiles[0].id;

    console.log(`Attempting to insert job with location_type: '${testJob.location_type}'...`);

    const { data, error } = await supabase
        .from('jobs')
        .insert(testJob)
        .select();

    if (error) {
        console.error('❌ Insert failed:', error.message);
        if (error.message.includes('check constraint')) {
            console.error('   Reason: The database constraint still does not allow "On Campus".');
        }
    } else {
        console.log('✅ Insert successful!');
        console.log('   Job ID:', data[0].id);
        console.log('   Location Type:', data[0].location_type);

        // Clean up
        await supabase.from('jobs').delete().eq('id', data[0].id);
        console.log('   (Test job deleted)');
    }
}

verify().catch(console.error);
