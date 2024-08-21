'use client';

import { useEffect, useRef, useState } from 'react';
import { Message, useAssistant } from '@/providers';
import { useTranslations } from 'next-intl';

type MessageProps = { message: Message };
function Question({ message: { text } }: MessageProps) {
  return (
    <div className="chat chat-end">
      <div className="chat-bubble chat-bubble-info">{text}</div>
    </div>
  );
}

function Answer({ message }: MessageProps) {
  const [text, setText] = useState('');

  useEffect(() => {
    setText('');

    const interval = setInterval(() => {
      setText((prev) => {
        if (prev.length === message.text.length) {
          clearInterval(interval);
          return prev;
        }

        return message.text.slice(0, prev.length + 1);
      });
    }, 10);

    return () => clearInterval(interval);
  }, [message.text]);

  return (
    <div className="chat chat-start">
      <div className="chat-bubble chat-bubble-accent">{text}</div>
    </div>
  );
}

export function AssistantMessages() {
  const { messages, loading, namespace } = useAssistant();
  const t = useTranslations(namespace);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current)
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-auto pb-2 mb-1">
      <Answer message={{ text: t('hello') } as Message} />
      {messages.map((message) => (
        <div key={message.id}>
          {message.type === 'question' ? (
            <Question message={message} />
          ) : (
            <Answer message={message} />
          )}
        </div>
      ))}
      {loading && (
        <div className="chat chat-start">
          <div className="chat-bubble chat-bubble-accent">
            <span className="loading loading-dots" />
          </div>
        </div>
      )}
      <div ref={chatEndRef} />
    </div>
  );
}
