import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultDisplayProps {
  text: string;
  videoUrl?: string;
  onPlay?: () => void;
  onDownload?: () => void;
  className?: string;
}

const ResultDisplay = ({ text, videoUrl, onPlay, onDownload, className }: ResultDisplayProps) => {
  if (!text) return null;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-purple-800">Generated Response</h3>
          <p className="text-gray-700">{text}</p>
        </div>

        {videoUrl && (
          <div className="flex gap-2">
            <Button
              onClick={onPlay}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:from-purple-700 hover:to-purple-900"
            >
              <Play className="w-4 h-4 mr-2" />
              Play Video
            </Button>
            <Button
              onClick={onDownload}
              variant="outline"
              className="flex-1 border-purple-200 hover:bg-purple-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultDisplay;
