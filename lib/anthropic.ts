import Anthropic from '@anthropic-ai/sdk';

let client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!client) {
    client = new Anthropic();
  }
  return client;
}

export function getModel(): string {
  return process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-6';
}
