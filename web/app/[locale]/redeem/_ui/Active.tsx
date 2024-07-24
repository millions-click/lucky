'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { type RedeemProps, Redeem } from './Redeem';
import { useLuckyPass } from '@/providers';
import { CountdownBag } from '@/ui';

export function Active({ pass, to }: RedeemProps) {
  const { countdown } = useLuckyPass();
  const t = useTranslations('Redeem.Active');
  const type = pass ? 'available' : 'clear';
  const [state, setState] = useState<'idle' | 'redeem'>('idle');

  return state === 'idle' ? (
    <div className="max-w-md p-2 sm:p-8 space-y-8">
      <h1 className="text-5xl text-info font-bold">{t('title')}</h1>

      <div className="flex items-center justify-center">
        <CountdownBag countdown={countdown} size="lg" />
      </div>
      <p className="py-6 text-warning">{t(`description.${type}`)}</p>

      <div className="flex justify-around">
        <button className="btn btn-ghost" onClick={() => setState('redeem')}>
          {t('action.confirm')}
        </button>

        <Link href={to} className="btn btn-primary">
          {t('action.cancel')}
        </Link>
      </div>
    </div>
  ) : (
    <Redeem pass={pass} to={to} />
  );
}
