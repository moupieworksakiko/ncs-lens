'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, RotateCcw, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAssessment } from '@/contexts/AssessmentContext';
import { RadarChart } from '@/components/result/RadarChart';
import { TypeCard } from '@/components/result/TypeCard';
import { CategoryBreakdown } from '@/components/result/CategoryBreakdown';
import { PersonalComment } from '@/components/result/PersonalComment';

export default function ResultPage() {
  const router = useRouter();
  const { child, result, isAnalyzing, analysisError, reset } = useAssessment();

  useEffect(() => {
    if (!child && !isAnalyzing) {
      router.replace('/');
    }
  }, [child, isAnalyzing, router]);

  // ローディング中
  if (isAnalyzing) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-lg font-medium text-foreground">
          「{child?.nickname ?? ''}」さんの個性を分析しています...
        </p>
        <p className="text-sm text-muted-foreground">
          少しだけお待ちください（10〜20秒ほど）
        </p>
      </div>
    );
  }

  // エラー発生
  if (analysisError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-4">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-lg font-medium text-foreground">
          分析できませんでした
        </p>
        <p className="text-sm text-muted-foreground text-center">
          {analysisError}
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.push('/assessment')}>
            質問に戻る
          </Button>
          <Button onClick={() => {
            reset();
            router.push('/');
          }}>
            最初からやり直す
          </Button>
        </div>
      </div>
    );
  }

  if (!result || !child) return null;

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
