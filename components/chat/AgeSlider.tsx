'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAssessment } from '@/contexts/AssessmentContext';

export function AgeSlider() {
  const { setChild, goToNext } = useAssessment();
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState(5);

  const canSubmit = nickname.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setChild({ nickname: nickname.trim(), age });
    goToNext();
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="nickname" className="text-sm font-medium">
          ニックネーム
        </label>
        <input
          id="nickname"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="例：たろう"
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          年齢：<span className="text-primary font-bold">{age}歳</span>
        </label>
        <Slider
          value={age}
          onValueChange={(v) => setAge(typeof v === 'number' ? v : v[0])}
          min={0}
          max={18}
          step={1}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0歳</span>
          <span>18歳</span>
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full"
      >
        次へ
      </Button>
    </div>
  );
}
