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

export function BagButton({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const t = useTranslations('Components.Bag.Connect');
  const { publicKey, disconnect } = useWallet();

  return publicKey ? (
    <button className={`btn group ${className}`} onClick={disconnect}>
      <IconWallet />
      <span className="group-hover:hidden">
        {ellipsify(publicKey.toString())}
      </span>
      <span className="hidden group-hover:block">{t('action.disconnect')}</span>
    </button>
  ) : (
    <WalletModalProvider>
      <BagDialog>{children}</BagDialog>
    </WalletModalProvider>
  );
}
