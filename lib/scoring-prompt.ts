import { AssessmentData } from './types';
import { ELEMENTS } from './elements';
import { QUESTIONS } from './questions';
import { TYPE_NAMES } from './type-names';

export function buildSystemPrompt(): string {
  const typeList = Object.entries(TYPE_NAMES)
    .map(([code, name]) => `- ${code}: ${name}`)
    .join('\n');

  return `あなたは児童心理学と非認知能力研究に精通した発達アセスメントの専門家です。
親が記入した「NCS Lens」の回答データから、お子さんの6つの非認知能力要素を推定し、温かく誠実なフィードバックを返します。

## 6つの元素（すべて0〜100でスコア化）

1. Rg（整える力）：Self-Regulation。感情・衝動のコントロール、実行機能
2. Gr（やりぬく力）：Grit & Resilience。粘り強さ、立ち直る力
3. Em（思いやり）：Empathy & Theory of Mind。他者理解、共感性
4. Co（一緒にやる力）：Cooperation。協調性、規範意識
5. Cu（ワクワクする力）：Curiosity & Intrinsic Motivation。好奇心、探究心
6. Sc（自分が好き）：Self-Acceptance。自己受容、自己肯定感

## 解析の原則

- 選択肢のみの回答でも確度の高い推定を行う（親の負担への配慮）
- 自由回答がある場合は、行動の具体性・頻度・継続性を重視
- 親の記述に含まれる「子どもの言葉」「表情」「その後の行動」を重視
- 発達段階（年齢）を考慮する
- 「困った場面」の記述はネガティブ評価ではなく、伸びしろとして解釈
- 不明な元素は50±10の中央値に近づける（過剰推定を避ける）

## 出力ルール

- すべての元素に0-100のスコアを付与
- 上位2元素の組み合わせで typeCode（例: "Cu-Em"）を決定
- typeName は下記の辞書から選ぶ
- personalComment は親の願い（parentWish）と重ね合わせた300字程度の温かい文章
- growthHints は伸びしろの低い1〜2要素について、日常で親ができる小さな関わり方を提案（2〜3個）

## タイプ辞書

${typeList}

## 出力形式（厳密なJSON）

{
  "scores": [
    { "code": "Rg", "score": 72, "reasoning": "..." },
    { "code": "Gr", "score": 68, "reasoning": "..." },
    { "code": "Em", "score": 85, "reasoning": "..." },
    { "code": "Co", "score": 70, "reasoning": "..." },
    { "code": "Cu", "score": 88, "reasoning": "..." },
    { "code": "Sc", "score": 75, "reasoning": "..." }
  ],
  "topTwo": ["Cu", "Em"],
  "typeCode": "Cu-Em",
  "typeName": "やさしい探検家",
  "personalComment": "...",
  "growthHints": ["...", "..."]
}

重要な制約：
- JSONのみを返し、前後に説明文を一切つけないこと
- \`\`\`json などのコードブロック記法で囲まないこと。純粋なJSONだけを出力すること
- reasoning は各要素30文字以内の簡潔な日本語にすること
- personalComment は200文字以内にすること
- growthHints は各50文字以内にすること`;
}

export function buildUserMessage(assessment: AssessmentData): string {
  const lines: string[] = [];
  lines.push(`## お子さんの情報`);
  lines.push(`- ニックネーム: ${assessment.child.nickname}`);
  lines.push(`- 年齢: ${assessment.child.age}歳`);
  lines.push('');

  lines.push(`## 回答データ`);

  for (const q of QUESTIONS) {
    if (q.id === 'q1') continue;

    const resp = assessment.responses[q.id];
    if (!resp) continue;

    lines.push('');
    lines.push(`### ${q.id}: ${q.text.replace('{childName}', assessment.child.nickname)}`);

    if (resp.selectedChoices.length > 0 && q.choices) {
      const labels = resp.selectedChoices
        .map((id) => q.choices!.find((c) => c.id === id)?.label ?? id)
        .join(', ');
      lines.push(`選択: ${labels}`);
    }

    if (resp.freeText) {
      lines.push(`自由回答: ${resp.freeText}`);
    } else if (resp.skippedFreeText) {
      lines.push(`（深掘り回答: スキップ）`);
    }

    const pElems = q.primaryElements
      .map((c) => `${c}(${ELEMENTS[c].name})`)
      .join(', ');
    const sElems = q.secondaryElements
      .map((c) => `${c}(${ELEMENTS[c].name})`)
      .join(', ');
    if (pElems) lines.push(`主要元素: ${pElems}`);
    if (sElems) lines.push(`副次元素: ${sElems}`);
  }

  if (assessment.parentWish) {
    lines.push('');
    lines.push(`## 親の願い`);
    lines.push(assessment.parentWish);
  }

  return lines.join('\n');
}
