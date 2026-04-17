'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface TypeCardProps {
  nickname: string;
  age: number;
  typeName: string;
  typeCode: string;
}

export function TypeCard({ nickname, age, typeName, typeCode }: TypeCardProps) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="pt-6 text-center space-y-2">
        <div className="inline-flex items-center gap-2 text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <p className="text-muted-foreground">
          {nickname}さん（{age}歳）は
        </p>
        <h2 className="text-2xl font-bold text-foreground">{typeName}</h2>
        <p className="text-sm text-muted-foreground">{typeCode} 型</p>
      </CardContent>
    </Card>
  );
}
