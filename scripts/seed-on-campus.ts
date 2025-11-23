import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import OpenAI from 'openai';

config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
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

const onCampusJobs = [
    {
        title: 'Writing Center Tutor',
        company_name: 'Babson Writing Center',
        location_type: 'On Campus',
        location_specifics: 'Horn Library',
        requirements: ['Strong writing skills', 'A- in FME or Rhetoric', 'Patience and communication skills'],
        salary_min: 16,
        salary_max: 18,
        babson_connection: 'Work with peer students',
        description: 'Assist students with writing assignments across all disciplines. Help with brainstorming, drafting, and revising.',
    },
    {
        title: 'Research Assistant - Entrepreneurship',
        company_name: 'Arthur M. Blank Center',
        location_type: 'On Campus',
        location_specifics: 'Blank Center',
        requirements: ['Data analysis skills', 'Interest in entrepreneurship', 'Excel proficiency'],
        salary_min: 17,
        salary_max: 19,
        babson_connection: 'Work directly with faculty',
        description: 'Support faculty research on family business dynamics. Conduct literature reviews and data entry.',
    },
    {
        title: 'Student Admissions Representative',
        company_name: 'Undergraduate Admissions',
        location_type: 'On Campus',
        location_specifics: 'Lunder Admission Center',
        requirements: ['Public speaking', 'Enthusiasm for Babson', 'Availability for campus tours'],
        salary_min: 15,
        salary_max: 16,
        babson_connection: 'Represent Babson to prospective students',
        description: 'Lead campus tours for prospective students and families. Assist with front desk duties and phone calls.',
    },
    {
        title: 'Library Student Assistant',
        company_name: 'Horn Library',
        location_type: 'On Campus',
        location_specifics: 'Horn Library',
        requirements: ['Detail oriented', 'Customer service skills', 'Reliability'],
        salary_min: 15,
        salary_max: 15,
        babson_connection: 'Central campus hub',
        description: 'Assist with circulation desk, shelving books, and helping patrons find resources.',
    },
    {
        title: 'Marketing Intern - Athletics',
        company_name: 'Babson Athletics',
        location_type: 'On Campus',
        location_specifics: 'Webster Center',
        requirements: ['Social media experience', 'Graphic design basics', 'Sports interest'],
        salary_min: 16,
        salary_max: 18,
        babson_connection: 'Support student athletes',
        description: 'Create content for Babson Athletics social media. Assist with game day operations and promotions.',
    },
    {
        title: 'IT Help Desk Consultant',
        company_name: 'ITSD',
        location_type: 'On Campus',
        location_specifics: 'Horn Library Basement',
        requirements: ['Technical troubleshooting', 'Customer service', 'Knowledge of Mac/PC'],
        salary_min: 17,
        salary_max: 19,
        babson_connection: 'Tech support for campus',
        description: 'Provide first-level technical support to students, faculty, and staff. Troubleshoot wifi, printing, and software issues.',
    },
    {
        title: 'Sustainability Office Intern',
        company_name: 'Sustainability Office',
        location_type: 'On Campus',
        location_specifics: 'Reynolds Campus Center',
        requirements: ['Passion for sustainability', 'Event planning', 'Communication'],
        salary_min: 16,
        salary_max: 17,
        babson_connection: 'Green campus initiatives',
        description: 'Help organize campus sustainability events. Manage social media and create awareness campaigns.',
    },
    {
        title: 'Peer Career Ambassador',
        company_name: 'Hoffman Family Undergraduate Center for Career Development',
        location_type: 'On Campus',
        location_specifics: 'Hollister Hall',
        requirements: ['Resume writing knowledge', 'LinkedIn proficiency', 'Presentation skills'],
        salary_min: 16,
        salary_max: 18,
        babson_connection: 'Career development',
        description: 'Review student resumes and cover letters. Conduct mock interviews and facilitate career workshops.',
    },
    {
        title: 'FME Mentor',
        company_name: 'FME Department',
        location_type: 'On Campus',
        location_specifics: 'Tomasso Hall',
        requirements: ['Previous FME success', 'Leadership skills', 'Mentorship experience'],
        salary_min: 18,
        salary_max: 20,
        babson_connection: 'Mentor first-year students',
        description: 'Mentor first-year student venture teams. Provide guidance on operations, marketing, and finance.',
    },
    {
        title: 'Reynolds Global Lounge Assistant',
        company_name: 'Glavin Office',
        location_type: 'On Campus',
        location_specifics: 'Reynolds Global Lounge',
        requirements: ['Intercultural communication', 'Event support', 'Administrative skills'],
        salary_min: 15,
        salary_max: 16,
        babson_connection: 'Global community',
        description: 'Staff the Global Lounge welcome desk. Assist with international student events and programming.',
    }
];

async function seedOnCampus() {
    console.log('🌱 Seeding 10 On-Campus Jobs...');

    // 1. Get a valid user ID to post as
    const { data: profiles } = await supabase.from('profiles').select('id').limit(1);

    if (!profiles || profiles.length === 0) {
        console.error('❌ No profiles found. Please create a user first.');
        return;
    }

    const posterId = profiles[0].id;
    console.log(`📝 Posting as user ID: ${posterId}`);

    let successCount = 0;

    for (const job of onCampusJobs) {
        try {
            // Generate embedding
            const textToEmbed = `${job.title} ${job.company_name} ${job.location_type} ${job.location_specifics} ${job.description} ${job.requirements.join(' ')}`;
            const embedding = await generateEmbedding(textToEmbed);

            const { error } = await supabase.from('jobs').insert({
                title: job.title,
                company_name: job.company_name,
                location_type: job.location_type,
                location_specifics: job.location_specifics,
                requirements: job.requirements,
                salary_min: job.salary_min,
                salary_max: job.salary_max,
                babson_connection: job.babson_connection,
                posted_by: posterId,
                embedding: embedding,
                status: 'active',
                link: 'https://studentemployment.babson.edu' // Dummy link
            });

            if (error) {
                console.error(`❌ Failed to insert ${job.title}:`, error.message);
            } else {
                console.log(`✅ Posted: ${job.title}`);
                successCount++;
            }
        } catch (e) {
            console.error(`❌ Error processing ${job.title}:`, e);
        }
    }

    console.log(`\n✨ Finished! Successfully posted ${successCount} out of ${onCampusJobs.length} jobs.`);
}

seedOnCampus().catch(console.error);
