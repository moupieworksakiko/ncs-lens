import { Element, CategoryCode } from './types';

export const ELEMENTS: Record<string, Element> = {
  Rg: {
    code: 'Rg',
    name: '整える力',
    category: 'competence',
    description: '感情や衝動とうまく付き合う力',
    academicBase: 'Self-Regulation (Mischel, Baumeister)',
  },
  Gr: {
    code: 'Gr',
    name: 'やりぬく力',
    category: 'competence',
    description: '困難があっても続ける力・立ち直る力',
    academicBase: 'Grit (Duckworth) / Resilience (Werner)',
  },
  Em: {
    code: 'Em',
    name: '思いやり',
    category: 'connection',
    description: '相手の気持ちを想像し寄り添う力',
    academicBase: 'Empathy / Theory of Mind',
  },
  Co: {
    code: 'Co',
    name: '一緒にやる力',
    category: 'connection',
    description: '協力し、ルールを理解し、居場所をつくる力',
    academicBase: 'Cooperation (OECD SES)',
  },
  Cu: {
    code: 'Cu',
    name: 'ワクワクする力',
    category: 'flourishing',
    description: '好奇心・新しいことを楽しむ力',
    academicBase: 'Intrinsic Motivation (Deci & Ryan)',
  },
  Sc: {
    code: 'Sc',
    name: '自分が好き',
    category: 'flourishing',
    description: 'ありのままの自分にOKを出せる力',
    academicBase: 'Self-Acceptance (Rogers)',
  },
};

export const CATEGORIES: Record<
  CategoryCode,
  { label: string; elements: string[] }
> = {
  competence: { label: 'できる力', elements: ['Rg', 'Gr'] },
  connection: { label: 'つながる力', elements: ['Em', 'Co'] },
  flourishing: { label: 'たのしむ力', elements: ['Cu', 'Sc'] },
};
