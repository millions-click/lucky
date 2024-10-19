'use client';

import { useTranslations } from 'next-intl';

export default function Lobby() {
  const t = useTranslations('Lobby');

  return (
    <>
      <h1 className="text-white text-4xl">Lobby</h1>
      <p>{t('title')}</p>
      <a href="game/realms">{t('links.realms')}</a>
    </>
  );
}
