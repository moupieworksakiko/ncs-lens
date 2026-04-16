'use client';

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { ELEMENTS } from '@/lib/elements';
import type { ElementScore } from '@/lib/types';

interface RadarChartProps {
  scores: ElementScore[];
}

export function RadarChart({ scores }: RadarChartProps) {
  const data = scores.map((s) => ({
    element: `${ELEMENTS[s.code].name}\n(${s.code})`,
    score: s.score,
    fullMark: 100,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
        <PolarGrid stroke="var(--color-border)" />
        <PolarAngleAxis
          dataKey="element"
          tick={{ fontSize: 12, fill: 'var(--color-foreground)' }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }}
        />
        <Radar
          name="スコア"
          dataKey="score"
          stroke="var(--color-primary)"
          fill="var(--color-primary)"
          fillOpacity={0.25}
          strokeWidth={2}
        />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}
