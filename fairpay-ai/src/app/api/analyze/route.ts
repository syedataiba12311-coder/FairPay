import { NextResponse } from 'next/server';
import { analyzeScopeWithGemini } from '@/lib/gemini';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { scope } = body;

        if (!scope || typeof scope !== 'string' || scope.trim().length === 0) {
            return NextResponse.json(
                { error: 'Please provide a valid project scope description.' },
                { status: 400 }
            );
        }

        const analysis = await analyzeScopeWithGemini(scope);
        return NextResponse.json({ success: true, data: analysis });
    } catch (error) {
        console.error('Error in /api/analyze:', error);
        return NextResponse.json(
            { error: 'Failed to analyze project scope with Gemini AI.' },
            { status: 500 }
        );
    }
}
