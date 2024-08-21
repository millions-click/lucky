'use client';
import { useCallback, useEffect, useState } from 'react';

import { useMessages } from './context';

import type {
  Message,
  MessagesContextAssistant,
} from '@/providers/messages/messages';
import { askAssistant } from '@/actions/assistant';

export function useAssistant(): MessagesContextAssistant {
  const context = useMessages();
  const [question, setQuestion] = useState<string>();

  const ask = useCallback(
    async (text: string) => {
      context.setMessages((prev) => [
        ...prev,
        {
          id: `q_${prev.length}`,
          type: 'question',
          text,
        } as Message,
      ]);

      setQuestion(text);
    },
    [context.setMessages]
  );

  useEffect(() => {
    if (context.loading || !question) return;
    context.setLoading(true);
    setQuestion(undefined);

    askAssistant(question).then((reply) => {
      context.setMessages((prev) => [...prev, reply]);

      context.setLoading(false);
    });
  }, [context.loading, question]);

  return {
    ...context,
    ask,
  };
}
