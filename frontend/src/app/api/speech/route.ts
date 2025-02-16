import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "1e959992f0d7b3786e9902e8ba6e72a90b8c5163e3089d10cf85a0dc3c55f13e", // coqui/XTTS-v2
        input: {
          text: text,
          speaker_wav: "https://replicate.delivery/pbxt/QbP9KIjuRL7VZWcq4XpBGhHUFGN8DWnAGH2JPXQDxPQ9J8IN/speaker.mp3",
          language: "en"
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Replicate API error: ${response.statusText}`);
    }

    const prediction = await response.json();
    
    // Poll for completion
    const result = await pollReplicateEndpoint(prediction.urls.get);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Speech API error:', error);
    return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 });
  }
}

async function pollReplicateEndpoint(url: string) {
  const maxAttempts = 20;
  const delayMs = 1000;
  
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
      },
    });
    
    const data = await response.json();
    
    if (data.status === 'succeeded') {
      return data;
    } else if (data.status === 'failed') {
      throw new Error('Speech generation failed');
    }
    
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }
  
  throw new Error('Timeout waiting for speech generation');
}
