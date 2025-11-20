import { createClient } from '@/lib/supabase/server';
import { openai } from '@/lib/openai';
import { NextResponse } from 'next/server';

const SAMPLE_JOBS = [
    {
        title: 'Product Manager Intern',
        company_name: 'TechCorp',
        location_type: 'Hybrid',
        salary_min: 30,
        salary_max: 45,
        description: 'We are looking for a Product Manager Intern to help us build the future of our platform. You will work closely with engineering and design teams.',
        requirements: ['Strong communication skills', 'Interest in product management', 'Currently enrolled in a degree program'],
    },
    {
        title: 'Software Engineer',
        company_name: 'StartUp Inc',
        location_type: 'Remote',
        salary_min: 100000,
        salary_max: 130000,
        description: 'Join our fast-paced team as a Software Engineer. You will be working on our core product using React and Node.js.',
        requirements: ['Experience with React', 'Knowledge of Node.js', 'Problem-solving skills'],
    },
    {
        title: 'Marketing Specialist',
        company_name: 'GrowthCo',
        location_type: 'Onsite',
        salary_min: 60000,
        salary_max: 80000,
        description: 'We need a Marketing Specialist to drive our growth campaigns. You will be responsible for social media and email marketing.',
        requirements: ['Marketing degree', 'Social media experience', 'Creative thinking'],
    }
];

export async function GET(request: Request) {
    try {
        // Use service role key if available to bypass RLS
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        let supabase;
        let userId: string | undefined;

        if (serviceRoleKey) {
            const { createClient } = await import('@supabase/supabase-js');
            supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                serviceRoleKey,
                {
                    auth: {
                        autoRefreshToken: false,
                        persistSession: false
                    }
                }
            );
            // When using service role, we might not have a user context, so we'll use a fallback ID
            userId = '00000000-0000-0000-0000-000000000000';
        } else {
            // Fallback to authenticated user
            const { createClient } = await import('@/lib/supabase/server');
            supabase = await createClient();

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                return NextResponse.json({ error: 'You must be logged in (or provide SUPABASE_SERVICE_ROLE_KEY) to seed data' }, { status: 401 });
            }
            userId = user.id;
        }

        const results = [];

        for (const job of SAMPLE_JOBS) {
            // Generate embedding
            const embeddingResponse = await openai.embeddings.create({
                model: 'text-embedding-3-small',
                input: `${job.title} ${job.company_name} ${job.description} ${job.requirements.join(' ')}`,
            });

            const embedding = embeddingResponse.data[0].embedding;

            // Need to cast to any because generated types might expect string but we want to be sure
            // The error specifically said number[] is not assignable to string, so we stringify.
            const { data, error } = await supabase.from('jobs').insert({
                title: job.title,
                company_name: job.company_name,
                location_type: job.location_type,
                salary_min: job.salary_min,
                salary_max: job.salary_max,
                requirements: job.requirements,
                embedding: JSON.stringify(embedding) as any,
                posted_by: userId,
                status: 'active',
                link: 'https://example.com',
                babson_connection: 'Alumni founded',
            }).select();

            if (error) {
                console.error('Error inserting job:', error);
                results.push({ job: job.title, status: 'failed', error: error.message });
            } else {
                results.push({ job: job.title, status: 'success' });
            }
        }

        return NextResponse.json({ results });
    } catch (error: any) {
        console.error('Seed error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
