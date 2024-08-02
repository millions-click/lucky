'use client';

import { useRouter } from 'next/navigation';
import { redeemLuckyPass } from '@/actions';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { IconLock, IconLockOpen } from '@tabler/icons-react';

type RedeemState = 'idle' | 'loading' | 'success' | 'error';
const CLASSES: Record<RedeemState, { button: string }> = {
  idle: { button: 'btn-primary' },
  loading: { button: 'btn-info' },
  success: { button: 'btn-success' },
  error: { button: 'btn-error' },
};

export type RedeemProps = {
  to: string;
  pass?: string;
};
export function Redeem({ pass, to }: RedeemProps) {
  const t = useTranslations('Redeem');
  const router = useRouter();
  const type = pass ? 'available' : 'clear';
  const [state, setState] = useState<RedeemState>('idle');

  return (
    <div className="max-w-md p-2 sm:p-8">
      <h1 className="text-5xl font-bold">{t('title')}</h1>
      <p className="py-6 text-info">{t(`type.${type}`)}</p>
      <form
        className="flex flex-col gap-4"
        action={async (formData) => {
          const pass = formData.get('code')?.toString();
          if (!pass || state === 'loading' || state === 'success') return;
          setState('loading');

          try {
            await redeemLuckyPass(pass);
            setState('success');
            router.push(to);
          } catch (_error) {
            setState('error');
          }
        }}
      >
        <input
          name="code"
          defaultValue={pass}
          readOnly={type === 'available'}
          type={type === 'available' ? 'hidden' : 'text'}
          className="textarea textarea-primary"
          placeholder="Enter your Lucky Pass code"
        />
        <button className={`btn ${CLASSES[state].button}`} type="submit">
          {state !== 'error' ? <IconLockOpen /> : <IconLock />}
          {t(`action.${state}`)}
        </button>
      </form>
    </div>
  );
}
