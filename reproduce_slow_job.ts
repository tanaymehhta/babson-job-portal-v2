
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testFetch() {
    console.log('Fetching a job ID...');
    const { data: jobs, error: listError } = await supabase
        .from('jobs')
        .select('id')
        .limit(1);

    if (listError || !jobs || jobs.length === 0) {
        console.error('Failed to fetch job list:', listError);
        return;
    }

    const jobId = jobs[0].id;
    console.log(`Testing with Job ID: ${jobId}`);

    // Test 1: Fetch all columns (current behavior)
    const start1 = performance.now();
    const { error: error1 } = await supabase
        .from('jobs')
        .select('*, profiles(company_name, full_name)')
        .eq('id', jobId)
        .single();
    const end1 = performance.now();

    if (error1) console.error('Error 1:', error1);
    console.log(`Fetch * took: ${(end1 - start1).toFixed(2)}ms`);

    // Test 2: Fetch explicit columns (optimized)
    const start2 = performance.now();
    const { error: error2 } = await supabase
        .from('jobs')
        .select(`
            id, 
            title, 
            company_name, 
            location_type, 
            location_specifics, 
            salary_min, 
            salary_max, 
            date_posted, 
            link, 
            requirements, 
            application_requirements, 
            babson_connection, 
            posted_by, 
            status, 
            created_at,
            profiles(company_name, full_name)
        `)
        .eq('id', jobId)
        .single();
    const end2 = performance.now();

    if (error2) console.error('Error 2:', error2);
    console.log(`Fetch explicit took: ${(end2 - start2).toFixed(2)}ms`);
}

testFetch().catch(console.error);
