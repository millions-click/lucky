'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { IconCash } from '@tabler/icons-react';
import Image from 'next/image';

import type { Package } from '../contants';
import { InsufficientBalance } from './InsufficientBalance';

import type { Token } from '@utils/token';
import { usePlayer, useStoreSell } from '@/providers';

import { toBN } from '@luckyland/anchor';
import { PublicKey } from '@solana/web3.js';

const className = {
  idle: 'btn-accent',
  paying: 'btn-info',
  error: 'btn-error',
  completed: 'btn-ghost btn-sm',
};

type PayProps = {
  pkg: Package;
  token: Token;
  confirmed: boolean;
  onChange: (confirmed: boolean) => void;
};

export function Connected({ pkg, token, confirmed, onChange }: PayProps) {
  const t = useTranslations('Components.Buy.Pay');
  const { player, balance, roundFee, getAccount, createTokenAccount, refresh } =
    usePlayer();
  const { store, sell, getPrice } = useStoreSell();
  const [state, setState] = useState<'idle' | 'paying' | 'error' | 'completed'>(
    confirmed ? 'completed' : 'idle'
  );

  const cost = useMemo(() => {
    const price = getPrice(pkg.amount) as bigint;
    if (!price) return null;

    const fee = roundFee * BigInt(Math.round(pkg.amount * 1.25));
    return price + fee;
  }, [pkg.amount, getPrice]);
  const enoughFunds = balance && cost && balance > cost;

  useEffect(() => {
    if (enoughFunds) return;
    const debounced = setTimeout(() => refresh(true), 500);
    return () => clearTimeout(debounced);
  }, [cost]);

  if (!player) return null;

  async function handleCreateTokenAccount(): Promise<PublicKey> {
    const { address } = await createTokenAccount(token.mint);

    // TODO: Properly manage this delay. Make sure the account is created before returning.
    return new Promise((resolve) => setTimeout(() => resolve(address), 3000));
  }

  async function pay() {
    if (confirmed) {
      setState('idle');
      return onChange(false);
    }
    if (!store || !player) return;
    setState('paying');

    try {
      const tokenAccount = getAccount(token.mint);
      let receiver = tokenAccount?.publicKey;
      if (!receiver) receiver = await handleCreateTokenAccount();

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
        {t(
          `${
            state === 'completed'
              ? 'success.'
              : enoughFunds
              ? ''
              : 'Insufficient.'
          }title`
        )}
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
          {pkg.discount > 0 && (
            <div className="absolute -top-2 -right-4 flex flex-col rotate-12">
              <span className="badge bg-red-500 text-white badge-lg">
                -{pkg.discount}%
              </span>
            </div>
          )}
        </div>
      </div>

      {store ? (
        !enoughFunds && state !== 'completed' ? (
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
            {state === 'completed' && (
              <span className="label-text-alt text-info sm:px-16 mb-4">
                {t('success.message', {
                  token: token.name,
                  balance: getAccount(token.mint)?.amount || 0,
                  symbol: token.symbol,
                })}
              </span>
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
