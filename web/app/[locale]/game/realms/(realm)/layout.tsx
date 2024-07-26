import type { PropsWithChildren } from 'react';

import { Header } from './_ui';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      <div className="hero-content text-neutral-content text-center">
        {children}
      </div>
    </>
  );
}
