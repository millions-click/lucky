import { useEffect, useMemo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useTranslations } from 'next-intl';

import { LuckyWalletAdapter } from '@/adapters';
import { IconSquareRoundedCheckFilled } from '@tabler/icons-react';

export function Generate({
  onChange,
}: {
  onChange: (confirmed: boolean) => void;
}) {
  const t = useTranslations('Components.Bag.Generate');
  const { wallet, wallets, select } = useWallet();
  const loading = useMemo(() => !Boolean(wallet), [wallet]);
  const [confirmed, setConfirmed] = useState(!loading);

  useEffect(() => {
    if (!loading) return onChange(true);

    const debounced = setTimeout(() => {
      if (wallets.length) {
        const luckyWallet = wallets.find(
          ({ adapter }) => adapter instanceof LuckyWalletAdapter
        );

        if (luckyWallet) select(luckyWallet.adapter.name);

        setTimeout(() => {
          const confirmed = Boolean(luckyWallet);
          setConfirmed(confirmed);
        }, 500);
      }
    }, 1000);

    return () => clearTimeout(debounced);
  }, [wallets]);

  return (
    <>
      <h1 className="modal-title text-center text-2xl sm:text-3xl">
        {t(loading ? 'loading' : 'success')}
      </h1>
      {confirmed ? (
        <IconSquareRoundedCheckFilled
          className="w-full text-success mt-8"
          size={128}
        />
      ) : (
        <span
          className={`loading loading-ring w-full ${
            loading ? '' : 'animate-scale-down'
          }`}
        />
      )}
    </>
  );
}
