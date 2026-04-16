// ========== 元素定義 ==========
export type ElementCode = 'Rg' | 'Gr' | 'Em' | 'Co' | 'Cu' | 'Sc';

export type CategoryCode = 'competence' | 'connection' | 'flourishing';

export interface Element {
  code: ElementCode;
  name: string;
  category: CategoryCode;
  description: string;
  academicBase: string;
}

// ========== 質問定義 ==========
export type QuestionId = 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7';

export interface Question {
  id: QuestionId;
  text: string;
  inputType: 'basic_info' | 'multi_choice' | 'free_text_only';
  choices?: Choice[];
  maxSelection?: number;
  followUpPrompt?: string;
  skipFollowUpIfAny?: string[];
  primaryElements: ElementCode[];
  secondaryElements: ElementCode[];
}

export interface Choice {
  id: string;
  label: string;
  exclusive?: boolean;
  isOther?: boolean;
}

// ========== 回答データ ==========
export interface ChildInfo {
  nickname: string;
  age: number;
}

export interface Response {
  selectedChoices: string[];
  freeText: string | null;
  inputMethod: 'voice' | 'text' | 'choice_only';
  skippedFreeText: boolean;
}

export interface AssessmentData {
  sessionId: string;
  child: ChildInfo;
  responses: Partial<Record<QuestionId, Response>>;
  parentWish: string;
  createdAt: string;
}

// ========== スコア結果 ==========
export interface ElementScore {
  code: ElementCode;
  score: number;
  reasoning: string;
}

export interface AnalysisResult {
  scores: ElementScore[];
  topTwo: [ElementCode, ElementCode];
  typeName: string;
  typeCode: string;
  personalComment: string;
  growthHints: string[];
}

// ========== API ==========
export interface AnalyzeRequest {
  assessment: AssessmentData;
}

export interface AnalyzeResponse {
  ok: boolean;
  result?: AnalysisResult;
  error?: string;
}
