import './global.css';

import {
  ReactQueryProvider,
  ClusterProvider,
  CryptoProvider,
  LuckyBagsProvider,
  SolanaProvider,
  DataFeedProvider,
} from '@/providers';
import { UiLayout } from '@/components/ui/ui-layout';
import { Analytics } from '@vercel/analytics/next';

const { NEXT_PUBLIC_VERCEL_ENV = 'development' } = process.env;
export const metadata = {
  title: 'Luckyland',
  description: 'Where Prizes 🎉 and FUN 😃 never stops!',
};

import map from '../public/img/mapa-vial 1.svg';
import range from '../public/img/grafico-circular 1.svg';
import cup from '../public/img/futbol-americano 1.svg';

const links: {
  label: string;
  path: string;
  program?: boolean;
  img?: string;
}[] = [
  { label: 'Account', path: '/account' },
  { label: 'Treasury', path: '/treasure', program: true },
  { label: 'Games', path: '/games', program: true, img: cup },
  { label: 'Lucky', path: '/lucky', program: true, img: range },
  { label: 'Store', path: '/store', program: true },
  { label: 'TinyAdventure', path: '/tiny-adventure', program: true, img: map },
  { label: 'Dealer', path: '/dealer', program: true },
  { label: 'Lobby', path: '/lobby', program: true },
  // { label: 'Tokenomics', path: '/tokenomics', program: true },
  // { label: 'Leaderboard', path: '/leaderboard', program: true },
];

if (NEXT_PUBLIC_VERCEL_ENV !== 'production')
  links.push({ label: 'Clusters', path: '/clusters' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className="min-h-screen w-full max-w-[375px] mx-auto"
    >
      <body className="min-h-screen w-full max-w-[375px] mx-auto bg-base-100 lg:mockup-phone">
        <div className="camera"></div>
        <ReactQueryProvider>
          <ClusterProvider>
            <CryptoProvider>
              <LuckyBagsProvider>
                <SolanaProvider>
                  <DataFeedProvider>
                    <div className="display">
                      <div className="artboard artboard-demo phone-7  ">
                        <UiLayout links={links} env={NEXT_PUBLIC_VERCEL_ENV}>
                          {children}
                        </UiLayout>
                      </div>
                    </div>
                  </DataFeedProvider>
                </SolanaProvider>
              </LuckyBagsProvider>
            </CryptoProvider>
          </ClusterProvider>
        </ReactQueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
