'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import {
  ChildInfo,
  QuestionId,
  Response,
  AssessmentData,
  AnalysisResult,
} from '@/lib/types';

interface AssessmentState {
  currentQuestionIndex: number;
  child: ChildInfo | null;
  responses: Partial<Record<QuestionId, Response>>;
  parentWish: string;
  result: AnalysisResult | null;
  isAnalyzing: boolean;
}

interface AssessmentContextValue extends AssessmentState {
  setChild: (child: ChildInfo) => void;
  setResponse: (questionId: QuestionId, response: Response) => void;
  setParentWish: (wish: string) => void;
  goToNext: () => void;
  goToPrev: () => void;
  setResult: (result: AnalysisResult) => void;
  setIsAnalyzing: (v: boolean) => void;
  getAssessmentData: () => AssessmentData;
  reset: () => void;
}

const AssessmentContext = createContext<AssessmentContextValue | null>(null);

const initialState: AssessmentState = {
  currentQuestionIndex: 0,
  child: null,
  responses: {},
  parentWish: '',
  result: null,
  isAnalyzing: false,
};

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AssessmentState>(initialState);

  const setChild = useCallback((child: ChildInfo) => {
    setState((s) => ({ ...s, child }));
  }, []);

  const setResponse = useCallback(
    (questionId: QuestionId, response: Response) => {
      setState((s) => ({
        ...s,
        responses: { ...s.responses, [questionId]: response },
      }));
    },
    []
  );

  const setParentWish = useCallback((wish: string) => {
    setState((s) => ({ ...s, parentWish: wish }));
  }, []);

  const goToNext = useCallback(() => {
    setState((s) => ({
      ...s,
      currentQuestionIndex: Math.min(s.currentQuestionIndex + 1, 6),
    }));
  }, []);

  const goToPrev = useCallback(() => {
    setState((s) => ({
      ...s,
      currentQuestionIndex: Math.max(s.currentQuestionIndex - 1, 0),
    }));
  }, []);

  const setResult = useCallback((result: AnalysisResult) => {
    setState((s) => ({ ...s, result }));
  }, []);

  const setIsAnalyzing = useCallback((v: boolean) => {
    setState((s) => ({ ...s, isAnalyzing: v }));
  }, []);

  const getAssessmentData = useCallback((): AssessmentData => {
    return {
      sessionId: crypto.randomUUID(),
      child: state.child ?? { nickname: '', age: 5 },
      responses: state.responses,
      parentWish: state.parentWish,
      createdAt: new Date().toISOString(),
    };
  }, [state.child, state.responses, state.parentWish]);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <AssessmentContext.Provider
      value={{
        ...state,
        setChild,
        setResponse,
        setParentWish,
        goToNext,
        goToPrev,
        setResult,
        setIsAnalyzing,
        getAssessmentData,
        reset,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const ctx = useContext(AssessmentContext);
  if (!ctx) {
    throw new Error('useAssessment must be used within AssessmentProvider');
  }
  return ctx;
}
