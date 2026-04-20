'use client';

import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Lightbulb, TrendingUp } from 'lucide-react';
import { ELEMENTS } from '@/lib/elements';
import type { ElementScore, ElementCode } from '@/lib/types';

interface PersonalCommentProps {
  comment: string;
  hints: string[];
  nickname: string;
  scores: ElementScore[];
}

const GROWTH_BENEFITS: Record<ElementCode, string> = {
  Rg: '気持ちの切り替えが上手になり、落ち着いて行動できるようになります',
  Gr: '難しいことにも粘り強く取り組めるようになります',
  Em: 'お友達の気持ちにもっと寄り添えるようになります',
  Co: 'みんなと協力して楽しく活動できるようになります',
  Cu: '新しいことへの興味がどんどん広がります',
  Sc: '自分に自信を持って、のびのびチャレンジできるようになります',
};

function normalizeNameSuffix(text: string, nickname: string): string {
  let result = text;
  // 「さんくん」「さんちゃん」→「さん」
  result = result.replaceAll(`${nickname}さんくん`, `${nickname}さん`);
  result = result.replaceAll(`${nickname}さんちゃん`, `${nickname}さん`);
  // 「くん」「ちゃん」→「さん」
  result = result.replaceAll(`${nickname}くん`, `${nickname}さん`);
  result = result.replaceAll(`${nickname}ちゃん`, `${nickname}さん`);
  // まだ「さん」がなければ付与
  if (!result.includes(`${nickname}さん`)) {
    result = result.replaceAll(nickname, `${nickname}さん`);
  }
  return result;
}

export function PersonalComment({ comment, hints, nickname, scores }: PersonalCommentProps) {
  const displayComment = normalizeNameSuffix(comment, nickname);

  // 伸びしろ要素: スコアが低い順に1〜2個
  const sorted = [...scores].sort((a, b) => a.score - b.score);
  const growthElements = sorted.slice(0, 2);

  return (
    <div className="space-y-3">
      <Card className="py-3 gap-2">
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <MessageCircle className="h-4 w-4" />
            <h3 className="font-medium text-sm">パーソナルコメント</h3>
          </div>
          <p className="text-sm leading-relaxed text-foreground">{displayComment}</p>
        </CardContent>
      </Card>

      <Card className="py-3 gap-2">
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-accent-foreground">
            <Lightbulb className="h-4 w-4" />
            <h3 className="font-medium text-sm">伸びしろヒント</h3>
          </div>

          {/* 伸びしろ要素の紹介 */}
          <div className="rounded-md bg-muted/50 px-3 py-2 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>伸びしろの力</span>
            </div>
            {growthElements.map((el) => {
              const elem = ELEMENTS[el.code];
              return (
                <p key={el.code} className="text-sm leading-relaxed text-foreground">
                  <span className="font-medium">「{elem.name}」</span>
                  <span className="ml-1">— {GROWTH_BENEFITS[el.code as ElementCode]}</span>
                </p>
              );
            })}
          </div>

          <ul className="space-y-2">
            {hints.map((hint, i) => (
              <li key={i} className="text-sm leading-relaxed text-foreground flex gap-2">
                <span className="shrink-0 text-primary">-</span>
                <span>{hint}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
