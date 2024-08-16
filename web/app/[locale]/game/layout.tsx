import { PropsWithChildren } from 'react';
import { notFound } from 'next/navigation';
import { unstable_setRequestLocale } from 'next-intl/server';

import type { Params } from '../locale';
import { GameLayout } from './_ui';

import {
  LuckyPassProvider,
  BgProvider,
  MessagesProvider,
  WinnersProvider,
} from '@/providers';
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
          <MessagesProvider>
            <WinnersProvider
              containerStyle={{
                top: 46,
                left: 16,
                bottom: 24,
                right: 16,
              }}
            >
              {children}
            </WinnersProvider>
          </MessagesProvider>
        </GameLayout>
      </BgProvider>
    </LuckyPassProvider>
  );
}
