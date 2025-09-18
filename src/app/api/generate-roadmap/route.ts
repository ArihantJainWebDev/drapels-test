import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

export async function POST(request: Request) {
  try {
    const { prompt, params } = await request.json();
    
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'Missing GROQ_API_KEY environment variable' },
        { status: 500 }
      );
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    const response = await groq.chat.completions.create({
      messages: [{
        role: 'user',
        content: prompt
      }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 8000
    });

    const content = response.choices?.[0]?.message?.content ?? '';
    
    return NextResponse.json({
      content
    });
  } catch (error: any) {
    console.error('Error generating roadmap:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
