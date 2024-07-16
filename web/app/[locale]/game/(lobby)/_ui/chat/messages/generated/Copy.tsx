import { Keypair } from '@solana/web3.js';
import { IconClipboardCopy } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export function Copy(_: {
  keypair: Keypair;
  onChange: (confirmed: boolean) => void;
}) {
  const t = useTranslations('Components.Generate.copy');

  const copyToClipboard = () => {
    // TODO: FIX => not working on android mobile devices.
    const serializedKey = JSON.stringify(Array.from(_.keypair.secretKey));
    navigator.clipboard.writeText(serializedKey);
    _.onChange(true);
  };

  return (
    <>
      <h1 className="text-center mb-4">{t('title')}</h1>
      <button
        className="btn btn-accent btn-lg btn-block"
        onClick={copyToClipboard}
      >
        <IconClipboardCopy />
        <span className="">{t('button')}</span>
      </button>
    </>
  );
}
