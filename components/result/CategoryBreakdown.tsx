'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CATEGORIES, ELEMENTS } from '@/lib/elements';
import type { ElementScore, CategoryCode } from '@/lib/types';

interface CategoryBreakdownProps {
  scores: ElementScore[];
}

export function CategoryBreakdown({ scores }: CategoryBreakdownProps) {
  const categories = (Object.keys(CATEGORIES) as CategoryCode[]).map(
    (key) => {
      const cat = CATEGORIES[key];
      const catScores = cat.elements.map(
        (code) => scores.find((s) => s.code === code)?.score ?? 50
      );
      const avg = Math.round(
        catScores.reduce((a, b) => a + b, 0) / catScores.length
      );
      return { key, label: cat.label, elements: cat.elements, avg };
    }
  );

  return (
    <div className="grid grid-cols-3 gap-3">
      {categories.map((cat) => (
        <Card key={cat.key}>
          <CardContent className="pt-4 text-center space-y-1">
            <p className="text-xs text-muted-foreground">{cat.label}</p>
            <p className="text-2xl font-bold text-foreground">{cat.avg}</p>
            <div className="text-xs text-muted-foreground space-y-0.5">
              {cat.elements.map((code) => (
                <p key={code}>
                  {ELEMENTS[code].name}{' '}
                  {scores.find((s) => s.code === code)?.score ?? '-'}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
