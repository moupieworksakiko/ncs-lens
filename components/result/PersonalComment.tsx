'use client';

import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Lightbulb } from 'lucide-react';

interface PersonalCommentProps {
  comment: string;
  hints: string[];
}

export function PersonalComment({ comment, hints }: PersonalCommentProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-5 space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <MessageCircle className="h-4 w-4" />
            <h3 className="font-medium text-sm">パーソナルコメント</h3>
          </div>
          <p className="text-sm leading-relaxed text-foreground">{comment}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-5 space-y-2">
          <div className="flex items-center gap-2 text-accent-foreground">
            <Lightbulb className="h-4 w-4" />
            <h3 className="font-medium text-sm">伸びしろヒント</h3>
          </div>
          <ul className="space-y-2">
            {hints.map((hint, i) => (
              <li key={i} className="text-sm leading-relaxed text-foreground flex gap-2">
                <span className="shrink-0 text-primary">-</span>
                <span>{hint}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
