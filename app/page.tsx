import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-primary">
            <Sparkles className="h-8 w-8" />
            <span className="text-2xl font-bold">NCS Lens</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            子どもの&quot;らしさ&quot;を
            <br />
            見つめる、5分のインタビュー
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            学力じゃない、
            <br />
            &quot;幸せに生きるちから&quot;を見つけにいこう
          </p>
        </div>

        <Link
          href="/assessment"
          className={cn(
            buttonVariants({ size: 'lg' }),
            'text-lg px-10 py-6 rounded-full'
          )}
        >
          はじめる
        </Link>

        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <span>約5分</span>
          <span aria-hidden="true">|</span>
          <span>全7問</span>
          <span aria-hidden="true">|</span>
          <span>アカウント不要</span>
        </div>
      </div>
    </main>
  );
}
