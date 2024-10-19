import { useTranslations } from 'next-intl';
import Link from 'next/link';

import type { MessageProps } from '@/ui/messages';
import { IconLink } from '@tabler/icons-react';

function ShortCut({ label, href }: { label: string; href: string }) {
  return (
    <li className="card max-sm:card-compact glass group w-24 sm:w-36 group">
      <Link
        href={href}
        className="card-body items-center justify-center cursor-pointer relative text-primary group-hover:text-info"
      >
        <span className="text-center text-sm">{label}</span>
        <IconLink className="absolute bottom-1 right-1" size={16} />
      </Link>
    </li>
  );
}

export const Shortcuts: MessageProps['Actions'] = () => {
  const t = useTranslations('Components.Shortcuts');

  return (
    <div className="bg-base-200 my-4 p-4 gap-2.5 rounded-box flex flex-col items-center relative">
      <h1 className="text-center">{t(`title`)}</h1>
      <p className="label-text-alt text-center">{t('description')}</p>

      <ul className="flex flex-wrap justify-around gap-4 sm:p-4 max-w-sm">
        <ShortCut label={t('action.realms')} href="/game/realms" />
        <ShortCut label={t('action.store')} href="/game/store" />
        <ShortCut label={t('action.lobby')} href="/game" />
      </ul>
    </div>
  );
};
