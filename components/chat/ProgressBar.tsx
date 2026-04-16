'use client';

import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = ((current + 1) / total) * 100;

  return (
    <div className="flex items-center gap-3">
      <Progress value={percentage} className="flex-1 h-2" />
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        {current + 1} / {total}
      </span>
    </div>
  );
}
