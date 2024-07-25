'use client';

import { useState } from 'react';

import { type ChatMessages, ChatController, Selector } from '@/ui/messages';
import { RealmEntry } from '@/ui/realms';

import type { LuckyPassState } from '@/providers/types.d';
import { useLuckyPass } from '@/providers';

const MESSAGES = {
  welcome: { next: 'first', backdrop: ' ' },
  first: {
    backdrop: '',
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

function getActiveMessage(pass: LuckyPassState) {
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
  const [active, setActive] = useState<MessageKey | undefined>(
    getActiveMessage(pass)
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
