import type { Params } from '../../locale.d';
import { unstable_setRequestLocale } from 'next-intl/server';

export default async function Tokenomics({ params: { locale } }: Params) {
  unstable_setRequestLocale(locale);

  return <h1>Tokenomics</h1>;
}
