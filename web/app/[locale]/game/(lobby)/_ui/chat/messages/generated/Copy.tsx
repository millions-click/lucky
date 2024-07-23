import { Keypair } from '@solana/web3.js';
import { useTranslations } from 'next-intl';
import bs58 from 'bs58';

import { CopyToClipboard } from '@/ui';

export function Copy(_: {
  keypair: Keypair;
  onChange: (confirmed: boolean) => void;
}) {
  const t = useTranslations('Components.Generate.copy');

  return (
    <>
      <h1 className="text-center mb-4">{t('title')}</h1>
      <CopyToClipboard
        className="btn btn-accent btn-lg btn-block"
        payload={bs58.encode(_.keypair.secretKey)}
        onCopied={() => _.onChange(true)}
      >
        <span>{t('button')}</span>
      </CopyToClipboard>
    </>
  );
}
