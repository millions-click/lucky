'use server';

import type { Message } from '@/providers';

export async function askAssistant(text: string): Promise<Message> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ type: 'answer', text: `You asked: ${text}` } as Message);
    }, 5000);
  });
}
