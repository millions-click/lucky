import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';

import type { Params } from '@/app/[locale]/locale';

export default function Coins({ params: { locale } }: Params) {
  unstable_setRequestLocale(locale);
  const t = useTranslations('Coins');

  return <h1 className="text-white text-4xl">{t('title')}</h1>;
}
