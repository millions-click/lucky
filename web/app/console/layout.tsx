import { PropsWithChildren } from 'react';
import '../global.css';

import {
  ReactQueryProvider,
  ClusterProvider,
  CryptoProvider,
  LuckyBagsProvider,
  SolanaProvider,
  DataFeedProvider,
} from '@/providers';
import { UiLayout } from '@/components/ui/ui-layout';

const { NEXT_PUBLIC_VERCEL_ENV = 'development' } = process.env;

const links: { label: string; path: string; program?: boolean }[] = [
  { label: 'Account', path: '/account' },
  { label: 'Treasury', path: '/treasure', program: true },
  { label: 'Games', path: '/games', program: true },
  { label: 'Lucky', path: '/lucky', program: true },
  { label: 'Store', path: '/store', program: true },
].map((link) => ({ ...link, path: `/console${link.path}` }));

if (NEXT_PUBLIC_VERCEL_ENV !== 'production')
  links.push({ label: 'Clusters', path: '/console/clusters' });

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <ClusterProvider>
            <CryptoProvider>
              <LuckyBagsProvider>
                <SolanaProvider>
                  <DataFeedProvider>
                    <UiLayout links={links} env={NEXT_PUBLIC_VERCEL_ENV}>
                      {children}
                    </UiLayout>
                  </DataFeedProvider>
                </SolanaProvider>
              </LuckyBagsProvider>
            </CryptoProvider>
          </ClusterProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
