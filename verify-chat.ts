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

async function verifyChat() {
    console.log('💬 Verifying Chat Retrieval for On-Campus Jobs...\n');

    const query = "What on campus jobs are available?";
    console.log(`❓ Query: "${query}"`);

    // 1. Generate embedding for the query
    const embeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: query,
    });
    const embedding = embeddingResponse.data[0].embedding;

    // 2. Call match_jobs RPC
    const { data: jobs, error } = await supabase.rpc('match_jobs', {
        query_embedding: JSON.stringify(embedding),
        match_threshold: 0.3, // Same threshold as API
        match_count: 5,
    });

    if (error) {
        console.error('❌ Error calling match_jobs:', error);
        return;
    }

    console.log(`\n✅ Found ${jobs.length} jobs matching the query.`);

    if (jobs.length > 0) {
        console.log('\n📝 Top Results:');
        jobs.forEach((job: any, index: number) => {
            console.log(`\n${index + 1}. ${job.title}`);
            console.log(`   Company: ${job.company_name}`);
            console.log(`   Similarity: ${job.similarity.toFixed(4)}`);
        });

        // Check if any of the seeded jobs are present
        const expectedTitles = [
            'Writing Center Tutor',
            'Research Assistant - Entrepreneurship',
            'Student Admissions Representative',
            'Library Student Assistant'
        ];

        const foundSeeded = jobs.some((j: any) => expectedTitles.includes(j.title));

        if (foundSeeded) {
            console.log('\n✅ SUCCESS: Retrieved seeded on-campus jobs!');
        } else {
            console.log('\n⚠️ WARNING: Did not find the expected seeded jobs in top 5.');
        }
    } else {
        console.log('\n❌ No jobs found. Check embedding generation or threshold.');
    }
}

verifyChat().catch(console.error);
