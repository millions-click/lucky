import { PropsWithChildren } from 'react';
import type { Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import '../global.css';
import type { Params } from './locale.d';

import { locales } from '@/i18n';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

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
        <main>{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
