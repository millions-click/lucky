'use client';

import { useMessages } from '@/providers';
import { useEffect, useState } from 'react';
import { Messages, type MessageProps } from '@/ui';

import { Mood } from './messages';

type MessageDef = Partial<Omit<MessageProps, 'backdrop'>> & {
  backdrop?: string;
};
const MESSAGES = {
  welcome: {
    next: 'mood',
  },
  mood: {
    Actions: Mood,
  },
  ready: {},
  eager: {},
  calm: {},
  lucky: { next: 'timer' },
  timer: { backdrop: '', next: 'calm' },
} as Record<string, MessageDef>;
type MessageKey = keyof typeof MESSAGES;

export function ChatController() {
  const { show } = useMessages({ namespace: 'Lobby', palId: 'jessie' });

  const [active, setActive] = useState<MessageKey>('welcome');
  const [message, setMessage] = useState<MessageDef>({});

  useEffect(() => {
    const message = MESSAGES[active];
    if (message) {
      show(active);
      setMessage(message);
    }
  }, [active, show]);

  const onNext = (next: string) => {
    if (next in MESSAGES) setActive(next as MessageKey);
  };

  return <Messages typing={10} backdrop=" " onNext={onNext} {...message} />;
}
