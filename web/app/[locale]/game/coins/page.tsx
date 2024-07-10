import { useTranslations } from 'next-intl';

export default function Coins() {
  const t = useTranslations('Coins');

  return <h1 className="text-white text-4xl">{t('title')}</h1>;
}
