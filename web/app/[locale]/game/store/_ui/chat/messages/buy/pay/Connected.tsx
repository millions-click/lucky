'use client';

import { useMemo, useState } from 'react';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { useTranslations } from 'next-intl';
import { IconCash } from '@tabler/icons-react';

import type { Package } from '../contants';

import type { Token } from '@utils/token';
import { usePlayer, useStoreSell } from '@/hooks';

import { toBN } from '@luckyland/anchor';
import { InsufficientBalance } from './InsufficientBalance';

const className = {
  idle: 'btn-accent',
  paying: 'btn-info',
  error: 'btn-error',
  completed: 'btn-success',
};

type PayProps = {
  pkg: Package;
  token: Token;
  confirmed: boolean;
  onChange: (confirmed: boolean) => void;
};

export function Connected({ pkg, token, confirmed, onChange }: PayProps) {
  const t = useTranslations('Components.Buy.Pay');
  const { owner, balance } = usePlayer();
  const { store, sell, price } = useStoreSell({ trader: token });
  const [state, setState] = useState<'idle' | 'paying' | 'error' | 'completed'>(
    confirmed ? 'completed' : 'idle'
  );

  const cost = useMemo(() => price(pkg.amount), [pkg.amount, price]);
  const enoughFunds = balance.data && cost && balance.data > cost;

  async function pay() {
    if (!store || !owner || confirmed) return;
    setState('paying');

    try {
      // TODO: Modify the store to initialize the token account if it doesn't exist.
      const receiver = await getAssociatedTokenAddress(token.mint, owner);
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
    <div className="flex flex-col items-center p-4">
      <div className="text-2xl text-amber-100 sm:text-3xl font-bold max-sm:mt-3">
        {t(`${enoughFunds ? '' : 'Insufficient.'}title`)}
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

      {store ? (
        !enoughFunds ? (
          <InsufficientBalance
            pkg={pkg}
            token={token}
            cost={cost}
            balance={balance.data}
            recipient={owner}
          />
        ) : (
          <button
            className={`btn btn-block ${
              store ? className[state] : 'btn-ghost'
            }`}
            onClick={pay}
          >
            <IconCash />
            {t(`action.${state}`)}
          </button>
        )
      ) : (
        <span className="loading loading-ring loading-lg" />
      )}
    </div>
  );
}
