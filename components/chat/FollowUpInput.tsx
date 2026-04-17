'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { VoiceInput } from './VoiceInput';

interface FollowUpInputProps {
  prompt: string;
  onSubmit: (text: string, method: 'text' | 'voice') => void;
  onSkip: () => void;
  showSkip?: boolean;
  submitLabel?: string;
}

export function FollowUpInput({
  prompt,
  onSubmit,
  onSkip,
  showSkip = true,
  submitLabel = '次へ',
}: FollowUpInputProps) {
  const [text, setText] = useState('');
  const [inputMethod, setInputMethod] = useState<'text' | 'voice'>('text');

  const handleVoiceTranscript = (transcript: string) => {
    setText(transcript);
    setInputMethod('voice');
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setInputMethod('text');
          }}
          placeholder="自由にお書きください..."
          className="min-h-[80px] resize-none"
        />
        <div className="shrink-0 self-end">
          <VoiceInput onTranscript={handleVoiceTranscript} />
        </div>
      </div>
      <div className="flex gap-2">
        {showSkip && (
          <Button variant="outline" onClick={onSkip} className="flex-1">
            スキップ
          </Button>
        )}
        <Button
          onClick={() => onSubmit(text.trim(), inputMethod)}
          disabled={text.trim().length === 0}
          className="flex-1"
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
