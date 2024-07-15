import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { BagKeyForm, MessageProps } from '@/ui';
import { useLuckyBags } from '@/providers';

const next = 'gifts';

export const Secure: MessageProps['Actions'] = ({ message, onNext }) => {
  const t = useTranslations('Components.Secure');
  const { updateBagsKey } = useLuckyBags();

  const [open, setOpen] = useState(false);

  const setPassword = async (key?: string, ttl?: number) => {
    if (!key) {
      const confirmed = confirm(t('unsafe.confirm'));
      if (!confirmed) return false;
    } else {
      // TODO: Verify Crypto state, if it's 'safe' then prev Key is required.
      // On this particular message the key will probably be always empty.
      updateBagsKey(key, undefined, ttl);
    }

    onNext?.(next);
    return true;
  };

  return (
    <>
      <div className="bg-base-200 my-4 p-4 gap-2.5 rounded-box flex flex-col">
        <h1 className="text-center">{t('title')}</h1>
        <p className="label-text-alt text-center">{t('description')}</p>
        <button
          onClick={() => setOpen(true)}
          className="btn btn-primary btn-block"
        >
          {t('button.safe')}
        </button>
        <button
          className="btn btn-ghost btn-block btn-xs text-error"
          onClick={() => setPassword()}
        >
          {t('button.unsafe')}
        </button>
      </div>
      <dialog
        className={`modal modal-bottom sm:modal-middle ${
          open ? 'modal-open' : ''
        }`}
      >
        <div className="modal-box glass">
          <BagKeyForm onConfirm={setPassword} />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setOpen(false)}>Close</button>
        </form>
      </dialog>
    </>
  );
};
