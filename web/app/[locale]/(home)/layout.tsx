import { PropsWithChildren } from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';

import type { Params } from '../locale.d';

import { Footer, Header } from './_ui';

export default function Layout({
  children,
  params: { locale },
}: PropsWithChildren<Params>) {
  unstable_setRequestLocale(locale);

  return (
    <>
      <Header locale={locale} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
