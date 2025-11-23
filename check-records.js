const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkRecords() {
    console.log('🔍 Checking Supabase Records...\n');
    console.log('Connected to:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('='.repeat(80));

    // Check jobs table
    console.log('\n📋 JOBS TABLE:');
    console.log('-'.repeat(80));

    const { data: jobs, error: jobsError, count: jobsCount } = await supabase
        .from('jobs')
        .select('*', { count: 'exact' })
        .limit(5);

    if (jobsError) {
        console.error('❌ Error fetching jobs:', jobsError);
    } else {
        console.log(`\n✅ Total Jobs: ${jobsCount}`);
        console.log('\n📝 Sample Records (first 5):');
        jobs.forEach((job, index) => {
            console.log(`\n--- Job ${index + 1} ---`);
            console.log(`ID: ${job.id}`);
            console.log(`Title: ${job.title}`);
            console.log(`Company: ${job.company_name}`);
            console.log(`Location Type: ${job.location_type}`);
            console.log(`Location Specifics: ${job.location_specifics?.substring(0, 100)}...`);
            console.log(`Posted By: ${job.posted_by}`);
            console.log(`Date Posted: ${job.date_posted}`);
            console.log(`Status: ${job.status}`);
            console.log(`Salary Range: $${job.salary_min} - $${job.salary_max}`);
            console.log(`Requirements: ${job.requirements?.join(', ')}`);
            console.log(`Has Embedding: ${job.embedding ? 'Yes' : 'No'}`);
        });
    }

    // Check events table
    console.log('\n\n' + '='.repeat(80));
    console.log('\n🎉 EVENTS TABLE:');
    console.log('-'.repeat(80));

    const { data: events, error: eventsError, count: eventsCount } = await supabase
        .from('events')
        .select('*', { count: 'exact' })
        .limit(5);

    if (eventsError) {
        console.error('❌ Error fetching events:', eventsError);
    } else {
        console.log(`\n✅ Total Events: ${eventsCount}`);
        console.log('\n📝 Sample Records (first 5):');
        events.forEach((event, index) => {
            console.log(`\n--- Event ${index + 1} ---`);
            console.log(`ID: ${event.id}`);
            console.log(`Title: ${event.title}`);
            console.log(`Type: ${event.event_type}`);
            console.log(`Date: ${event.date}`);
            console.log(`Location Type: ${event.location_type}`);
            console.log(`Location Specifics: ${event.location_specifics}`);
            console.log(`Description: ${event.description?.substring(0, 100)}...`);
            console.log(`Industry: ${event.industry}`);
            console.log(`Has Embedding: ${event.embedding ? 'Yes' : 'No'}`);
        });
    }

    // Check profiles table
    console.log('\n\n' + '='.repeat(80));
    console.log('\n👥 PROFILES TABLE:');
    console.log('-'.repeat(80));

    const { data: profiles, error: profilesError, count: profilesCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .limit(5);

    if (profilesError) {
        console.error('❌ Error fetching profiles:', profilesError);
    } else {
        console.log(`\n✅ Total Profiles: ${profilesCount}`);
        console.log('\n📝 Sample Records (first 5):');
        profiles.forEach((profile, index) => {
            console.log(`\n--- Profile ${index + 1} ---`);
            console.log(`ID: ${profile.id}`);
            console.log(`Email: ${profile.email}`);
            console.log(`Role: ${profile.role}`);
            console.log(`Full Name: ${profile.full_name}`);
            console.log(`Created At: ${profile.created_at}`);
        });
    }

    // Check applications table
    console.log('\n\n' + '='.repeat(80));
    console.log('\n📨 APPLICATIONS TABLE:');
    console.log('-'.repeat(80));

    const { data: applications, error: applicationsError, count: applicationsCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact' })
        .limit(5);

    if (applicationsError) {
        console.error('❌ Error fetching applications:', applicationsError);
    } else {
        console.log(`\n✅ Total Applications: ${applicationsCount}`);
        if (applicationsCount > 0) {
            console.log('\n📝 Sample Records (first 5):');
            applications.forEach((app, index) => {
                console.log(`\n--- Application ${index + 1} ---`);
                console.log(`ID: ${app.id}`);
                console.log(`Job ID: ${app.job_id}`);
                console.log(`User ID: ${app.user_id}`);
                console.log(`Status: ${app.status}`);
                console.log(`Applied At: ${app.applied_at}`);
            });
        } else {
            console.log('\nℹ️  No applications found.');
        }
    }

    console.log('\n' + '='.repeat(80));
    console.log('\n✨ Record check complete!\n');
}

checkRecords().catch(console.error);
