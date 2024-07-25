'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useTranslations } from 'next-intl';

import { Connected } from './Connected';
import type { Package } from '../contants';

import type { Token } from '@utils/token';
import { BagButton } from '@/ui/bag';
import { StoreProvider } from '@/providers';

type PayProps = {
  pkg: Package;
  token: Token;
  confirmed: boolean;
  onChange: (confirmed: boolean) => void;
};

export function Pay(props: PayProps) {
  const t = useTranslations('Components.Buy.Pay');
  const { publicKey } = useWallet();

  return (
    <div className="flex flex-col justify-center items-center">
      {publicKey && (
        <StoreProvider>
          <Connected {...props} />
        </StoreProvider>
      )}

      <div
        className={
          publicKey
            ? 'absolute top-2 right-2 flex flex-row-reverse max-sm:left-2 sm:flex-col items-center sm:items-end justify-between'
            : ''
        }
      >
        <BagButton
          className={publicKey ? 'btn-sm btn-ghost' : ''}
          balance="badge badge-outline badge-lg sm:badge-xs mr-3 py-2"
        >
          <p className="label-text-alt text-center">{t('disconnected')}</p>
        </BagButton>
      </div>
    </div>
  );
}
