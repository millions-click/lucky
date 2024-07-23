'use client';

import { useState } from 'react';

import { type ChatMessages, ChatController, Selector } from '@/ui';
import Link from 'next/link';
import { Buy } from './messages';

const asLink = (href: string) => ({
  next: '',
  Component: Link,
  props: { href },
  onClick: () => void 0,
});

const MESSAGES = {
  welcome: { next: 'intro' },
  intro: {
    Actions: Selector({
      actions: ['buy', asLink('/game?socials')],
    }),
  },
  buy: { backdrop: 'sm:hidden', Actions: Buy, noNav: true },
  confirmPurchase: { Actions: Selector({ actions: ['yes', 'no'] }) },
  purchaseSuccess: {},
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
