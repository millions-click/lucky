'use client';

import { useEffect, useState } from 'react';

import {
  type ChatMessages,
  ChatController,
  getBagMessage,
  Activate,
  Locked,
  Buy,
} from '@/ui/messages';

import type { BagType, GameState } from '@/providers/types.d';
import type { LuckyBagState } from '@/adapters';
import { useGame, useLuckyBags, usePlayer } from '@/providers';

const MESSAGES = {
  activate: { next: '_close', Actions: Activate, noNav: true, backdrop: ' ' },
  locked: { next: '_close', Actions: Locked, noNav: true, backdrop: ' ' },
  welcome: { next: '_close', backdrop: ' ' },
  buy: {
    next: '_close',
    backdrop: 'sm:hidden',
    Actions: Buy,
    noNav: true,
    palId: 'clover',
  },
} as ChatMessages;
type MessageKey = keyof typeof MESSAGES;

function getActiveMessage(
  game: GameState,
  bag: LuckyBagState,
  bagType: BagType
) {
  const bagMessage = getBagMessage(bag, bagType);
  if (bagMessage) return bagMessage;

  switch (game) {
    case 'not-enough-ammo':
      return 'buy';
    case 'newbie':
      return 'welcome';
    case 'loading':
    case 'idle':
    default:
      return;
  }
}

export function RealmChatController() {
  const { state: bag } = useLuckyBags();
  const { bagType } = usePlayer();
  const { id, state: game } = useGame();

  const [active, setActive] = useState<MessageKey | undefined>(
    getActiveMessage(game, bag, bagType)
  );

  useEffect(() => {
    setActive(getActiveMessage(game, bag, bagType));
  }, [game]);

  if (!id) return null;
  return (
    <ChatController
      active={active}
      setActive={setActive}
      messages={MESSAGES}
      settings={{
        typing: 10,
        minimized: true,
        namespace: `Realms.${id}`,
        palId: 'emili',
      }}
    />
  );
}
