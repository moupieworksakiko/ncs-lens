'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { QUESTIONS } from '@/lib/questions';
import { Button } from '@/components/ui/button';
import { ProgressBar } from './ProgressBar';
import { QuestionBubble } from './QuestionBubble';
import { AgeSlider } from './AgeSlider';
import { ChoiceList } from './ChoiceList';
import { FollowUpInput } from './FollowUpInput';
import type { QuestionId, Response } from '@/lib/types';

type SubStep = 'question' | 'follow_up';

export function ChatContainer() {
  const router = useRouter();
  const {
    currentQuestionIndex,
    child,
    responses,
    setResponse,
    setParentWish,
    goToNext,
    goToPrev,
    setResult,
    setIsAnalyzing,
    setAnalysisError,
    getAssessmentData,
  } = useAssessment();

  const [subStep, setSubStep] = useState<SubStep>('question');
  const [pendingChoices, setPendingChoices] = useState<string[]>([]);

  const question = QUESTIONS[currentQuestionIndex];
  const childName = child?.nickname ? `${child.nickname}さん` : 'お子さん';
  const existingResponse = responses[question.id as QuestionId];

  const resolveText = useCallback(
    (text: string) => text.replace(/{childName}/g, childName),
    [childName]
  );

  const handleBack = () => {
    setSubStep('question');
    setPendingChoices([]);
    goToPrev();
  };

  // 選択肢送信
  const handleChoiceSubmit = (selected: string[]) => {
    setPendingChoices(selected);

    // 深掘りスキップ判定
    const shouldSkipFollowUp =
      !question.followUpPrompt ||
      (question.skipFollowUpIfAny &&
        question.skipFollowUpIfAny.some((id) => selected.includes(id)));

    if (shouldSkipFollowUp) {
      const resp: Response = {
        selectedChoices: selected,
        freeText: null,
        inputMethod: 'choice_only',
        skippedFreeText: true,
      };
      setResponse(question.id as QuestionId, resp);
      setSubStep('question');
      goToNext();
    } else {
      setSubStep('follow_up');
    }
  };

  // 深掘り送信
  const handleFollowUpSubmit = (text: string, method: 'text' | 'voice') => {
    const resp: Response = {
      selectedChoices: pendingChoices,
      freeText: text,
      inputMethod: method,
      skippedFreeText: false,
    };
    setResponse(question.id as QuestionId, resp);
    setPendingChoices([]);
    setSubStep('question');
    goToNext();
  };

  // 深掘りスキップ
  const handleFollowUpSkip = () => {
    const resp: Response = {
      selectedChoices: pendingChoices,
      freeText: null,
      inputMethod: 'choice_only',
      skippedFreeText: true,
    };
    setResponse(question.id as QuestionId, resp);
    setPendingChoices([]);
    setSubStep('question');
    goToNext();
  };

  // Q7（自由記述のみ） → 解析
  const handleFreeTextSubmit = async (
    text: string,
    method: 'text' | 'voice'
  ) => {
    setParentWish(text);
    setIsAnalyzing(true);
    setAnalysisError(null);
    router.push('/result');

    try {
      const data = getAssessmentData();
      data.parentWish = text;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 55000);

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessment: data }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const json = await res.json();
      if (json.ok && json.result) {
        setResult(json.result);
      } else {
        setAnalysisError(json.error ?? '解析に失敗しました。もう一度お試しください。');
      }
    } catch {
      setAnalysisError('通信エラーが発生しました。もう一度お試しください。');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 既回答の選択肢ラベルを取得
  const getAnswerSummary = (): string | null => {
    if (!existingResponse) return null;
    const labels: string[] = [];
    if (existingResponse.selectedChoices.length > 0 && question.choices) {
      labels.push(
        existingResponse.selectedChoices
          .map((id) => question.choices!.find((c) => c.id === id)?.label ?? id)
          .join('、')
      );
    }
    if (existingResponse.freeText) {
      labels.push(`「${existingResponse.freeText}」`);
    }
    return labels.length > 0 ? labels.join(' / ') : null;
  };

  const answerSummary = getAnswerSummary();
  const pendingChoiceSummary =
    question.choices && pendingChoices.length > 0
      ? pendingChoices
          .map((id) => question.choices!.find((c) => c.id === id)?.label ?? id)
          .join('、')
      : null;

  return (
    <div className="flex flex-col h-full">
      {/* ヘッダー: 戻るボタン + プログレス */}
      <div className="px-4 py-3 border-b bg-card flex items-center gap-3">
        {currentQuestionIndex > 0 && (
          <button
            onClick={handleBack}
            className="shrink-0 p-1 rounded-lg hover:bg-muted transition-colors"
            aria-label="前の質問に戻る"
          >
            <ChevronLeft className="h-5 w-5 text-muted-foreground" />
          </button>
        )}
        <div className="flex-1">
          <ProgressBar current={currentQuestionIndex} total={QUESTIONS.length} />
        </div>
      </div>

      {/* メインエリア: 1問だけ表示 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* 質問バブル */}
        <QuestionBubble text={resolveText(question.text)} />

        {/* 前回の回答がある場合は表示 */}
        {answerSummary && subStep === 'question' && (
          <div className="flex justify-end">
            <div className="bg-primary/10 text-foreground rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%]">
              <p className="text-xs text-muted-foreground mb-1">前回の回答:</p>
              <p className="text-sm">{answerSummary}</p>
            </div>
          </div>
        )}

        {/* 選択式回答の結果（深掘り前） */}
        {pendingChoiceSummary && subStep === 'follow_up' && (
          <div className="flex justify-end">
            <div className="bg-primary/10 text-foreground rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%]">
              <p className="text-sm">{pendingChoiceSummary}</p>
            </div>
          </div>
        )}

        {/* 入力エリア */}
        <div className="pb-2">
          {question.inputType === 'basic_info' && <AgeSlider />}

          {question.inputType === 'multi_choice' &&
            subStep === 'question' &&
            question.choices && (
              <ChoiceList
                choices={question.choices}
                maxSelection={question.maxSelection ?? 3}
                onSubmit={handleChoiceSubmit}
                initialSelected={existingResponse?.selectedChoices}
              />
            )}

          {question.inputType === 'multi_choice' &&
            subStep === 'follow_up' &&
            question.followUpPrompt && (
              <>
                <div className="mb-3">
                  <QuestionBubble
                    text={resolveText(question.followUpPrompt)}
                  />
                </div>
                <FollowUpInput
                  prompt={resolveText(question.followUpPrompt)}
                  onSubmit={handleFollowUpSubmit}
                  onSkip={handleFollowUpSkip}
                />
              </>
            )}

          {question.inputType === 'free_text_only' && (
            <FollowUpInput
              prompt={resolveText(question.text)}
              onSubmit={handleFreeTextSubmit}
              onSkip={() => handleFreeTextSubmit('', 'text')}
              showSkip={false}
              submitLabel="完了"
            />
          )}
        </div>
      </div>
    </div>
  );
}
