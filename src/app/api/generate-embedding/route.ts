import { openai } from '@/lib/openai';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
    try {
        const { text, jobId } = await request.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const embeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: text,
        });

        const embedding = embeddingResponse.data[0].embedding;

        // If jobId is provided, update the job with the embedding
        if (jobId) {
            const supabase = await createClient();
            const { error: updateError } = await supabase
                .from('jobs')
                .update({ embedding })
                .eq('id', jobId);

            if (updateError) {
                console.error('Failed to update job with embedding:', updateError);
                // Don't throw - still return the embedding
            }
        }

        return NextResponse.json({ embedding });
    } catch (error: any) {
        console.error('Embedding error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
