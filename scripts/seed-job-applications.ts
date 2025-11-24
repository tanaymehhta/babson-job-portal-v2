import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ROLES = [
    'Software Engineer Intern',
    'Product Manager',
    'Marketing Specialist',
    'Data Analyst',
    'Business Development Associate',
    'UX Designer',
    'Consultant',
    'Investment Banking Analyst'
];

const COMPANIES = [
    'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta',
    'Goldman Sachs', 'McKinsey', 'Boston Consulting Group',
    'HubSpot', 'Wayfair', 'Salesforce', 'Adobe',
    'Spotify', 'Netflix', 'Airbnb', 'Uber'
];

const LOCATIONS = [
    'New York, NY', 'San Francisco, CA', 'Boston, MA', 'Seattle, WA',
    'Austin, TX', 'Chicago, IL', 'Remote', 'London, UK'
];

const STATUSES = [
    'saved', 'preparing', 'applied',
    'interview_round_1', 'interview_round_2', 'interview_round_3', 'interview_final',
    'offer_received', 'accepted', 'rejected', 'withdrawn'
];

function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDate(start: Date, end: Date): string {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
}

async function seedJobApplications() {
    console.log('Starting seed process...');

    // 1. Fetch all users
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
        console.error('Error fetching users:', usersError);
        return;
    }

    if (!users || users.length === 0) {
        console.log('No users found to seed.');
        return;
    }

    console.log(`Found ${users.length} users. Seeding data...`);

    const applications = [];

    for (const user of users) {
        // Generate 5-10 applications per user
        const numApps = Math.floor(Math.random() * 6) + 5;

        for (let i = 0; i < numApps; i++) {
            const status = getRandomElement(STATUSES);
            const dateApplied = getRandomDate(new Date('2024-01-01'), new Date());
            const deadline = getRandomDate(new Date(), new Date('2024-12-31'));

            applications.push({
                user_id: user.id,
                role: getRandomElement(ROLES),
                company: getRandomElement(COMPANIES),
                location: getRandomElement(LOCATIONS),
                pay: Math.random() > 0.5 ? `$${Math.floor(Math.random() * 50 + 20)}/hr` : `$${Math.floor(Math.random() * 60 + 60)}k/yr`,
                status: status,
                date_applied: ['saved', 'preparing'].includes(status) ? null : dateApplied,
                application_deadline: deadline,
                link: 'https://example.com/job',
                resume_version: 'v1.pdf',
                contact_person: Math.random() > 0.7 ? 'Recruiter Name (recruiter@example.com)' : null,
                comments: Math.random() > 0.8 ? 'Looks like a great opportunity!' : null,
                interview_stage: status.includes('interview') ? 'Technical Round' : null
            });
        }
    }

    // Insert in batches
    const batchSize = 100;
    for (let i = 0; i < applications.length; i += batchSize) {
        const batch = applications.slice(i, i + batchSize);
        const { error } = await supabase.from('job_applications').insert(batch);

        if (error) {
            console.error('Error inserting batch:', error);
        } else {
            console.log(`Inserted batch ${i / batchSize + 1}`);
        }
    }

    console.log('Seeding completed successfully!');
}

seedJobApplications().catch(console.error);
