import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { audioUrl } = await req.json();
    
    // Verify the video file exists
    // Removed this block as it's not needed with the public path reference

    // Upload the video file to Replicate
    // Removed this block as it's not needed with the public path reference

    // Create prediction with the uploaded video
    const predictionResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "3aa3dac9353cc4d6bd62a8f95957bd844003b401ca4f4c9839c9b9b3cf5fe08c",
        input: {
          face: "/resources/final.mp4",
          audio: audioUrl,
          pad_top: 0,
          pad_bottom: 0,
          pad_left: 0,
          pad_right: 0,
          resize_factor: 1,
        },
      }),
    });

    if (!predictionResponse.ok) {
      const errorData = await predictionResponse.json().catch(() => null);
      throw new Error(
        `Replicate API error: ${predictionResponse.statusText}${
          errorData ? ` - ${JSON.stringify(errorData)}` : ''
        }`
      );
    }

    const prediction = await predictionResponse.json();
    const result = await pollReplicateEndpoint(prediction.urls.get);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Deepfake API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate video' },
      { status: 500 }
    );
  }
}

async function pollReplicateEndpoint(url: string) {
  const maxAttempts = 60;
  const delayMs = 2000;
  
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to poll prediction: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.status === 'succeeded') {
      return data;
    } else if (data.status === 'failed') {
      throw new Error(`Video generation failed: ${data.error || 'Unknown error'}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }
  
  throw new Error('Timeout waiting for video generation');
}
