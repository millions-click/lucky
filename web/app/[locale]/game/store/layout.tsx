'use client';

import { PropsWithChildren } from 'react';

import { Background, useMessages } from '@/providers';
import { StoreChatController } from './_ui';

const bg = 'store.webp';

export default function Layout({ children }: PropsWithChildren) {
  const { messages } = useMessages();

  return (
    <>
      <Background name={bg} />
      {!messages.length && <div className="max-w-md p-8">{children}</div>}
      <StoreChatController />
    </>
  );
}
