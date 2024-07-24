import { PropsWithChildren } from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';

import { PortalChatController } from './_ui';

import { Background } from '@/providers';
import type { Params } from '@/app/[locale]/locale';

const bg = 'realms.webp';

export default function Layout({
  children,
  params: { locale },
}: PropsWithChildren<Params>) {
  unstable_setRequestLocale(locale);

  return (
    <>
      <Background name={bg} />
      <div className="max-w-md bg-base-300/20 p-8">{children}</div>
      <PortalChatController />
    </>
  );
}
