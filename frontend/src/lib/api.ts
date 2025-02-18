export async function generateMockResponse(text: string, timestamp: string): Promise<string> {
  const response = await fetch('/api/mock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      text,
      timestamp 
    }),
  });
  
  if (!response.ok) throw new Error('Mock generation failed');
  const data = await response.json();
  console.log(data);
  return data.response;
}

export async function generateSpeech(text: string, timestamp: string, prompt: string): Promise<string> {
  const response = await fetch('/api/audio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      text,
      timestamp,
      prompt // Pass original prompt for consistent file naming
    }),
  });
  
  if (!response.ok) throw new Error('Speech generation failed');
  const data = await response.json();
  console.log(data);
  return data.response;
}

export async function generateVideo(audioPath: string, timestamp: string, prompt: string): Promise<string> {
  const response = await fetch('/api/video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      audioPath,
      timestamp,
      prompt // Pass original prompt for consistent file naming
    }),
  });
  
  if (!response.ok) throw new Error('Video generation failed');
  const data = await response.json();
  console.log(data);
  return data.response;
}
