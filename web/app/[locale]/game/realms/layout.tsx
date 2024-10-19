import type { PropsWithChildren } from 'react';
import { RealmsProvider } from '@/providers';

export default function Layout({ children }: PropsWithChildren) {
  return <RealmsProvider>{children}</RealmsProvider>;
}
