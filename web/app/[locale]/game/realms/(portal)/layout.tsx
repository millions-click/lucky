'use client';

import { PropsWithChildren } from 'react';

import { PortalChatController } from './_ui';

import { Background, useMessages } from '@/providers';
import type { Params } from '@/app/[locale]/locale';

const bg = 'realms.webp';

export default function Layout({ children }: PropsWithChildren<Params>) {
  const { messages } = useMessages();

  return (
    <>
      <Background name={bg} />
      {!messages.length && (
        <div className="max-w-md bg-base-300/20 p-8">{children}</div>
      )}
      <PortalChatController />
    </>
  );
}
