'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CATEGORIES, ELEMENTS } from '@/lib/elements';
import type { ElementScore, CategoryCode, ElementCode } from '@/lib/types';

interface CategoryBreakdownProps {
  scores: ElementScore[];
}

function getScoreInterpretation(score: number): string {
  if (score >= 80) return 'とても高い — この力がお子さんの大きな強みです';
  if (score >= 65) return 'やや高い — しっかり育ってきています';
  if (score >= 45) return 'ふつう — 年齢相応に発達しています';
  if (score >= 30) return 'やや低め — 伸びしろがある領域です';
  return '低め — 日常の関わりで少しずつ育てていける領域です';
}

export function CategoryBreakdown({ scores }: CategoryBreakdownProps) {
  const [selectedElement, setSelectedElement] = useState<ElementCode | null>(null);

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

  const selected = selectedElement ? ELEMENTS[selectedElement] : null;
  const selectedScore = selectedElement
    ? scores.find((s) => s.code === selectedElement)
    : null;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        {categories.map((cat) => (
          <Card key={cat.key} className="py-3 gap-1">
            <CardContent className="text-center space-y-1">
              <p className="text-xs text-muted-foreground">{cat.label}</p>
              <p className="text-2xl font-bold text-foreground">{cat.avg}</p>
              <div className="text-xs text-muted-foreground space-y-0.5">
                {cat.elements.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() =>
                      setSelectedElement(
                        selectedElement === code ? null : (code as ElementCode)
                      )
                    }
                    className="block w-full rounded-md px-1 py-0.5 hover:bg-primary/10 active:bg-primary/20 transition-colors"
                  >
                    <span
                      className={
                        selectedElement === code
                          ? 'text-primary font-medium'
                          : ''
                      }
                    >
                      {ELEMENTS[code].name}{' '}
                      {scores.find((s) => s.code === code)?.score ?? '-'}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 選択した元素の詳細パネル */}
      {selected && selectedScore && (
        <Card className="py-3 gap-2 border-primary/30 bg-primary/5">
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm text-foreground">
                {selected.name}（{selected.code}）
                <span className="ml-2 text-primary font-bold">
                  {selectedScore.score}点
                </span>
              </h4>
              <button
                type="button"
                onClick={() => setSelectedElement(null)}
                className="p-1 rounded-md hover:bg-muted transition-colors"
                aria-label="閉じる"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <p className="text-sm text-foreground">{selected.description}</p>
            <p className="text-xs text-muted-foreground">
              {getScoreInterpretation(selectedScore.score)}
            </p>
            <p className="text-xs text-muted-foreground italic">
              学術的背景: {selected.academicBase}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
