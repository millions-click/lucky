import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  IconLock,
  IconLockOpen,
  IconLockX,
  IconShoppingBagEdit,
} from '@tabler/icons-react';

import type { MessageProps } from '@/ui/messages';
import { useLuckyBags, useLuckyWallet } from '@/providers';
import { BagKeyForm } from '@/ui';

const next = 'gifts';

type BagStatus = 'locked' | 'unlocked' | 'error';
export const Locked: MessageProps['Actions'] = ({ onNext }) => {
  const t = useTranslations('Components');
  const { name, state, setBagKey, closeBag } = useLuckyBags();
  const { activate } = useLuckyWallet();

  const [status, setStatus] = useState(state as BagStatus);
  const [open, setOpen] = useState(false);

  const setPassword = async (key: string, ttl: number, _name: string) => {
    const valid = setBagKey(key, ttl);
    if (valid) activate();

    setStatus(valid ? 'unlocked' : 'error');
    setOpen(false);
    return valid;
  };

  return (
    <>
      <div className="bg-base-200 my-4 p-4 gap-2.5 rounded-box flex flex-col">
        <h1 className="text-center">
          {t(`Locked.title.${status === 'error' ? 'locked' : status}`)}
        </h1>
        <p className="label-text-alt text-center">{t('Locked.description')}</p>

        {status === 'locked' && (
          <button
            onClick={() => setOpen(true)}
            className="btn btn-primary btn-block btn-info"
          >
            <IconLock />
            {t('Common.action.unlock')}
          </button>
        )}

        {status === 'unlocked' && (
          <button
            onClick={() => onNext?.(next)}
            className="btn btn-primary btn-block btn-success"
          >
            <IconLockOpen />
            {t('Common.action.enter')}
          </button>
        )}

        {status === 'error' && (
          <>
            <button
              onClick={() => setOpen(true)}
              className="btn btn-primary btn-block btn-error"
            >
              <IconLockX />
              {t('Common.alert.password.invalid')}
            </button>

            <button
              className="btn btn-ghost btn-block btn-sm btn-info"
              onClick={() => {
                closeBag(true);
                onNext?.('activate');
              }}
            >
              <IconShoppingBagEdit />
              {t('Locked.error.change')}
            </button>
          </>
        )}
      </div>
      <dialog
        className={`modal modal-bottom sm:modal-middle ${
          open ? 'modal-open' : ''
        }`}
      >
        <div className="modal-box glass">
          <BagKeyForm name={name} onConfirm={setPassword} unlock={true} />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setOpen(false)}>Close</button>
        </form>
      </dialog>
    </>
  );
};
