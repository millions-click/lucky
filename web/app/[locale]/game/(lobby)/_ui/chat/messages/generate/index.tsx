import { useRef, useState } from 'react';
import { Keypair } from '@solana/web3.js';

import { Options, actions } from './actions';

import type { MessageProps } from '@/ui';
import { useTranslations } from 'next-intl';
import { useCrypto, useLuckyBags } from '@/providers';

const next = 'gifts';

type ActionKey = keyof typeof actions;
export const Generate: MessageProps['Actions'] = ({ onNext, ...props }) => {
  const t = useTranslations('Components.Generate');
  const keypair = useRef(Keypair.generate());
  const { state } = useCrypto();
  const { addBag } = useLuckyBags();

  const [active, setActive] = useState<ActionKey>();
  const [confirmed, setConfirmed] = useState(false);
  const Action = active && actions[active];

  const store = (confirmed: boolean) => {
    setConfirmed(confirmed);
    if (!confirmed) return;
    addBag({ kp: keypair.current, name: 'generated' });
  };

  return (
    <>
      <Options {...props} onNext={(action) => setActive(action as ActionKey)} />
      {Action && (
        <dialog className="modal modal-bottom sm:modal-middle modal-open">
          <div className="modal-box">
            <Action keypair={keypair.current} onChange={store} />
            {confirmed && (
              <div className="modal-action">
                <button
                  className="btn btn-lg btn-ghost text-orange-500 "
                  onClick={(target) =>
                    onNext?.(state === 'unsafe' ? 'secure' : next)
                  }
                >
                  {t('activate')}
                </button>
              </div>
            )}
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setActive(undefined)}>Close</button>
          </form>
        </dialog>
      )}
    </>
  );
};
