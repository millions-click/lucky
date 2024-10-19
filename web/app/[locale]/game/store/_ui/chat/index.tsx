'use client';

import { useState } from 'react';

import {
  type ChatMessages,
  ChatController,
  Selector,
  asLink,
  Buy,
} from '@/ui/messages';

const MESSAGES = {
  welcome: { next: 'intro' },
  intro: {
    Actions: Selector({
      actions: ['buy', asLink('/game?from=store&to=socials')],
    }),
  },
  buy: { backdrop: 'sm:hidden', Actions: Buy, noNav: true },
} as ChatMessages;
type MessageKey = keyof typeof MESSAGES;

export function StoreChatController() {
  const [active, setActive] = useState<MessageKey | undefined>('welcome');

  return (
    <ChatController
      active={active}
      setActive={setActive}
      messages={MESSAGES}
      settings={{
        backdrop: ' ',
        typing: 10,
        namespace: 'Store',
        palId: 'clover',
      }}
    />
  );
}
