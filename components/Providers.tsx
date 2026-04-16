'use client';

import type { ReactNode } from 'react';
import { AssessmentProvider } from '@/contexts/AssessmentContext';

export function Providers({ children }: { children: ReactNode }) {
  return <AssessmentProvider>{children}</AssessmentProvider>;
}
