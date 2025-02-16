import React from 'react';
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProcessingStatusProps {
  status: 'idle' | 'processing' | 'complete' | 'error';
  progress: number;
  className?: string;
}

const ProcessingStatus = ({ status, progress, className }: ProcessingStatusProps) => {
  const getStatusText = () => {
    switch (status) {
      case 'processing':
        return 'Processing...';
      case 'complete':
        return 'Complete!';
      case 'error':
        return 'Error occurred';
      default:
        return 'Ready';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'text-purple-600';
      case 'complete':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-sm">
        <span className={getStatusColor()}>{getStatusText()}</span>
        <span className="text-gray-500">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default ProcessingStatus;
