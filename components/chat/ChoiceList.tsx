'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Choice } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ChoiceListProps {
  choices: Choice[];
  maxSelection: number;
  onSubmit: (selected: string[]) => void;
}

export function ChoiceList({ choices, maxSelection, onSubmit }: ChoiceListProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (choice: Choice) => {
    if (choice.exclusive) {
      setSelected((prev) => (prev.includes(choice.id) ? [] : [choice.id]));
      return;
    }

    setSelected((prev) => {
      // 排他選択肢が選ばれていたら外す
      const withoutExclusive = prev.filter(
        (id) => !choices.find((c) => c.id === id)?.exclusive
      );

      if (withoutExclusive.includes(choice.id)) {
        return withoutExclusive.filter((id) => id !== choice.id);
      }
      if (withoutExclusive.length >= maxSelection) {
        return withoutExclusive;
      }
      return [...withoutExclusive, choice.id];
    });
  };

  const isSelected = (id: string) => selected.includes(id);

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        {maxSelection}つまで選べます
      </p>
      <div className="space-y-2">
        {choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            onClick={() => toggle(choice)}
            className={cn(
              'w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-sm text-left transition-colors',
              isSelected(choice.id)
                ? 'border-primary bg-primary/5 text-foreground'
                : 'border-border bg-card hover:bg-muted/50 text-foreground'
            )}
          >
            <span
              className={cn(
                'shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors',
                isSelected(choice.id)
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'border-border'
              )}
            >
              {isSelected(choice.id) && <Check className="h-3 w-3" />}
            </span>
            <span>{choice.label}</span>
          </button>
        ))}
      </div>
      <Button
        onClick={() => onSubmit(selected)}
        disabled={selected.length === 0}
        className="w-full"
      >
        次へ
      </Button>
    </div>
  );
}
