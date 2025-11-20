import { openai } from '@/lib/openai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { text } = await request.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const embeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: text,
        });

        const embedding = embeddingResponse.data[0].embedding;

        return NextResponse.json({ embedding });
    } catch (error: any) {
        console.error('Embedding error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
