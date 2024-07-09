import { PropsWithChildren } from 'react';
import { unstable_setRequestLocale } from 'next-intl/server';

import type { Params } from '../locale';

export default function Layout({
  children,
  params: { locale },
}: PropsWithChildren<Params>) {
  unstable_setRequestLocale(locale);

  return (
    <>
      <main>{children}</main>
    </>
  );
}
