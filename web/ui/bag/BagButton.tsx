'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { IconWallet } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { BagDialog } from './BagDialog';

import { ellipsify } from '@/utils';
import { usePlayer } from '@/hooks';
import { BalanceSol } from '@/components/account/account-ui';

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
