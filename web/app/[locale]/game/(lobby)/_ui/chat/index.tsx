'use client';

import { Activate, Locked, Timer, Generated, Secure, Bag } from './messages';
import { Selector } from './Selector';

import {
  type CryptoState,
  useCrypto,
  useLuckyBags,
  useMessages,
} from '@/providers';
import { useEffect, useState } from 'react';
import { Messages, type MessageProps } from '@/ui';
import type { LuckyBagState } from '@/adapters';

type MessageDef = Partial<Omit<MessageProps, 'backdrop'>> & {
  backdrop?: string;
};
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
  gifts: {},
} as Record<string, MessageDef>;
type MessageKey = keyof typeof MESSAGES;

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

export function ChatController() {
  const { show } = useMessages({ namespace: 'Lobby', palId: 'jessie' });
  const { state: key } = useCrypto();
  const { state: bag } = useLuckyBags();

  // TODO: Save the path in the local storage and restore it on reload. Use it to initialize the active message.
  const [path, setPath] = useState<MessageKey[]>([]);
  const [active, setActive] = useState<MessageKey | undefined>(
    getActiveMessage(key, bag)
  );
  const [prev, setPrev] = useState<MessageKey | undefined>(
    path.length ? path[path.length - 1] : undefined
  );
  const [message, setMessage] = useState<MessageDef>({});

  useEffect(() => {
    if (!active) return;

    const message = MESSAGES[active];
    if (message) {
      show(active);
      setMessage(message);
    }
  }, [active, show]);

  const onNext = (next: string) => {
    if (!(next in MESSAGES)) return;

    if (next === prev) {
      const _path = path.slice(0, -1);
      setPrev(_path[_path.length - 1]);
      setPath(_path);
    } else {
      if (!active) throw new Error('This should not happen');
      setPrev(active);
      setPath((current) => [...current, active]);
    }

    setActive(next);
  };

  return (
    <Messages
      typing={10}
      backdrop=" "
      onNext={onNext}
      previous={prev}
      {...message}
    />
  );
}
