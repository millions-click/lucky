'use client';

import { useState } from 'react';
import { Activate, Locked, Timer, Generated, Secure, Bag } from './messages';

import type { LuckyPassState, CryptoState, BagType } from '@/providers/types.d';
import type { LuckyBagState } from '@/adapters';
import { useCrypto, useLuckyBags, useLuckyPass, usePlayer } from '@/providers';
import {
  type ChatMessages,
  ChatController,
  Selector,
  asLink,
  Later,
} from '@/ui/messages';

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

function getActiveMessage(
  pass: LuckyPassState,
  key: CryptoState,
  bag: LuckyBagState,
  bagType: BagType
) {
  if (pass === 'saved') return 'later';
  if (bagType === 'external') return 'gifts';

  switch (bag) {
    case 'empty':
      return 'welcome';
    case 'idle':
      return 'activate';
    case 'locked':
      return 'locked';
    case 'unlocked':
      if (bagType === 'none') return 'activate';
      return key === 'unsafe' ? 'secure' : 'gifts';
  }
}

export function LobbyChatController() {
  const { state: key } = useCrypto();
  const { state: bag } = useLuckyBags();
  const { state: pass } = useLuckyPass();
  const { bagType } = usePlayer();

  // TODO: Save the path in the local storage and restore it on reload. Use it to initialize the active message.
  const [active, setActive] = useState<MessageKey | undefined>(
    getActiveMessage(pass, key, bag, bagType)
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
