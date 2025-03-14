import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Download, MessageSquare, Loader2, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultDisplayProps {
  text: string;
  videoUrl?: string;
  audioUrl?: string;
  onPlay: () => void;
  onDownload: () => void;
  className?: string;
  isProcessing?: boolean;
  status?: 'idle' | 'processing message' | 'processing voice' | 'processing video' | 'complete' | 'error';
}

const ResultDisplay = ({ text, videoUrl, audioUrl, onPlay, onDownload, className, isProcessing, status }: ResultDisplayProps) => {
  if (!text) return null;

  return (
    <Card className={cn("w-full p-6 space-y-4 animate-fade-up bg-gradient-to-br from-white/80 to-purple-50/80 backdrop-blur-sm border-2 border-white/50 shadow-xl", className)}>
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-purple-600">
          <MessageSquare className="w-5 h-5" />
          <h3 className="text-sm font-medium">Your Savage Comeback</h3>
        </div>
        <p className="text-gray-800 font-medium leading-relaxed break-words whitespace-pre-wrap max-w-full overflow-visible">{text}</p>
      </div>
      {/* Audio Player Section */}
      {(audioUrl || isProcessing) && (
        <div className="mt-4 rounded-lg overflow-hidden border-2 border-white/50 shadow-lg bg-gradient-to-r from-purple-100/80 to-red-100/80 p-4">
          <div className="flex items-center gap-3 mb-2">
            <Volume2 className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm font-medium text-purple-600"></h3>
          </div>
          {audioUrl ? (
            <audio 
              className="w-full" 
              controls 
              src={audioUrl}
            />
          ) : isProcessing && status === 'processing voice' ? (
            <div className="h-12 bg-gray-800/20 rounded-md flex items-center justify-center">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                <p className="text-sm text-purple-600">cooking up the BURN featuring THEEE ONE AND ONLY ANNOYYYING ORANGE</p>
              </div>
            </div>
          ) : isProcessing ? (
            <div className="h-12 bg-gray-800/20 rounded-md flex items-center justify-center">
              <p className="text-sm text-purple-600/70">Audio will appear here</p>
            </div>
          ) : null}
        </div>
      )}
      {videoUrl && (
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center gap-2 bg-purple-500 text-white hover:bg-purple-600 transition-all duration-200"
            onClick={onPlay}
          >
            <Play size={16} />
            Play
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
            onClick={onDownload}
          >
            <Download size={16} />
            Download
          </Button>
        </div>
      )}
      


      {/* Video Player Section */}
      <div className="mt-4 rounded-lg overflow-hidden border-2 border-white/50 shadow-lg">
        {videoUrl ? (
          <video
            className="w-full aspect-video"
            controls
            src={videoUrl}
          />
        ) : (
          <div className="w-full aspect-video bg-gray-900 flex items-center justify-center">
            {isProcessing ? (
              <div className="flex flex-col items-center gap-3 text-white/70">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="text-sm">Weaponizing pixels just for you...</p>
              </div>
            ) : (
              <p className="text-white/50 text-sm">Video will appear here</p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ResultDisplay;
