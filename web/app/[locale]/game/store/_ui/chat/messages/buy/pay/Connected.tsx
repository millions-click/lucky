'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { IconCash } from '@tabler/icons-react';
import Image from 'next/image';

import type { Package } from '../contants';
import { InsufficientBalance } from './InsufficientBalance';

import type { Token } from '@utils/token';
import { useStoreSell } from '@/hooks';
import { usePlayer } from '@/providers';

import { toBN } from '@luckyland/anchor';

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
  const { player, balance, getAccount, createTokenAccount } = usePlayer();
  const { store, sell, price } = useStoreSell({ trader: token });
  const [state, setState] = useState<'idle' | 'paying' | 'error' | 'completed'>(
    confirmed ? 'completed' : 'idle'
  );

  const cost = useMemo(() => price(pkg.amount), [pkg.amount, price]);
  const enoughFunds = balance && cost && balance > cost;
  if (!player) return null;

  async function pay() {
    if (!store || !player || confirmed) return;
    setState('paying');

    try {
      const tokenAccount = getAccount(token.mint);
      let receiver = tokenAccount?.publicKey;
      if (!receiver) receiver = (await createTokenAccount(token.mint)).address;

      const amount = toBN(pkg.amount, token.decimals);
      await sell.mutateAsync({ amount, receiver, owner: player });

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

      <div className="card animate-glow image-full my-8 sm:my-16 card-compact bg-primary">
        <figure className="relative h-52">
          <Image
            style={{ objectFit: 'contain' }}
            src={token.metadata?.image || '/token/lucky.png'}
            alt={token.name}
            fill
          />
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
            balance={balance}
            recipient={player}
          />
        ) : (
          <>
            {state === 'paying' && (
              <span className="loading loading-dots loading-lg" />
            )}
            <button
              className={`btn btn-block ${
                store ? className[state] : 'btn-ghost'
              }`}
              onClick={pay}
            >
              <IconCash />
              {t(`action.${state}`)}
            </button>
          </>
        )
      ) : (
        <span className="loading loading-ring loading-lg" />
      )}
    </div>
  );
}
