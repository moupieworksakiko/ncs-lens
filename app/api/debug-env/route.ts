import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const key = process.env.ANTHROPIC_API_KEY ?? '';
  const model = process.env.ANTHROPIC_MODEL ?? '(not set)';

  return NextResponse.json({
    keyExists: key.length > 0,
    keyLength: key.length,
    keyPrefix: key.slice(0, 7),
    keySuffix: key.slice(-4),
    hasWhitespace: key !== key.trim(),
    hasQuotes: key.startsWith('"') || key.startsWith("'"),
    model,
  });
}
