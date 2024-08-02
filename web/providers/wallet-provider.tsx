'use client';

import { type PropsWithChildren, useCallback, useMemo } from 'react';

import { useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletError } from '@solana/wallet-adapter-base';

import { useLuckyBags } from '.';
import { LuckyWalletAdapter } from '@/adapters';

export function LuckyWalletProvider({ children }: PropsWithChildren) {
  const context = useLuckyBags();
  const wallets = useMemo(() => [new LuckyWalletAdapter(context)], [context]);

  const onError = useCallback(
    (error: WalletError) => console.error('LuckyWalletProvider', error),
    []
  );

  return (
    <WalletProvider wallets={wallets} onError={onError} autoConnect={true}>
      {children}
    </WalletProvider>
  );
}

export function useLuckyWallet() {
  const context = useWallet();

  const activate = useCallback(() => {
    const { wallets, select } = context;
    if (!wallets?.length) return;

    const luckyWallet = wallets.find(
      ({ adapter }) => adapter instanceof LuckyWalletAdapter
    );

    if (luckyWallet) select(luckyWallet.adapter.name);
    return luckyWallet;
  }, [context.wallets]);

  return { ...context, activate };
}
