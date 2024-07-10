import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';

import type { Params } from '../locale';
import { Session } from './_ui/Session';

export default async function Landing({ params: { locale } }: Params) {
  unstable_setRequestLocale(locale);
  const messages = await getMessages();

  const bg = "bg-[url('/assets/images/bg/landing.jpg')]";
  const className = [
    'hero min-h-screen w-full container mx-auto',
    bg,
    'bg-cover bg-center bg-no-repeat',
  ].join(' ');

  // TODO: Generate a backdrop filter for the image to be used as a background
  return (
    <div className={className}>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md">
          <NextIntlClientProvider messages={messages}>
            <Session />
          </NextIntlClientProvider>
        </div>
      </div>
    </div>
  );
}
