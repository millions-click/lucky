import { Suspense } from 'react';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

import { Nav } from './nav';

import {
  ReactQueryProvider,
  ClusterProvider,
  SolanaProvider,
  BountiesProvider,
  GemsProvider,
} from '@/providers';

export async function Header() {
  const messages = await getMessages();

  return (
    <header className="fixed flex justify-between left-0 top-0 right-0 px-4 lg:px-8 py-4 z-10">
      <Suspense>
        <ReactQueryProvider>
          <ClusterProvider>
            <SolanaProvider>
              <GemsProvider>
                <BountiesProvider>
                  <NextIntlClientProvider messages={messages}>
                    <Nav />
                    <button className="btn btn-square btn-ghost">Log in</button>
                  </NextIntlClientProvider>
                </BountiesProvider>
              </GemsProvider>
            </SolanaProvider>
          </ClusterProvider>
        </ReactQueryProvider>
      </Suspense>
    </header>
  );
}
