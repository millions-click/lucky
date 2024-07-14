import { Background } from '@/providers';
import { unstable_setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';

import type { Params } from '@/app/[locale]/locale';
import { ChatController } from './_ui';

const bg = 'lobby.jpeg';

export default function Lobby({ params: { locale } }: Params) {
  unstable_setRequestLocale(locale);
  const t = useTranslations('Lobby');

  return (
    <>
      <div className="max-w-md bg-base-300/20 p-8">
        <Background name={bg} className="" />
        <h1 className="text-white text-4xl">Lobby</h1>
        <p>{t('title')}</p>
        <a href="game/realms">{t('links.realms')}</a>
      </div>

      <ChatController />
    </>
  );
}
