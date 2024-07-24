'use client';

import { useState } from 'react';
import { Activate, Locked, Timer, Generated, Secure, Bag } from './messages';

import type { LuckyPassState, CryptoState } from '@/providers/types.d';
import { useCrypto, useLuckyBags, useLuckyPass } from '@/providers';
import {
  type ChatMessages,
  ChatController,
  Selector,
  asLink,
  Later,
} from '@/ui/messages';
import type { LuckyBagState } from '@/adapters';

const MESSAGES = {
  welcome: { next: 'mood' },
  activate: { Actions: Activate },
  locked: { Actions: Locked },
  mood: { Actions: Selector({ actions: ['ready', 'eager', 'calm', 'lucky'] }) },
  lucky: { next: 'pass' },
  pass: { Actions: Selector({ actions: ['timer', 'later'] }) },
  later: { Actions: Later, next: 'timer', noNav: true },
  timer: { Actions: Timer, noNav: true },
  bag: { Actions: Bag },
  generated: { Actions: Generated },
  secure: { Actions: Secure },
  gifts: {
    Actions: Selector({
      actions: ['socials', asLink('game/store?from=lobby&action=no-gifts')],
    }),
  },
  'see-you': { next: 'store' },
} as ChatMessages;
type MessageKey = keyof typeof MESSAGES;

// TODO: If the user is using an external wallet, it should go directly to the last message.
function getActiveMessage(
  pass: LuckyPassState,
  key: CryptoState,
  bag: LuckyBagState
) {
  switch (pass) {
    case 'saved':
      return 'later';
    case 'idle':
    case 'active':
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
}

export function LobbyChatController() {
  const { state: key } = useCrypto();
  const { state: bag } = useLuckyBags();
  const { state: pass } = useLuckyPass();

  // TODO: Save the path in the local storage and restore it on reload. Use it to initialize the active message.
  const [active, setActive] = useState<MessageKey | undefined>(
    getActiveMessage(pass, key, bag)
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
