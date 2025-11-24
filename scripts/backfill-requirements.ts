import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role to bypass RLS if needed, or ANON if RLS allows
);

// Fallback to anon key if service role is missing (for local dev it might be in .env.local as ANON)
// Actually, for a script, we usually need SERVICE_ROLE_KEY to write to all rows.
// Let's check if we have it. If not, we might need to rely on the user providing it or use ANON and hope RLS allows update (unlikely for all jobs).
// Given the previous context, the user has .env.local. I'll assume it has the keys.

async function backfill() {
    console.log('Starting backfill of application_requirements...');

    const { data: jobs, error } = await supabase
        .from('jobs')
        .select('id, requirements, application_requirements');

    if (error) {
        console.error('Error fetching jobs:', error);
        return;
    }

    console.log(`Found ${jobs.length} jobs.`);

    for (const job of jobs) {
        // Default requirements
        const newReqs = {
            resume: true, // Default to true
            cover_letter: false,
            transcript: false,
            portfolio: false,
            references: false,
            writing_sample: false
        };

        // Simple keyword matching from the existing 'requirements' array
        if (job.requirements && Array.isArray(job.requirements)) {
            const reqText = job.requirements.join(' ').toLowerCase();

            if (reqText.includes('cover letter')) newReqs.cover_letter = true;
            if (reqText.includes('transcript')) newReqs.transcript = true;
            if (reqText.includes('portfolio') || reqText.includes('work sample')) newReqs.portfolio = true;
            if (reqText.includes('reference')) newReqs.references = true;
            if (reqText.includes('writing sample')) newReqs.writing_sample = true;
        }

        // Update the job
        const { error: updateError } = await supabase
            .from('jobs')
            .update({ application_requirements: newReqs })
            .eq('id', job.id);

        if (updateError) {
            console.error(`Failed to update job ${job.id}:`, updateError);
        } else {
            console.log(`Updated job ${job.id} with requirements:`, newReqs);
        }
    }

    console.log('Backfill complete!');
}

backfill().catch(console.error);
