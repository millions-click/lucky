'use client';

import { useState } from 'react';

import {
  type ChatMessages,
  ChatController,
  Selector,
  getBagMessage,
  Activate,
  Locked,
} from '@/ui/messages';
import { RealmEntry } from '@/ui/realms';

import type { BagType, LuckyPassState } from '@/providers/types.d';
import type { LuckyBagState } from '@/adapters';
import { useLuckyBags, useLuckyPass, usePlayer } from '@/providers';

const MESSAGES = {
  activate: { next: 'first', Actions: Activate, noNav: true },
  locked: { next: 'first', Actions: Locked, noNav: true },
  welcome: { next: 'first', backdrop: ' ' },
  first: {
    backdrop: 'hidden',
    Actions: Selector({
      noTitle: true,
      actions: [
        {
          next: 'activate',
          Component: RealmEntry,
          props: {
            params: 'from=portal&action=first',
          },
        },
      ],
    }),
  },
  expired: {},
} as ChatMessages;
type MessageKey = keyof typeof MESSAGES;

function getActiveMessage(
  pass: LuckyPassState,
  bag: LuckyBagState,
  bagType: BagType
) {
  const bagMessage = getBagMessage(bag, bagType);
  if (bagMessage) return bagMessage;

  switch (pass) {
    case 'active':
      return 'first';
    case 'expired':
      return 'expired';
    default:
      return 'welcome';
  }
}

export function PortalChatController() {
  const { state: pass } = useLuckyPass();
  const { state: bag } = useLuckyBags();
  const { bagType } = usePlayer();

  const [active, setActive] = useState<MessageKey | undefined>(
    getActiveMessage(pass, bag, bagType)
  );

  return (
    <ChatController
      active={active}
      setActive={setActive}
      messages={MESSAGES}
      settings={{
        typing: 10,
        namespace: 'Realms',
        palId: 'emili',
      }}
    />
  );
}
