'use client';

import { Bot } from 'lucide-react';

interface QuestionBubbleProps {
  text: string;
}

export function QuestionBubble({ text }: QuestionBubbleProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <Bot className="h-4 w-4 text-primary" />
      </div>
      <div className="bg-card border rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  );
}
