'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessment } from '@/contexts/AssessmentContext';
import { QUESTIONS } from '@/lib/questions';
import { ProgressBar } from './ProgressBar';
import { QuestionBubble } from './QuestionBubble';
import { AgeSlider } from './AgeSlider';
import { ChoiceList } from './ChoiceList';
import { FollowUpInput } from './FollowUpInput';
import type { QuestionId, Response } from '@/lib/types';

type SubStep = 'question' | 'follow_up';

interface ChatMessage {
  role: 'assistant' | 'user';
  content: string;
}

export function ChatContainer() {
  const router = useRouter();
  const {
    currentQuestionIndex,
    child,
    setResponse,
    setParentWish,
    goToNext,
    setResult,
    setIsAnalyzing,
    getAssessmentData,
  } = useAssessment();

  const [subStep, setSubStep] = useState<SubStep>('question');
  const [pendingChoices, setPendingChoices] = useState<string[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const question = QUESTIONS[currentQuestionIndex];
  const childName = child?.nickname ?? 'お子さん';

  const resolveText = useCallback(
    (text: string) => text.replace(/{childName}/g, childName),
    [childName]
  );

  // 画面下部に自動スクロール
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentQuestionIndex, subStep, chatHistory.length]);

  const addUserMessage = (content: string) => {
    setChatHistory((prev) => [...prev, { role: 'user', content }]);
  };

  // 選択肢送信
  const handleChoiceSubmit = (selected: string[]) => {
    setPendingChoices(selected);
    const labels = selected
      .map(
        (id) =>
          question.choices?.find((c) => c.id === id)?.label ?? id
      )
      .join('、');
    addUserMessage(labels);

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
    addUserMessage(text);
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
    addUserMessage(text);
    setParentWish(text);

    setIsAnalyzing(true);
    router.push('/result');

    try {
      const data = getAssessmentData();
      // parentWish はまだ state に反映されていない可能性があるので直接セット
      data.parentWish = text;

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessment: data }),
      });

      const json = await res.json();
      if (json.ok && json.result) {
        setResult(json.result);
      }
    } catch {
      // エラーは結果画面で表示
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 現在の質問文
  const currentQuestionText = resolveText(question.text);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b bg-card">
        <ProgressBar current={currentQuestionIndex} total={QUESTIONS.length} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* 過去のチャット履歴 */}
        {chatHistory.map((msg, i) => (
          <div key={i}>
            {msg.role === 'assistant' ? (
              <QuestionBubble text={msg.content} />
            ) : (
              <div className="flex justify-end">
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%]">
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* 現在の質問 */}
        <QuestionBubble text={currentQuestionText} />

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
              prompt={currentQuestionText}
              onSubmit={handleFreeTextSubmit}
              onSkip={() => handleFreeTextSubmit('', 'text')}
              showSkip={false}
            />
          )}
        </div>

        <div ref={scrollRef} />
      </div>
    </div>
  );
}
