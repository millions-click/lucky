import { PropsWithChildren } from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';

import { Background } from '@/providers';
import type { Params } from '@/app/[locale]/locale';

const bg = 'coins.png';

export default function Layout({
  children,
  params: { locale },
}: PropsWithChildren<Params>) {
  unstable_setRequestLocale(locale);

  return (
    <div className="max-w-md bg-base-300/20 p-8">
      <Background name={bg} />
      {children}
    </div>
  );
}
