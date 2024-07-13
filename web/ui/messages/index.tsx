'use client';

import { type MessagesSettings, useMessages } from '@/providers';
import { type MessageProps, Message } from './Message';

type MessagesProps = MessagesSettings &
  Pick<MessageProps, 'typing' | 'next' | 'onNext' | 'Actions'> & {
    backdrop?: string;
  };

export function Messages({ backdrop, ...settings }: MessagesProps) {
  const { messages } = useMessages(settings);
  if (!messages.length) return null;

  return (
    <>
      {backdrop && (
        <div
          className={`fixed top-0 left-0 bottom-0 right-0 bg-base-100/30 backdrop-blur-sm ${backdrop}`}
        />
      )}
      <div
        className={`fixed bottom-4 max-lg:left-0 lg:right-0 flex justify-center ${
          backdrop ? 'bottom-16 w-full' : ''
        }`}
      >
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            backdrop={Boolean(backdrop)}
            {...settings}
          />
        ))}
      </div>
    </>
  );
}

export { Message, MessageProps };
