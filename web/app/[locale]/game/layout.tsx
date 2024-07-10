import { PropsWithChildren } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';

import type { Params } from '../locale';
import { GameLayout } from './_ui';

import { BgProvider } from '@/providers';

export default async function Layout({
  children,
  params: { locale },
}: PropsWithChildren<Params>) {
  unstable_setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <BgProvider>
      <GameLayout>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </GameLayout>
    </BgProvider>
  );
}
