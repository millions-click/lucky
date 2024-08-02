import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

import { type RedeemProps, Redeem, Active } from './_ui';

import { getLuckyPass } from '@/actions';
import { LuckyPassProvider } from '@/providers';

type PageProps = {
  searchParams: RedeemProps;
  params: { locale: string };
};

export default async function Page({
  searchParams: { pass, to = '/en/game' },
  params: { locale },
}: PageProps) {
  unstable_setRequestLocale(locale);
  const session = await getLuckyPass();
  const messages = await getMessages();

  return session ? (
    <LuckyPassProvider session={session}>
      <NextIntlClientProvider messages={messages}>
        <Active pass={pass} to={to} />
      </NextIntlClientProvider>
    </LuckyPassProvider>
  ) : (
    <NextIntlClientProvider messages={messages}>
      <Redeem pass={pass} to={to} />
    </NextIntlClientProvider>
  );
}
