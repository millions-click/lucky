'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import type { Message } from '@/providers';
import { type NavProps, Nav } from './Nav';

export type MessageProps = NavProps & {
  message: Message;
  noNav?: boolean;
  typing?: number;
  Actions?: React.FC<NavProps & { message: Message }>;
};

export function AdviceMessage({
  advice,
  backdrop,
}: {
  advice: string;
  backdrop?: boolean;
}) {
  if (!advice) return null;

  return (
    <div
      className={`bg-accent text-xs sm:text-sm font-sans px-4 py-2 mt-4 rounded-box text-accent-content ${
        backdrop ? 'font-bold' : ''
      }`}
    >
      {advice}
    </div>
  );
}

export function Message({
  message,
  noNav,
  typing,
  Actions,
  ...nav
}: MessageProps) {
  const [text, setText] = useState('');
  const [advice, setAdvice] = useState('');
  const [finished, setFinished] = useState(0);
  const { backdrop } = nav;

  useEffect(() => {
    if (!typing) {
      setText(message.text);
      if (message.advice) setAdvice(message.advice);
      setFinished(2);
      return;
    }

    setFinished(0);
    setText('');
    setAdvice('');

    const interval = setInterval(() => {
      setText((prev) => {
        if (prev.length === message.text.length) {
          clearInterval(interval);
          if (message.advice) setAdvice(message.advice);
          setTimeout(() => {
            setFinished(1);
            setTimeout(() => setFinished(2), 500);
          }, 500);
          return prev;
        }

        return message.text.slice(0, prev.length + 1);
      });
    }, typing);

    return () => clearInterval(interval);
  }, [message.text]);

  return (
    <div
      className={`chat chat-start lg:chat-end mx-2 sm:mx-4 ${
        backdrop ? 'max-w-3xl' : 'max-[400px]:max-w-xs max-w-md lg:max-w-lg'
      }`}
    >
      <div className={`chat-image avatar ${backdrop ? 'self-start mt-6' : ''}`}>
        <div className="w-10 rounded-full">
          <Image
            alt={message.sender.name}
            src={message.sender.avatar}
            width={128}
            height={128}
            className="lg:scale-x-[-1]"
          />
        </div>
      </div>
      <div className="chat-header">{message.sender.name}</div>
      <div
        className={[
          'chat-bubble text-base-content text-start shadow-lg p-4',
          backdrop ? 'bg-base-100/50 text-white sm:text-xl' : 'sm:text-lg',
        ].join(' ')}
      >
        {text}
        <AdviceMessage advice={advice} backdrop={backdrop} />
        {Boolean(finished) && (
          <div className={finished === 1 ? 'animate-scale-up' : ''}>
            {Actions && <Actions {...nav} message={message} />}
            {!noNav && <Nav {...nav} backdrop={backdrop} />}
          </div>
        )}
      </div>
    </div>
  );
}
