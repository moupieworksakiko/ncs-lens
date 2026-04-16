import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
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
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    const textBlock = message.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text response from API');
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(textBlock.text);
    } catch {
      throw new Error('API response was not valid JSON');
    }

    const result = analysisResultSchema.parse(parsed) as AnalysisResult;

    return NextResponse.json({ ok: true, result } satisfies AnalyzeResponse);
  } catch (error) {
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
