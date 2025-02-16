'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Step 1: Get LLM Response
      const llmResponse = await fetch('/api/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });
      
      if (!llmResponse.ok) throw new Error('LLM request failed');
      const llmData = await llmResponse.json();

      // Step 2: Generate Speech
      const speechResponse = await fetch('/api/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: llmData.response }),
      });
      
      if (!speechResponse.ok) throw new Error('Speech generation failed');
      const speechData = await speechResponse.json();

      // Step 3: Generate Video
      const videoResponse = await fetch('/api/deepfake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioUrl: speechData.output,
        }),
      });
      
      if (!videoResponse.ok) throw new Error('Video generation failed');
      const videoData = await videoResponse.json();

      setVideoUrl(videoData.output);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">AI Video Generator</h1>
          <p className="text-gray-500">Enter your text to generate an AI video response.</p>
        </div>

        <div className="space-y-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your text here..."
            className="min-h-[100px]"
          />

          <Button
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            className="w-full"
          >
            {loading ? 'Generating...' : 'Generate Video'}
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}

        {videoUrl && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Generated Video</h2>
            <video controls className="w-full rounded-lg shadow-lg">
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    </main>
  );
}
