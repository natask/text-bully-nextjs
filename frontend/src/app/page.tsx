'use client';

import { useState } from 'react';
import TextInput from '@/components/TextInput';
import ProcessingStatus from '@/components/ProcessingStatus';
import ResultDisplay from '@/components/ResultDisplay';
import { Button } from '@/components/ui/button';
import { Zap, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
//import { generateMockResponse } from '@/lib/api';
import { generateMockResponse, generateSpeech, generateVideo } from '@/lib/api';


export default function Home() {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing message' | 'processing voice' | 'processing video' | 'complete' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const { toast } = useToast();

  const simulateProgress = (start: number, end: number) => {
    return new Promise<void>(resolve => {
      let current = start;
      const interval = setInterval(() => {
        if (current >= end) {
          clearInterval(interval);
          resolve();
        } else {
          current += 2;
          setProgress(current);
        }
      }, 50);
    });
  };

  const handleProcess = async () => {
    console.log('handleProcess called with message:', message); // Debug log

    if (!message.trim()) {
      toast({
        title: "Achievement Unlocked: Empty Box Master",
        description: "Congratulations on submitting absolutely nothing. That takes special talent!",
        variant: "destructive"
      });
      return;
    }
    
    setStatus('processing message');
    setProgress(0);

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      console.log('Starting processing with timestamp:', timestamp);

      //Step 1: Get Mock Response
      await simulateProgress(0, 30);
      const mockText = await generateMockResponse(message, timestamp);
      setResult(mockText);  // Show text immediately
      
      setStatus('processing voice');
      await simulateProgress(30, 60);

      // Step 2: Generate Speech
      const audioPath = await generateSpeech(mockText, timestamp, message);
      
      // Set the audio URL for playback
      const audioFileName = audioPath.split('/').pop();

      setAudioUrl(`/api/assets/${audioFileName}`);
      
      await simulateProgress(60, 90);
      setStatus('processing video');

      // Step 3: Generate Video
      const videoUrl = await generateVideo(audioPath, timestamp, message);
      setVideoUrl(videoUrl);
      
      await simulateProgress(90, 100);
      setStatus('complete');
      toast({
        title: "Success",
        description: "Time for your emotional dagger to see some action!"
      });
    } catch (error) {
      console.error('Processing error:', error);
      setStatus('error');
      toast({
        title: "Incorrect",
        description: "Aren't you the one that needs some bullying?",
        variant: "destructive"
      });
    }
  };

  const handlePlay = () => {
    toast({
      title: "Button Rebellion",
      description: "This button has joined the resistance. Check back after peace negotiations.",
      variant: "destructive"
    });
  };

  const handleDownload = () => {
    toast({
      title: "Sexy Button",
      description: "Don't touch me! pervert!",
      variant: "destructive"
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-50 via-red-50 to-orange-50">
      {/* Bouncing background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[40rem] h-[40rem] bg-purple-200/20 rounded-full -top-48 -left-48 animate-[bounce_8s_ease-in-out_infinite]" />
        <div className="absolute w-[35rem] h-[35rem] bg-red-200/30 rounded-full top-1/2 -translate-y-1/2 -right-64 animate-[bounce_7s_ease-in-out_infinite_0.5s]" />
        <div className="absolute w-[30rem] h-[30rem] bg-orange-200/20 rounded-full -bottom-48 -left-48 animate-[bounce_6s_ease-in-out_infinite_1s]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/50 to-white/0 backdrop-blur-[1px]" />
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="container max-w-2xl space-y-8">
          <div className="text-center animate-fade-up">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <MessageSquare className="w-12 h-12 text-red-500" />
              <h1 className="font-extrabold tracking-normal bg-gradient-to-r from-red-600 via-purple-600 to-orange-500 bg-clip-text text-transparent text-6xl leading-snug [font-feature-settings:'kern' 1]">
                Text Bully
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Transform their text into a savage comeback</p>
          </div>

          <div className="space-y-6 backdrop-blur-sm bg-white/30 p-8 rounded-2xl border border-white/50 shadow-lg">
            <TextInput value={message} onChange={setMessage} />
            
            <div className="flex justify-center">
              <Button 
                onClick={handleProcess} 
                disabled={status.includes('processing')} 
                className="min-w-[200px] bg-gradient-to-r from-red-500 via-purple-500 to-orange-500 hover:from-red-600 hover:via-purple-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-200 shadow-lg group"
              >
                <Zap className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                Bully This Text
              </Button>
            </div>

            {status !== 'idle' && <ProcessingStatus status={status} progress={progress} />}

            {result && (
              <ResultDisplay 
                text={result} 
                onPlay={handlePlay} 
                onDownload={handleDownload} 
                audioUrl={audioUrl}
                videoUrl={videoUrl}
                isProcessing={status === 'processing voice' || status === 'processing video'}
                status={status}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
