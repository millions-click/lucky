'use client';

import { useMemo } from 'react';

import {
  type ChatMessages,
  ChatController,
  Selector,
  asLink,
} from '@/ui/messages';

const MESSAGES = {
  '0': {},
  '1': {},
  '2': {},
  '3': {},
  '4': {},
  '5': {},
  '6': {},
  '7': {
    className: 'z-50',
    Actions: Selector({
      actions: [asLink('/redeem'), asLink('/roadmap')],
    }),
  },
} as ChatMessages;
export type LockState =
  | 'idle'
  | 'playing'
  | 'hold'
  | 'winner'
  | 'unlocked'
  | 'activated'
  | 'expired'
  | 'locked';

function getActiveMessage(attempts: number, state: LockState) {
  switch (state) {
    case 'idle':
      return Math.min(attempts || 0, 4).toString();
    case 'winner':
      return '5';
    case 'unlocked':
    case 'activated':
    case 'expired':
      return '6';
    case 'locked':
      return '7';
    case 'playing':
    case 'hold':
    default:
      return;
  }
}

export function LockChatController({
  state,
  attempts,
}: {
  state: LockState;
  attempts: number;
}) {
  const active = useMemo(
    () => getActiveMessage(attempts, state),
    [state, attempts]
  );

  return (
    <ChatController
      active={active}
      messages={MESSAGES}
      settings={{
        minimized: true,
        typing: 10,
        namespace: 'Index',
        palId: 'lucky',
      }}
    />
  );
}
