import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import Anthropic from '@anthropic-ai/sdk';
import { getAnthropicClient, getModel } from '@/lib/anthropic';
import { buildSystemPrompt, buildUserMessage } from '@/lib/scoring-prompt';
import type { AnalyzeResponse, AnalysisResult } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

const analysisResultSchema = z.object({
  scores: z.array(
    z.object({
      code: z.enum(['Rg', 'Gr', 'Em', 'Co', 'Cu', 'Sc']),
      score: z.number().min(0).max(100),
      reasoning: z.string(),
    })
  ).length(6),
  topTwo: z.tuple([
    z.enum(['Rg', 'Gr', 'Em', 'Co', 'Cu', 'Sc']),
    z.enum(['Rg', 'Gr', 'Em', 'Co', 'Cu', 'Sc']),
  ]),
  typeCode: z.string(),
  typeName: z.string(),
  personalComment: z.string(),
  growthHints: z.array(z.string()).min(1).max(5),
});

function extractJSON(text: string): string {
  // ```json ... ``` ブロックからJSONを抽出
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }
  // 先頭/末尾の空白や余分なテキストを除去して { ... } を抽出
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }
  return text.trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const assessment = body.assessment;

    if (!assessment?.child?.nickname || !assessment?.responses) {
      return NextResponse.json(
        { ok: false, error: '入力データが不足しています。' } satisfies AnalyzeResponse,
        { status: 400 }
      );
    }

    const client = getAnthropicClient();
    const systemPrompt = buildSystemPrompt();
    const userMessage = buildUserMessage(assessment);

    const message = await client.messages.create({
      model: getModel(),
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    const textBlock = message.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text response from API');
    }

    const rawText = textBlock.text;
    const jsonText = extractJSON(rawText);

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      console.error('Failed to parse JSON. Raw response:', rawText.slice(0, 500));
      throw new Error('API response was not valid JSON');
    }

    const result = analysisResultSchema.parse(parsed) as AnalysisResult;

    return NextResponse.json({ ok: true, result } satisfies AnalyzeResponse);
  } catch (error) {
    // Anthropic SDK の認証エラーを明確に区別
    if (error instanceof Anthropic.AuthenticationError) {
      console.error('Anthropic authentication failed. Check ANTHROPIC_API_KEY.');
      return NextResponse.json(
        {
          ok: false,
          error: 'APIの認証に失敗しました。管理者にお問い合わせください。',
        } satisfies AnalyzeResponse,
        { status: 500 }
      );
    }

    console.error('Analysis error:', error);
    return NextResponse.json(
      {
        ok: false,
        error: '解析中にエラーが発生しました。もう一度お試しください。',
      } satisfies AnalyzeResponse,
      { status: 500 }
    );
  }
}
