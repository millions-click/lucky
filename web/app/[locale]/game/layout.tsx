import { PropsWithChildren } from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';

import type { Params } from '../locale';
import { GameLayout } from './_ui';

import { BgProvider, MessagesProvider } from '@/providers';

export default async function Layout({
  children,
  params: { locale },
}: PropsWithChildren<Params>) {
  unstable_setRequestLocale(locale);

  return (
    <BgProvider>
      <GameLayout>
        <MessagesProvider>{children}</MessagesProvider>
      </GameLayout>
    </BgProvider>
  );
}
