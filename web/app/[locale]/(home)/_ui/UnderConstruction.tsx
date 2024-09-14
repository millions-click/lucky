import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { unstable_setRequestLocale } from 'next-intl/server';

import { IconArrowLeft } from '@tabler/icons-react';

import type { Params } from '@/app/[locale]/locale';

export function UnderConstruction({ params: { locale } }: Params) {
  unstable_setRequestLocale(locale);
  const t = useTranslations('UnderConstruction');

  const bg = "bg-[url('/assets/images/bg/under_construction.png')]";
  const className = [
    'hero min-h-screen w-full mx-auto',
    bg,
    'bg-cover bg-left bg-no-repeat',
  ].join(' ');

  return (
    <div className="w-full min-h-screen overflow-hidden relative">
      <div className={className}>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md p-8 bg-base-100/60 rounded-box text-white">
            <h1 className="text-4xl sm:text-7xl">{t('title')}</h1>
            <p className="mt-4">{t('description')}</p>

            <div className="mt-8 flex sm:justify-end">
              <Link href="/" className="btn btn-primary">
                <IconArrowLeft />
                {t('back')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
