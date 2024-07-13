import type { Dispatch, SetStateAction } from 'react';
import type { TranslationValues } from 'next-intl';

import type { GamePal, GamePalId } from '@/providers';

type MessageId = string;
type Sender = GamePal;

export type Message = {
  id: MessageId;
  text: string;
  sender: Sender;
  advice?: string;
  expire?: number;
  select?: string;
  options?: Array<string>;
};

export type Messages = Array<Message>;
export type MessagesContext = {
  namespace: string;

  messages: Messages;
  setMessages: Dispatch<SetStateAction<Messages>>;
  clear: () => void;
  show: (id: MessageId, values?: TranslationValues, replace?: boolean) => void;

  last?: Message;
};

export type MessagesSettings = {
  namespace?: string;
  palId?: GamePalId;
  ttl?: number; // In seconds
};
