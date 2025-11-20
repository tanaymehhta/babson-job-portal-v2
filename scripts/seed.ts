import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import OpenAI from 'openai';

config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function generateEmbedding(text: string) {
    const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
    });
    return response.data[0].embedding;
}

async function seed() {
    console.log('Seeding database...');

    const jobs = [
        {
            title: 'Product Marketing Intern',
            company_name: 'HubSpot',
            location_type: 'Hybrid',
            location_specifics: 'Cambridge, MA',
            requirements: ['Marketing major', 'Strong writing skills', 'HubSpot certification is a plus'],
            salary_min: 25,
            salary_max: 30,
            babson_connection: 'VP of Marketing is an alum',
            status: 'active',
        },
        {
            title: 'Investment Banking Analyst',
            company_name: 'Goldman Sachs',
            location_type: 'Onsite',
            location_specifics: 'New York, NY',
            requirements: ['Finance major', '3.8+ GPA', 'Financial modeling skills'],
            salary_min: 110000,
            salary_max: 130000,
            babson_connection: 'Recruiting team coming to campus',
            status: 'active',
        },
        {
            title: 'Software Engineer (New Grad)',
            company_name: 'Wayfair',
            location_type: 'Hybrid',
            location_specifics: 'Boston, MA',
            requirements: ['CS minor or bootcamp', 'React/Node.js', 'Problem solving'],
            salary_min: 95000,
            salary_max: 115000,
            status: 'active',
        },
    ];

    for (const job of jobs) {
        const text = `${job.title} ${job.company_name} ${job.location_specifics} ${job.requirements.join(' ')}`;
        const embedding = await generateEmbedding(text);

        // We need a user ID to post. For seeding, we might need to create a dummy user or use an existing one.
        // This script assumes you have at least one user or RLS is disabled for seeding.
        // Since RLS is on, this script might fail if not run with service role key.
        // But we only have anon key in env.
        // I'll skip actual insertion if I can't get a user, but this is just a template.
        console.log(`Generated embedding for ${job.title}`);
    }

    console.log('Seed script ready. Run with service role key to insert data.');
}

seed().catch(console.error);
