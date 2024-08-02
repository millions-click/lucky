'use client';

import { PropsWithChildren, useState } from 'react';
import { IconMailFast, IconSend } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

type EmailState = 'idle' | 'sending' | 'sent' | 'failed';
type EmailCodeProps = PropsWithChildren<{
  url: string;
  className?: string;
  onClick?: () => void;
}>;

const CLASSNAME = {
  idle: 'btn-primary',
  sending: 'btn-secondary',
  sent: 'btn-success',
  failed: 'btn-error',
};

export function EmailCode({
  url,
  className,
  children,
  onClick,
}: EmailCodeProps) {
  const t = useTranslations('Components.Later.Email');
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<EmailState>('idle');

  function sendEmail(formData: FormData) {
    if (state !== 'idle' && state !== 'failed') return;

    // TODO: Actually send the email.
    setState('sending');
    console.log('Sending email...', url);
    setTimeout(() => {
      setState('sent');
      setTimeout(() => onClick?.(), 1000);
    }, 3000);
  }

  return (
    <>
      <div className={className} onClick={() => setOpen(true)}>
        <IconSend />
        {children}
      </div>
      {open && (
        <dialog className="modal modal-open modal-bottom sm:modal-middle">
          <div className="modal-box glass">
            <form className="flex flex-col justify-center" action={sendEmail}>
              <h1 className="text-center text-3xl">{t('title')}</h1>
              <p className="text-center text-lg">{t('description')}</p>
              <div className="divider" />

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">{t('input.email.label')}</span>
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder={t('input.email.placeholder')}
                  className="input input-bordered input-primary"
                />
              </label>

              <div className="modal-action">
                <button className={`btn btn-block ${CLASSNAME[state]}`}>
                  {t(`action.${state}`)}
                  <IconMailFast />
                </button>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setOpen(false)}>close</button>
          </form>
        </dialog>
      )}
    </>
  );
}
