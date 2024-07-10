import { useTranslations } from 'next-intl';

export default function Realms() {
  const t = useTranslations('Realms');

  return (
    <>
      <h1 className="text-white text-4xl">{t('title')}</h1>
      <a href="coins">{t('links.coins')}</a>
    </>
  );
}
