import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useTranslations } from 'next-intl';

import { BagButton } from '@/ui/bag';

export function Connect({
  onChange,
}: {
  onChange: (confirmed: boolean) => void;
}) {
  const t = useTranslations('Components.Bag.Connect');
  const { publicKey } = useWallet();

  useEffect(() => {
    if (!publicKey) return;
    const debounced = setTimeout(() => onChange(true), 1000);
    return () => clearTimeout(debounced);
  }, [publicKey]);

  return (
    <div className="flex flex-col items-center justify-center">
      {publicKey && (
        <>
          <h1 className="modal-title text-center">{t('title')}</h1>
          <div className="divider" />
        </>
      )}
      <BagButton className="btn-success hover:btn-error btn-wide self-center">
        <p className="label-text-alt text-center">{t('description')}</p>
        <p className="label-text text-center text-info mt-4">{t('advice')}</p>
      </BagButton>
    </div>
  );
}
