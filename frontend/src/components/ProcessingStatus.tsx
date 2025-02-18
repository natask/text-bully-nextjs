import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProcessingStatusProps {
  status: 'idle' | 'processing message' | 'processing voice' | 'processing video' | 'complete' | 'error';
  progress: number;
  className?: string;
}

const ProcessingStatus = ({ status, progress, className }: ProcessingStatusProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'processing message':
        return 'bg-purple-500';
      case 'processing voice':
        return 'bg-purple-500';
      case 'processing video':
        return 'bg-purple-500';
      case 'complete':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'processing message':
        return 'Crafting your comeback...';
      case 'processing voice':
        return 'Beautifying voice...';
      case 'processing video':
        return 'Generating Killer video...';
      case 'complete':
        return 'Roast ready!';
      case 'error':
        return 'Failed to bully';
      default:
        return 'Ready to bully';
    }
  };

  return (
    <div className={cn("w-full space-y-4 animate-fade-up", className)}>
      <div className="flex items-center justify-between">
        <Badge variant="secondary" className={`${getStatusColor()} text-white flex items-center gap-2`}>
          {status.includes('processing') && <Loader2 className="w-3 h-3 animate-spin" />}
          {getStatusText()}
        </Badge>
        <span className="text-sm text-purple-600 font-medium">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2 bg-purple-100">
        <div className="h-full bg-purple-600 transition-all duration-500" style={{ width: `${progress}%` }} />
      </Progress>
    </div>
  );
};

export default ProcessingStatus;
