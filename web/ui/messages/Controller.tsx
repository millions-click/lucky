'use client';

import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';

import {
  type GamePalId,
  type MessagesSettings,
  useMessagesHandler,
} from '@/providers';
import { Messages, type MessageProps, type MessagesProps } from '.';

export type MessageDefinition = Partial<Omit<MessageProps, 'backdrop'>> &
  Pick<MessagesProps, 'backdrop'> & { palId?: GamePalId };

export type MessageKey = string;
export type ChatMessages = Record<MessageKey, MessageDefinition>;

type ChatControllerProps = {
  messages: ChatMessages;
  active: MessageKey | undefined;
  setActive: Dispatch<SetStateAction<MessageKey | undefined>>;
  settings?: MessagesSettings & Pick<MessagesProps, 'backdrop' | 'typing'>;
};
export function ChatController({
  messages,
  active,
  setActive,
  settings,
}: ChatControllerProps) {
  // TODO: Save the path in the local storage and restore it on reload. Use it to initialize the active message.
  const [path, setPath] = useState<MessageKey[]>([]);
  const [prev, setPrev] = useState<MessageKey | undefined>(
    path.length ? path[path.length - 1] : undefined
  );
  const [message, setMessage] = useState<MessageDefinition>({});
  const { show, clear } = useMessagesHandler({
    ...settings,
    palId: message?.palId || settings?.palId,
  });

  useEffect(() => {
    if (!active) return clear();

    const message = messages[active];
    if (message) {
      show(active);
      setMessage(message);
    }
  }, [active, show]);

  const navHandler = (next: string) => {
    if (!(next in messages)) return;

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
    <Messages onNext={navHandler} previous={prev} {...settings} {...message} />
  );
}
