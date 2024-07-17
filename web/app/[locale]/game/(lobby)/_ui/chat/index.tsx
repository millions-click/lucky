'use client';

import { useState } from 'react';
import Link from 'next/link';

import { Activate, Locked, Timer, Generated, Secure, Bag } from './messages';

import { type CryptoState, useCrypto, useLuckyBags } from '@/providers';
import { type ChatMessages, ChatController, Selector } from '@/ui';
import type { LuckyBagState } from '@/adapters';

const asLink = (href: string) => ({
  next: '',
  Component: Link,
  props: { href },
  onClick: () => void 0,
});

const MESSAGES = {
  welcome: { next: 'mood' },
  activate: { Actions: Activate },
  locked: { Actions: Locked },
  mood: { Actions: Selector({ actions: ['ready', 'eager', 'calm', 'lucky'] }) },
  lucky: { next: 'pass' },
  pass: { Actions: Selector({ actions: ['timer', 'later'] }) },
  timer: { Actions: Timer, noNav: true },
  bag: { Actions: Bag },
  generated: { Actions: Generated },
  secure: { Actions: Secure },
  gifts: {
    Actions: Selector({
      actions: ['socials', asLink('game/store?no_gifts')],
    }),
  },
  store: { palId: 'lucky' },
} as ChatMessages;
type MessageKey = keyof typeof MESSAGES;

// TODO: If the user is using an external wallet, it should go directly to the last message.
function getActiveMessage(key: CryptoState, bag: LuckyBagState) {
  switch (bag) {
    case 'empty':
      return 'welcome';
    case 'idle':
      return 'activate';
    case 'locked':
      return 'locked';
    case 'unlocked':
      return key === 'unsafe' ? 'secure' : 'gifts';
  }
}

export function LobbyChatController() {
  const { state: key } = useCrypto();
  const { state: bag } = useLuckyBags();

  // TODO: Save the path in the local storage and restore it on reload. Use it to initialize the active message.
  const [active, setActive] = useState<MessageKey | undefined>(
    getActiveMessage(key, bag)
  );

  return (
    <ChatController
      active={active}
      setActive={setActive}
      messages={MESSAGES}
      settings={{
        backdrop: ' ',
        typing: 10,
        namespace: 'Lobby',
        palId: 'jessie',
      }}
    />
  );
}
