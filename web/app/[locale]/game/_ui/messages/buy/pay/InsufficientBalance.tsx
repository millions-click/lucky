'use client';

import { useEffect, useState } from 'react';
import { Keypair, PublicKey } from '@solana/web3.js';
import { encodeURL } from '@solana/pay';
import BigNumber from 'bignumber.js';

import { useTranslations } from 'next-intl';
import { IconQrcode } from '@tabler/icons-react';

import type { Package } from '../contants';
import type { Token } from '@utils/token';
import { CopyToClipboard, QRCode } from '@/ui';

import { fromBigInt } from '@luckyland/anchor';
import { getAvgTxFee, getTokenAccountCreationCost } from '@constants';

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
  const [amount, setAmount] = useState<string>('0');

  useEffect(() => {
    setPaymentUrl(null);

    const debounced = setTimeout(async () => {
      const reference = new Keypair().publicKey;
      const label = t('store');
      const message = t('top-up', {
        package: pkg.description,
        amount: pkg.amount,
        token: token.symbol,
      });
      const memo = `${token.symbol}|${pkg.title}|${pkg.amount}`;

      // If the account balance is 0 there almost certainly isn't a token account neither. Gem & Trader accounts are required.
      const account_cost =
        balance === 0
          ? (await getTokenAccountCreationCost()) * BigInt(2)
          : BigInt(0);

      // Each tx has a small fee to be processed. We are assuming the user will play ~25% more than the package amount.
      const tx_costs = await getAvgTxFee(pkg.amount * 1.25);
      const total = cost
        ? cost + tx_costs + account_cost
        : tx_costs + account_cost;
      const amount = fromBigInt(balance ? total - BigInt(balance) : total, 9);

      const url = encodeURL({
        recipient,
        amount: new BigNumber(amount),
        reference,
        label,
        message,
        memo,
      });

      setAmount(amount.toString());
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
            >
              <div className="flex justify-between gap-2">
                <CopyToClipboard
                  className="btn btn-sm btn-ghost flex-1"
                  payload={recipient.toBase58()}
                >
                  {t('action.copy.address')}
                </CopyToClipboard>
                <CopyToClipboard
                  className="btn btn-sm btn-ghost flex-1"
                  payload={amount}
                >
                  {t('action.copy.amount')}
                </CopyToClipboard>
              </div>
            </QRCode>
          </div>
        </dialog>
      )}
    </>
  );
}
