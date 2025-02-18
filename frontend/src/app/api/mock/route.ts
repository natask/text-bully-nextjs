import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createFileInfo, writeOutputFile } from '@/lib/utils/files';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    const { text, timestamp } = await req.json();
    const prompt = `Given this message, respond with a single sarcastic and mocking tone: ${text}\n\nProvide only ONE witty response that makes fun of the message. Keep it concise and sharp. Use Slang and be nonchalant.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{
        role: 'user',
        content: prompt
      }],
      temperature: 0.8,
      max_tokens: 60,
      top_p: 0.95
    });

    const mockResponse = response.choices?.[0]?.message?.content?.trim() || 'No response generated';
    
    const fileInfo = createFileInfo(text, timestamp);
    const filepath = writeOutputFile(fileInfo.getPath('mock'),mockResponse);

    return NextResponse.json({ response: mockResponse });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
