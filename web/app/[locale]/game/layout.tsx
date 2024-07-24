import { PropsWithChildren } from 'react';
import { notFound } from 'next/navigation';
import { unstable_setRequestLocale } from 'next-intl/server';

import type { Params } from '../locale';
import { GameLayout } from './_ui';

import { BgProvider, MessagesProvider } from '@/providers';
import { LuckyPassProvider } from '@/providers/pass/context';
import { getLuckyPass } from '@/actions';

export default async function Layout({
  children,
  params: { locale },
}: PropsWithChildren<Params>) {
  unstable_setRequestLocale(locale);
  const session = await getLuckyPass();
  if (!session) return notFound();

  return (
    <LuckyPassProvider session={session}>
      <BgProvider>
        <GameLayout>
          <MessagesProvider>{children}</MessagesProvider>
        </GameLayout>
      </BgProvider>
    </LuckyPassProvider>
  );
}
