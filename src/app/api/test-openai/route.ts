import { openai } from '@/lib/openai';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        console.log('Testing OpenAI API key...');
        console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
        console.log('OPENAI_API_KEY length:', process.env.OPENAI_API_KEY?.length);
        console.log('OPENAI_API_KEY starts with sk-:', process.env.OPENAI_API_KEY?.startsWith('sk-'));

        const response = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: 'test',
        });

        console.log('OpenAI API call successful!');

        return NextResponse.json({
            success: true,
            message: 'OpenAI API key is working!',
            embeddingLength: response.data[0].embedding.length,
        });
    } catch (error: any) {
        console.error('OpenAI API test error:', error);

        return NextResponse.json({
            success: false,
            error: error.message,
            errorType: error.constructor.name,
            status: error.status,
            fullError: JSON.stringify(error, null, 2),
        }, { status: 500 });
    }
}
