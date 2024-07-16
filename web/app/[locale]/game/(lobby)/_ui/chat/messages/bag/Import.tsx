import { useState } from 'react';
import { Keypair } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';

import { useTranslations } from 'next-intl';
import { IconPackageImport } from '@tabler/icons-react';

import { LuckyWalletAdapter } from '@/adapters';
import { useLuckyBags } from '@/providers';

function decode(privateKeyString: string): Uint8Array | null {
  try {
    const decoded = bs58.decode(privateKeyString);

    if (decoded.length !== 64) return null;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function Import({
  onChange,
}: {
  onChange: (confirmed: boolean) => void;
}) {
  const t = useTranslations('Components.Bag.Import');

  const { wallet, wallets, select } = useWallet();
  const { addBag } = useLuckyBags();
  const [pk, setPk] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [keyPair, setKeyPair] = useState<Keypair | null>(null);

  const setKeyPairFromPk = () => {
    if (pk.length === 0) {
      setKeyPair(null);
      return setStatus('idle');
    }

    try {
      const decoded = decode(pk);
      const keyPair = Keypair.fromSecretKey(
        decoded || Uint8Array.from(JSON.parse(pk))
      );
      setKeyPair(keyPair);
      setStatus('valid');
    } catch {
      setKeyPair(null);
      setStatus('invalid');
    }
  };

  const importKeyPair = () => {
    if (!keyPair) return;
    addBag({ kp: keyPair, name });

    if (!wallet || !(wallet.adapter instanceof LuckyWalletAdapter)) {
      setTimeout(() => {
        const luckyWallet = wallets.find(
          ({ adapter }) => adapter instanceof LuckyWalletAdapter
        );
        if (luckyWallet) select(luckyWallet.adapter.name);
        onChange(true);
      }, 500);
    } else onChange(true);
  };

  return (
    <>
      <h1 className="text-center mb-4">{t('title')}</h1>
      <p className="text-center label-text-alt">{t('description')}</p>

      <div className="mt-8 flex flex-col gap-4">
        <label className="form-control">
          <div className="label">
            <span className="label-text">{t('input.pk.label')}</span>
            {status === 'valid' && (
              <span className="badge badge-success">{t('input.pk.valid')}</span>
            )}
            {status === 'invalid' && (
              <span className="badge badge-error">{t('input.pk.invalid')}</span>
            )}
          </div>
          <textarea
            value={pk}
            onChange={(e) => setPk(e.target.value)}
            onBlur={setKeyPairFromPk}
            className="textarea textarea-bordered min-h-12"
            placeholder={t('input.pk.placeholder')}
          />
        </label>

        {keyPair && (
          <>
            <span className="badge badge-info badge-xs py-2 px-4 sm:badge-lg">
              {keyPair.publicKey.toString()}
            </span>
            <label className="form-control">
              <div className="label">
                <span className="label-text">{t('input.name.label')}</span>
              </div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered"
                placeholder={t('input.name.placeholder')}
              />
            </label>
          </>
        )}

        <button
          className="btn btn-primary btn-block"
          disabled={status !== 'valid'}
          onClick={importKeyPair}
        >
          <IconPackageImport />
          {t('action.import')}
        </button>
      </div>
    </>
  );
}
