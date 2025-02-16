'use client';

import { useState } from 'react';
import TextInput from '@/components/TextInput';
import ProcessingStatus from '@/components/ProcessingStatus';
import ResultDisplay from '@/components/ResultDisplay';
import { Button } from '@/components/ui/button';
import { Zap, MessageSquare } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Home() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [responseText, setResponseText] = useState('');

  const handleSubmit = async () => {
    if (!input.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message first",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setProgress(0);
      
      // Step 1: Get LLM Response
      setProgress(20);
      const llmResponse = await fetch('/api/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });
      
      if (!llmResponse.ok) throw new Error('LLM request failed');
      const llmData = await llmResponse.json();
      setResponseText(llmData.response);
      setProgress(40);

      // Step 2: Generate Speech
      setProgress(60);
      const speechResponse = await fetch('/api/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: llmData.response }),
      });
      
      if (!speechResponse.ok) throw new Error('Speech generation failed');
      const speechData = await speechResponse.json();
      setProgress(80);

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
      setProgress(100);
      toast({
        title: "Success",
        description: "Your roast has been generated!"
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = () => {
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    }
  };

  const handleDownload = () => {
    if (videoUrl) {
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = 'roast.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const getStatus = () => {
    if (error) return 'error';
    if (loading) return 'processing';
    if (videoUrl) return 'complete';
    return 'idle';
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              AI Roast Generator
            </h1>
          </div>
          <p className="text-purple-600/80">Enter your text and let AI create a savage comeback.</p>
        </div>

        <div className="space-y-6">
          <TextInput 
            value={input}
            onChange={setInput}
            placeholder="Enter text to roast..."
          />

          <Button
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:from-purple-700 hover:to-purple-900 transition-all duration-200"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {loading ? 'Generating...' : 'Generate Roast'}
          </Button>

          {(loading || error || videoUrl) && (
            <ProcessingStatus 
              status={getStatus()}
              progress={progress}
              className="animate-fade-up"
            />
          )}

          {responseText && (
            <ResultDisplay
              text={responseText}
              videoUrl={videoUrl || undefined}
              onPlay={handlePlay}
              onDownload={handleDownload}
              className="animate-fade-up"
            />
          )}
        </div>
      </div>
    </main>
  );
}
