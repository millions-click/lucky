import {
  useWalletModal,
  WalletModalProvider,
} from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useMemo } from 'react';
import { IconWallet } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

function Dialog({ onChange }: { onChange: (connected: boolean) => void }) {
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
      onChange(true);
    }
  }, [publicKey]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-center">{t('title')}</h1>
      <p className="label-text-alt text-center">{t('description')}</p>
      <p className="label-text text-center text-info mt-4">{t('advice')}</p>
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

      {state === 'connected' && (
        <button
          className="btn btn-wide btn-ghost text-error"
          onClick={() =>
            disconnect()
              .then(() => onChange(false))
              .catch(() => void 0)
          }
        >
          {t('action.disconnect')}
        </button>
      )}
    </div>
  );
}

export function Connect({
  onChange,
}: {
  onChange: (confirmed: boolean) => void;
}) {
  return (
    <WalletModalProvider>
      <Dialog onChange={(connected) => onChange(connected)} />
    </WalletModalProvider>
  );
}
