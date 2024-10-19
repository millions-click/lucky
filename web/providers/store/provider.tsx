import { PropsWithChildren } from 'react';

import {
  DataFeedProvider,
  PortalProvider,
  GemsProvider,
  TradersProvider,
} from '@/providers';

export function StoreProvider({ children }: PropsWithChildren) {
  return <DataFeedProvider>{children}</DataFeedProvider>;
}

export function StoreWithPortalProvider({ children }: PropsWithChildren) {
  return (
    <PortalProvider>
      <GemsProvider>
        <TradersProvider>
          <StoreProvider>{children}</StoreProvider>
        </TradersProvider>
      </GemsProvider>
    </PortalProvider>
  );
}
