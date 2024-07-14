'use client';

import { useLuckyBags, useMessages } from '@/providers';
import { useEffect, useState } from 'react';
import { Messages, type MessageProps } from '@/ui';

import { Selector } from './Selector';
import { Generate, Timer } from './messages';

type MessageDef = Partial<Omit<MessageProps, 'backdrop'>> & {
  backdrop?: string;
};
const MESSAGES = {
  welcome: {
    next: 'mood',
  },
  mood: {
    Actions: Selector({ actions: ['ready', 'eager', 'calm', 'lucky'] }),
  },
  lucky: { next: 'pass' },
  pass: { Actions: Selector({ actions: ['timer', 'later'] }) },
  timer: { backdrop: '', Actions: Timer, noNav: true },
  bag: { Actions: Selector({ actions: ['generate', 'import', 'connect'] }) },
  generate: { Actions: Generate },
  secure: {},
} as Record<string, MessageDef>;
type MessageKey = keyof typeof MESSAGES;

export function ChatController() {
  // TODO: Save the active message in the local storage and restore it on reload.
  const { show } = useMessages({ namespace: 'Lobby', palId: 'jessie' });
  const { bag } = useLuckyBags();

  const [active, setActive] = useState<MessageKey>(
    bag ? 'generate' : 'welcome'
  );
  const [prev, setPrev] = useState<MessageKey>();
  const [message, setMessage] = useState<MessageDef>({});

  useEffect(() => {
    const message = MESSAGES[active];
    if (message) {
      show(active);
      setMessage(message);
    }
  }, [active, show]);

  const onNext = (next: string) => {
    if (next in MESSAGES) {
      setActive(next as MessageKey);
      setPrev(next === 'welcome' ? undefined : active);
    }
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
