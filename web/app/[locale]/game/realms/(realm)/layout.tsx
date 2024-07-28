import type { PropsWithChildren } from 'react';

import { Header, RealmChatController } from './_ui';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      <div className="hero-content text-neutral-content text-center">
        {children}
      </div>
      <RealmChatController />
    </>
  );
}
