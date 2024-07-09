import { PropsWithChildren } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import '../global.css';
import type { Params } from './locale';

import { locales } from '@/i18n';
import { Footer, Header } from '@/ui';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// TODO: Define project metadata
export async function generateMetadata({ params: { locale } }: Params) {
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: PropsWithChildren<Params>) {
  unstable_setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />

        <Analytics />
      </body>
    </html>
  );
}
