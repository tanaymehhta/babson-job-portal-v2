import { createClient } from '@supabase/supabase-js';
import { openai } from '@/lib/openai';
import { NextResponse } from 'next/server';

export const maxDuration = 300; // 5 minutes timeout for long running seeding

const JOB_TITLES = [
    'Product Manager', 'Senior Product Manager', 'Group Product Manager', 'Director of Product',
    'Associate Product Manager', 'Product Marketing Manager', 'Senior PMM', 'Head of Product Marketing',
    'Technical Product Manager', 'Growth Product Manager', 'Product Operations Manager', 'VP of Product'
];

const COMPANIES = [
    'TechCorp', 'InnovateInc', 'FutureSystems', 'DataFlow', 'CloudScale', 'AI Dynamics',
    'GreenEnergy', 'HealthPlus', 'FinTech Solutions', 'EduTech Global', 'MediaStream', 'LogiChain'
];

const LOCATIONS = ['San Francisco, CA', 'New York, NY', 'Boston, MA', 'Austin, TX', 'Seattle, WA', 'Remote', 'Chicago, IL', 'Los Angeles, CA'];
const LOCATION_TYPES = ['Onsite', 'Hybrid', 'Virtual'];

const EVENT_TITLES = [
    'Product Management Summit', 'Tech Leaders Networking', 'Women in Product Mixer',
    'AI in Product Management', 'Product Marketing Workshop', 'Career Fair 2025',
    'Startup Pitch Night', 'Agile Product Development Seminar', 'Data-Driven Product Decisions',
    'Executive Leadership Forum'
];

const EVENT_TYPES = ['Networking Event', 'Employer-Sponsored', 'Workshop'];

function getRandomElement(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateJob(postedBy: string) {
    const title = getRandomElement(JOB_TITLES);
    const company = getRandomElement(COMPANIES);
    const locationType = getRandomElement(LOCATION_TYPES);

    return {
        title,
        company_name: company,
        location_type: locationType,
        location_specifics: `We are looking for a talented ${title} to join our team at ${company}. You will be responsible for driving product strategy and execution.`, // Using this as description based on frontend usage
        is_paid: Math.random() > 0.1,
        // description field removed as it doesn't exist in schema
        requirements: ['3+ years experience', 'Strong communication skills', 'Data analysis proficiency', 'Agile methodology'],
        salary_min: 80000 + Math.floor(Math.random() * 50000),
        salary_max: 130000 + Math.floor(Math.random() * 100000),
        posted_by: postedBy,
        status: 'active',
        date_posted: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    };
}

function generateEvent() {
    const title = getRandomElement(EVENT_TITLES);
    const type = getRandomElement(EVENT_TYPES);
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 60)); // Random date in next 60 days

    return {
        title,
        event_type: type,
        date: date.toISOString(),
        description: `Join us for the ${title}. This is a great opportunity to learn and network with industry professionals.`,
        location_type: getRandomElement(['Onsite', 'Virtual', 'Both']),
        location_specifics: getRandomElement(LOCATIONS),
        industry: 'Product Management', // Focusing on PM as requested
    };
}

async function generateEmbeddings(texts: string[]) {
    const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: texts,
    });
    return response.data.map(item => item.embedding);
}

export async function POST(request: Request) {
    try {
        // Use Service Role Key to bypass RLS
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Get or Create a Dummy Alumni User
        // Since we are admin, we can just pick an alumni.
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id')
            .eq('role', 'alumni')
            .limit(1);

        let posterId = profiles?.[0]?.id;

        if (!posterId) {
            // If no alumni exists, try to find ANY user to attribute to, or create one?
            // For now, let's just fail if no alumni.
            // Actually, let's check if we can find any user.
            const { data: users } = await supabase.auth.admin.listUsers({ perPage: 1 });
            if (users.users.length > 0) {
                posterId = users.users[0].id;
                console.log('No alumni found, using first available user as poster:', posterId);
            } else {
                return NextResponse.json({ error: 'No users found to attribute jobs to.' }, { status: 400 });
            }
        }

        // 2. Generate Jobs
        const jobs = [];
        const jobTexts = [];
        const extraRequirements = ['User Research', 'SQL', 'Python', 'Go-to-Market Strategy', 'Roadmapping', 'Stakeholder Management'];

        for (let i = 0; i < 100; i++) {
            const job = generateJob(posterId);

            // Randomly add some extra requirements
            const randomReqs = [...job.requirements];
            if (Math.random() > 0.5) randomReqs.push(getRandomElement(extraRequirements));
            if (Math.random() > 0.5) randomReqs.push(getRandomElement(extraRequirements));
            job.requirements = randomReqs;

            jobs.push(job);
            // Use location_specifics as description for embedding
            // ADDED: location_type to embedding text
            jobTexts.push(`${job.title} ${job.company_name} ${job.location_type} ${job.location_specifics} ${job.requirements.join(' ')}`);
        }

        console.log('Generating job embeddings...');
        // Batch embedding generation (OpenAI allows up to 2048 inputs, but let's do batches of 50 to be safe)
        const jobEmbeddings: number[][] = [];
        for (let i = 0; i < jobTexts.length; i += 50) {
            const batch = jobTexts.slice(i, i + 50);
            const embeddings = await generateEmbeddings(batch);
            jobEmbeddings.push(...embeddings);
        }

        const jobsWithEmbeddings = jobs.map((job, index) => ({
            ...job,
            embedding: JSON.stringify(jobEmbeddings[index]) // Stringify for pgvector if needed, or cast to any
        }));

        console.log('Inserting jobs...');
        const { error: jobsInsertError } = await supabase.from('jobs').insert(jobsWithEmbeddings as any); // Cast to any to avoid type strictness on vector
        if (jobsInsertError) throw jobsInsertError;


        // 3. Generate Events
        const events = [];
        const eventTexts = [];
        for (let i = 0; i < 100; i++) {
            const event = generateEvent();
            events.push(event);
            eventTexts.push(`${event.title} ${event.description} ${event.industry} ${event.event_type}`);
        }

        console.log('Generating event embeddings...');
        const eventEmbeddings: number[][] = [];
        for (let i = 0; i < eventTexts.length; i += 50) {
            const batch = eventTexts.slice(i, i + 50);
            const embeddings = await generateEmbeddings(batch);
            eventEmbeddings.push(...embeddings);
        }

        const eventsWithEmbeddings = events.map((event, index) => ({
            ...event,
            embedding: JSON.stringify(eventEmbeddings[index])
        }));

        console.log('Inserting events...');
        const { error: eventsInsertError } = await supabase.from('events').insert(eventsWithEmbeddings as any);
        if (eventsInsertError) throw eventsInsertError;

        return NextResponse.json({ message: 'Successfully seeded 100 jobs and 100 events.' });

    } catch (error: any) {
        console.error('Seeding error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
