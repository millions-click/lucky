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
  type?: 'question' | 'answer';
};

export type Messages = Array<Message>;
export type MessagesContext = {
  namespace: string;

  messages: Messages;
  setMessages: Dispatch<SetStateAction<Messages>>;
  clear: () => void;

  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
};

export type MessagesContextHandler = MessagesContext & {
  show: (id: MessageId, values?: TranslationValues, replace?: boolean) => void;
};

export type MessagesContextAssistant = MessagesContext & {
  ask: (text: string) => Promise<void>;
};

export type MessagesSettings = {
  namespace?: string;
  palId?: GamePalId;
  ttl?: number; // In seconds
};
