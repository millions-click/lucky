'use client';

import { PropsWithChildren, useEffect, useMemo } from 'react';

import { Background, useRealms } from '@/providers';

const REALM_ID = 'coin';
const bg = 'coins.png';

export default function Layout({ children }: PropsWithChildren) {
  const { active, activate } = useRealms();
  const ready = useMemo(
    () => active?.account.name.toLowerCase() === REALM_ID,
    [active]
  );

  useEffect(() => {
    if (ready) return;
    activate(REALM_ID);
  }, [ready]);

  return (
    <>
      <Background name={bg} />
      {ready ? (
        <div className="max-w-md relative flex items-center justify-center">
          <figure className="pointer-events-none">
            <img
              src="/assets/images/realms/coins/island.png"
              alt="Coins"
              className="w-full pointer-events-none"
            />
          </figure>
          {children}
        </div>
      ) : (
        <span className="loading loading-dots loading-lg" />
      )}
    </>
  );
}
