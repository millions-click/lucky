'use client';

import { useState } from 'react';

import {
  type ChatMessages,
  ChatController,
  Selector,
  asLink,
} from '@/ui/messages';

const MESSAGES = {
  welcome: { next: 'intro' },
  intro: { next: 'first' },
  first: {
    Actions: Selector({
      actions: [
        asLink('realms/coins?from=realms&action=activate'),
        asLink('/game?from=realms&to=email'),
      ],
    }),
  },
} as ChatMessages;
type MessageKey = keyof typeof MESSAGES;

export function PortalChatController() {
  const [active, setActive] = useState<MessageKey | undefined>('welcome');

  return (
    <ChatController
      active={active}
      setActive={setActive}
      messages={MESSAGES}
      settings={{
        backdrop: '',
        typing: 10,
        namespace: 'Realms',
        palId: 'emili',
      }}
    />
  );
}
