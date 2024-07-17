'use client';

import { useTranslations } from 'next-intl';

export default function Store() {
  const t = useTranslations('Store');

  return (
    <>
      <h1 className="text-white text-4xl">{t('title')}</h1>
      <p>{t('description')}</p>
    </>
  );
}
