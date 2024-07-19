'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { useTranslations } from 'next-intl';
import { IconCash } from '@tabler/icons-react';

import type { Package } from './contants';
import type { Token } from '@utils/token';
import { BagButton } from '@/ui/bag';
import { useStoreSell } from '@/hooks';

import { toBN } from '@luckyland/anchor';

const className = {
  idle: 'btn-accent',
  paying: 'btn-info',
  error: 'btn-error',
  completed: 'btn-success',
};

export function Pay({
  pkg,
  token,
  confirmed,
  onChange,
}: {
  pkg: Package;
  token: Token;
  confirmed: boolean;
  onChange: (confirmed: boolean) => void;
}) {
  const { store, sell } = useStoreSell({ trader: token.mint });
  const t = useTranslations('Components.Buy.Pay');
  const { publicKey } = useWallet();
  const [state, setState] = useState<'idle' | 'paying' | 'error' | 'completed'>(
    confirmed ? 'completed' : 'idle'
  );

  async function pay() {
    if (!store || !publicKey || confirmed) return;
    setState('paying');

    try {
      // TODO: Modify the store to initialize the token account if it doesn't exist.
      const receiver = await getAssociatedTokenAddress(token.mint, publicKey);
      const amount = toBN(pkg.amount, token.decimals);
      await sell.mutateAsync({ amount, receiver });

      setState('completed');
      onChange(true);
    } catch (error) {
      // TODO: Properly manage these errors. [Not Enough Balance, Transaction Failed, etc.]
      setState('error');
      onChange(false);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      {publicKey && (
        <div className="flex flex-col items-center p-4">
          <div className="text-2xl text-amber-100 sm:text-3xl font-bold">
            {t('title')}
          </div>

          <div className="card animate-glow image-full my-8 sm:my-16 card-compact">
            <figure>
              {/* TODO: Load image from token metadata */}
              <img src="/token/trader.svg" alt={token.name} />
            </figure>
            <div className="card-body items-center justify-center">
              <div className="card-title text-primary text-3xl sm:text-4xl capitalize">
                {pkg.description}
              </div>
              <div className="space-x-2">
                <span className="badge badge-outline badge-lg badge-info">
                  {pkg.title}
                </span>
                <span className="badge badge-outline badge-lg badge-info">
                  {pkg.amount} ${token.symbol}
                </span>
              </div>
            </div>
          </div>

          <button
            className={`btn btn-block ${
              store ? className[state] : 'btn-ghost'
            }`}
            onClick={pay}
          >
            {store ? (
              <>
                <IconCash />
                {t(`action.${state}`)}
              </>
            ) : (
              <span className="loading loading-ring loading-lg" />
            )}
          </button>
        </div>
      )}

      <BagButton
        className={publicKey ? 'absolute top-2 right-2 btn-sm btn-ghost' : ''}
      >
        <p className="label-text-alt text-center">{t('disconnected')}</p>
      </BagButton>
    </div>
  );
}
