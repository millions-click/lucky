'use client';

import { useEffect, useState } from 'react';
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { encodeURL } from '@solana/pay';
import BigNumber from 'bignumber.js';

import { useTranslations } from 'next-intl';
import { IconQrcode } from '@tabler/icons-react';

import { Package } from '../contants';
import type { Token } from '@utils/token';
import { QRCode } from '@/ui';
import { fromBigInt } from '@luckyland/anchor';

const TX_COST = 0.00002 * LAMPORTS_PER_SOL;

type InsufficientBalanceProps = {
  cost: bigint | null;
  balance?: number;
  recipient: PublicKey;
  pkg: Package;
  token: Token;
};
export function InsufficientBalance({
  cost,
  balance,
  recipient,
  pkg,
  token,
}: InsufficientBalanceProps) {
  const t = useTranslations('Components.Buy.Pay.Insufficient');
  const [qr, setQR] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<URL | null>(null);

  useEffect(() => {
    setPaymentUrl(null);

    const debounced = setTimeout(() => {
      const reference = new Keypair().publicKey;
      const label = t('store');
      const message = t('top-up', {
        package: pkg.description,
        amount: pkg.amount,
        token: token.symbol,
      });
      const memo = `${token.symbol}|${pkg.title}|${pkg.amount}`;

      const tx_costs = BigInt(Math.round(TX_COST * pkg.amount * 1.25));
      const amount = cost ? cost + tx_costs : tx_costs;

      const url = encodeURL({
        recipient,
        amount: new BigNumber(
          fromBigInt(balance ? amount - BigInt(balance) : amount, 9)
        ),
        reference,
        label,
        message,
        memo,
      });

      setPaymentUrl(url);
    }, 1000);

    return () => clearTimeout(debounced);
  }, [cost, balance]);

  return (
    <>
      <div>
        <p className="text-info text-sm">
          {t.rich('description', {
            // @ts-expect-error type mismatch
            token: <span className="text-primary">SOL</span>,
          })}
        </p>
        <button
          className="btn btn-block btn-info mt-4"
          onClick={() => setQR(true)}
        >
          <IconQrcode />
          {t('action.top-up')}
        </button>
      </div>
      {qr && (
        <dialog className="modal modal-open max-sm:modal-bottom">
          <div className="modal-box bg-success flex items-center justify-center">
            <form method="dialog">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => setQR(false)}
              >
                ✕
              </button>
            </form>
            <QRCode
              title={t('action.title')}
              action={t('action.transfer')}
              url={paymentUrl}
            />
          </div>
        </dialog>
      )}
    </>
  );
}
