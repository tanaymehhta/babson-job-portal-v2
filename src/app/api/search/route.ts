import { createClient } from '@/lib/supabase/server';
import { openai } from '@/lib/openai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { query } = await request.json();

        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        console.log('Search query received:', query);

        // Generate embedding for the search query
        console.log('Generating embedding...');
        const embeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: query,
        });
        console.log('Embedding generated successfully');

        const embedding = embeddingResponse.data[0].embedding;

        // Search for jobs
        const supabase = await createClient();
        console.log('Supabase client created, calling match_jobs...');

        const { data: jobs, error: jobsError } = await supabase.rpc('match_jobs', {
            query_embedding: JSON.stringify(embedding),
            match_threshold: 0.5,
            match_count: 10,
        } as any);

        if (jobsError) {
            console.error('Error matching jobs:', jobsError);
            throw jobsError;
        }
        console.log('Jobs found:', jobs?.length);

        // Search for events
        console.log('Calling match_events...');
        const { data: events, error: eventsError } = await supabase.rpc('match_events', {
            query_embedding: JSON.stringify(embedding),
            match_threshold: 0.5,
            match_count: 5,
        } as any);

        if (eventsError) {
            console.error('Error matching events:', eventsError);
            throw eventsError;
        }
        console.log('Events found:', events?.length);

        return NextResponse.json({ jobs, events });
    } catch (error: any) {
        console.error('Search error details:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
