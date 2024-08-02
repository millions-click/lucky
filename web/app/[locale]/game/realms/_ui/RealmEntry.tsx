'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { useLuckyPass, usePlayer, useRealms } from '@/providers';
import { IconTicket } from '@tabler/icons-react';

type RealmEntryProps = {
  params?: string;
};
export const RealmEntry = ({ params }: RealmEntryProps) => {
  const t = useTranslations('');
  const { player } = usePlayer();
  const { state, activate: activatePass } = useLuckyPass();
  const { next } = useRealms();
  const router = useRouter();

  const [action, setAction] = useState<'activating' | 'transporting' | 'idle'>(
    'idle'
  );

  if (!player) return null; // this should never happen.

  const activateAndRedirect = async () => {
    if (action !== 'idle') return;
    if (state !== 'active') {
      setAction('activating');
      await activatePass(player.toString());
    }

    const href = `realms/${next.name}${params ? `?${params}` : ''}`;
    router.prefetch(href);

    setTimeout(
      () => {
        setAction('transporting');
        setTimeout(() => router.push(href), 3000);
      },
      state !== 'active' ? 2000 : 0
    );
  };

  return state === 'expired' ? (
    <div className="flex flex-col justify-center items-center sm:gap-8 sm:m-4">
      <h1 className="text-center text-lg sm:text-3xl">
        {t(`Components.RealmEntry.expired.title`)}
      </h1>
      <p className="text-center text-sm sm:text-base">
        {t(`Components.RealmEntry.expired.description`)}
      </p>
      <div className="divider" />
      <Link
        href="store?from=realms&action=new_pass"
        className="btn btn-info btn-block"
      >
        <IconTicket />
        {t('Components.RealmEntry.action.buy')}
      </Link>
    </div>
  ) : (
    <div className="flex flex-col justify-center items-center sm:gap-8 sm:m-4">
      {action === 'idle' ? (
        <>
          <h1 className="text-center text-lg sm:text-3xl">
            {t(`Realms.name.${next.id}`)}
          </h1>
          <div className="divider" />
        </>
      ) : (
        <p className="text-center text-sm sm:text-base">
          {t(`Components.RealmEntry.action.${action}`)}
        </p>
      )}
      <button
        className="btn btn-primary btn-block"
        disabled={action !== 'idle'}
        onClick={activateAndRedirect}
      >
        {action !== 'idle' ? (
          <span className="loading loading-infinity loading-lg"></span>
        ) : (
          t('Components.Common.action.enter')
        )}
      </button>
    </div>
  );
};
