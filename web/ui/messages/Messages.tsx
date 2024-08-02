'use client';

import { type MessageProps, Message } from './Message';
import { type NavProps } from './Nav';

import { GamePalId, useGamePal, useMessages } from '@/providers';
import Image from 'next/image';
import React, { useMemo } from 'react';
type MinimizedPalProps = {
  palId?: GamePalId;
  minimized?: boolean;
  onClick?: () => void;
};
function MinimizedPal({ palId, minimized, onClick }: MinimizedPalProps) {
  const { getPal } = useGamePal();
  const pal = useMemo(() => palId && getPal(palId), [palId]);
  if (!minimized || !pal) return null;

  return (
    <div
      className="fixed bottom-4 max-lg:left-2 lg:right-4 avatar online pointer-events-none select-none"
      onClick={onClick}
    >
      <div className="w-12 sm:w-16 rounded-full">
        <Image
          alt={pal.name}
          src={pal.avatar}
          width={128}
          height={128}
          className="lg:scale-x-[-1]"
        />
      </div>
    </div>
  );
}

export type MessagesProps = Omit<NavProps, 'backdrop'> &
  Pick<MessageProps, 'typing' | 'Actions'> &
  MinimizedPalProps & {
    backdrop?: string;
    className?: string;
  };

export function Messages({
  backdrop,
  className,
  minimized,
  onClick,
  ...settings
}: MessagesProps) {
  const { messages } = useMessages();
  if (!messages.length)
    return minimized ? (
      <MinimizedPal
        palId={settings.palId}
        minimized={minimized}
        onClick={onClick}
      />
    ) : null;

  return (
    <>
      {backdrop && (
        <div
          className={`fixed top-0 left-0 bottom-0 right-0 bg-base-100/30 backdrop-blur-sm ${backdrop}`}
        />
      )}
      <div
        className={`fixed bottom-4 max-lg:left-0 lg:right-0 flex justify-center ${className} ${
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
