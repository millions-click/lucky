'use client';

import { PropsWithChildren, useEffect, useMemo } from 'react';
import Image from 'next/image';

import { Background, useRealms } from '@/providers';

const REALM_ID = 'coin';
const bg = 'coins.png';

export default function Layout({ children }: PropsWithChildren) {
  const { active, activate } = useRealms();
  const ready = useMemo(
    () => active?.name.toLowerCase() === REALM_ID,
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
          <figure className="pointer-events-none select-none">
            <Image
              src="/assets/images/realms/coins/island.png"
              alt="Coins"
              width={512}
              height={512}
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
