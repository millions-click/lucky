import { PropsWithChildren } from 'react';

import { Background } from '@/providers';

const bg = 'coins.svg';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="max-w-md bg-base-300/20 p-8">
      <Background name={bg} />
      {children}
    </div>
  );
}
