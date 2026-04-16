'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button';
import { useAssessment } from '@/contexts/AssessmentContext';
import { RadarChart } from '@/components/result/RadarChart';
import { TypeCard } from '@/components/result/TypeCard';
import { CategoryBreakdown } from '@/components/result/CategoryBreakdown';
import { PersonalComment } from '@/components/result/PersonalComment';
import { cn } from '@/lib/utils';

export default function ResultPage() {
  const router = useRouter();
  const { child, result, isAnalyzing, reset } = useAssessment();

  // 不完全な状態でアクセスされた場合リダイレクト
  useEffect(() => {
    if (!child && !isAnalyzing) {
      router.replace('/');
    }
  }, [child, isAnalyzing, router]);

  if (isAnalyzing || !result) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-lg font-medium text-foreground">
          {child?.nickname ?? 'お子さん'}の個性の構成元素を
          <br />
          整えています...
        </p>
        <p className="text-sm text-muted-foreground">
          少しだけお待ちください
        </p>
      </div>
    );
  }

  if (!child) return null;

  const handleReset = () => {
    reset();
    router.push('/');
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-primary mb-2">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium">NCS Lens 結果</span>
          </div>
        </div>

        <TypeCard
          nickname={child.nickname}
          age={child.age}
          typeName={result.typeName}
          typeCode={result.typeCode}
        />

        <RadarChart scores={result.scores} />

        <CategoryBreakdown scores={result.scores} />

        <PersonalComment
          comment={result.personalComment}
          hints={result.growthHints}
        />

        <div className="pt-4 pb-8">
          <Button
            onClick={handleReset}
            variant="outline"
            className="w-full"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            もう一度やってみる
          </Button>
        </div>
      </div>
    </div>
  );
}
