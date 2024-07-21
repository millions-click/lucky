'use client';

import { useEffect, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  useWalletModal,
  WalletModalProvider,
} from '@solana/wallet-adapter-react-ui';
import { IconWallet } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { ellipsify } from '@/utils';
import { usePlayer } from '@/hooks';
import { BalanceSol } from '@/components/account/account-ui';

export function BagDialog({
  onChange,
  children,
}: {
  onChange?: (connected: boolean) => void;
  children?: React.ReactNode;
}) {
  const t = useTranslations('Components.Bag.Connect');
  const { publicKey, wallet, disconnect } = useWallet();
  const { visible, setVisible } = useWalletModal();
  const state = useMemo(() => {
    if (visible) return 'connecting';
    if (wallet) {
      if (publicKey) return 'connected';
      return 'connecting';
    }
    return 'idle';
  }, [wallet, visible, publicKey]);

  useEffect(() => {
    if (publicKey) {
      setVisible(false);
      onChange?.(true);
    }
  }, [publicKey]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-center">{t('title')}</h1>
      {children}
      <div className="divider" />
      <button
        className={`btn btn-wide ${
          state === 'idle'
            ? 'btn-warning'
            : state === 'connecting'
            ? 'btn-info'
            : 'btn-success'
        }`}
        onClick={() => setVisible(true)}
      >
        {state === 'connecting' ? (
          <span className="loading loading-dots loading-lg" />
        ) : (
          <>
            <IconWallet />
            {t(`action.${state}`)}
          </>
        )}
      </button>
    </div>
  );
}

function ActiveWallet({
  className,
  balanceStyle,
}: {
  className?: string;
  balanceStyle?: string;
}) {
  const t = useTranslations('Components.Bag.Connect');
  const { owner, balance, disconnect } = usePlayer();

  return (
    <>
      <button className={`btn group ${className}`} onClick={disconnect}>
        <IconWallet />
        <span className="group-hover:hidden">
          {ellipsify(owner.toString())}
        </span>
        <span className="hidden group-hover:block">
          {t('action.disconnect')}
        </span>
      </button>
      {balanceStyle && (
        <div className={'flex gap-1 ' + balanceStyle}>
          <BalanceSol balance={balance.data} />
          SOL
        </div>
      )}
    </>
  );
}

export function BagButton({
  className,
  balance,
  children,
}: {
  className?: string;
  balance?: string;
  children?: React.ReactNode;
}) {
  const { publicKey } = useWallet();

  return publicKey ? (
    <ActiveWallet className={className} balanceStyle={balance} />
  ) : (
    <WalletModalProvider>
      <BagDialog>{children}</BagDialog>
    </WalletModalProvider>
  );
}
