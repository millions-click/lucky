import { useState } from 'react';

import { Options, actions } from './actions';

import type { MessageProps } from '@/ui';
import { useTranslations } from 'next-intl';
import { useCrypto, useLuckyBags } from '@/providers';

const next = 'gifts';

type ActionKey = keyof typeof actions;
export const Generated: MessageProps['Actions'] = ({ onNext, ...props }) => {
  const t = useTranslations('Components.Common.action');
  const { state } = useCrypto();
  const { bag } = useLuckyBags();

  const [active, setActive] = useState<ActionKey>();
  const [confirmed, setConfirmed] = useState(false);
  if (!bag) throw new Error('bag is not defined');

  const Action = active && actions[active];

  return (
    <>
      <Options {...props} onNext={(action) => setActive(action as ActionKey)} />
      {Action && (
        <dialog className="modal modal-bottom sm:modal-middle modal-open">
          <div className="modal-box">
            <Action keypair={bag.kp} onChange={setConfirmed} />
            {confirmed && (
              <div className="modal-action">
                <button
                  className="btn btn-lg btn-ghost text-orange-500 "
                  onClick={(target) =>
                    onNext?.(state === 'unsafe' ? 'secure' : next)
                  }
                >
                  {t(state === 'unsafe' ? 'secure' : 'next')}
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
