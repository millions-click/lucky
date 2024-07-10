import { Background } from '@/providers';
import { useTranslations } from 'next-intl';

const bg = 'lobby.jpeg';

export default function Lobby() {
  const t = useTranslations('Lobby');

  return (
    <div className="max-w-md bg-base-300/20 p-8">
      <Background name={bg} />
      <h1 className="text-white text-4xl">Lobby</h1>
      <p>{t('title')}</p>
      <a href="game/realms">{t('links.realms')}</a>
    </div>
  );
}
