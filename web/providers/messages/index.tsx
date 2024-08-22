import type { PropsWithChildren } from 'react';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

import type { MessagesSettings, Message } from './messages.d';
import { Provider, useMessages, useMessagesHandler } from './context';
import { GamePalProvider } from '../game-pal';

type ChatProviderProps = PropsWithChildren & MessagesSettings;
export async function MessagesProvider({
  children,
  namespace,
  palId,
}: ChatProviderProps) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <GamePalProvider active={palId}>
        <Provider namespace={namespace}>{children}</Provider>
      </GamePalProvider>
    </NextIntlClientProvider>
  );
}

export { useMessages, useMessagesHandler, MessagesSettings, Message };
