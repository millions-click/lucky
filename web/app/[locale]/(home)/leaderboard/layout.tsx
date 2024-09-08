import type { PropsWithChildren } from 'react';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

import type { Params } from '../../locale';

export default async function Layout({
  params: { locale },
  children,
}: PropsWithChildren<Params>) {
  unstable_setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
