'use server';

import OpenAI from 'openai';
import { Threads } from 'openai/resources/beta';

import type { Message } from '@/providers';

const openai = new OpenAI();

const { OPENAI_ASSISTANT_ID = '' } = process.env;
if (!OPENAI_ASSISTANT_ID) throw new Error('Missing OPENAI_ASSISTANT_ID');

export type AssistantScope = 'tokenomics' | 'roadmap' | 'glossary';

const INSTRUCTIONS: Record<AssistantScope, string> = {
  tokenomics: 'Please address the user in the context of tokenomics.',
  roadmap: 'Please address the user in the context of the roadmap.',
  glossary: 'Please address the user in the context of the glossary.',
};

export async function askAssistant(
  content: string,
  thread: string,
  scope: AssistantScope
): Promise<Message> {
  const message = await openai.beta.threads.messages.create(thread, {
    role: 'user',
    content,
  });

  let run = await openai.beta.threads.runs.createAndPoll(thread, {
    assistant_id: OPENAI_ASSISTANT_ID,
    max_completion_tokens: 300,
    additional_instructions: INSTRUCTIONS[scope],
  });

  if (run.status !== 'completed') throw new Error('Unexpected run status');

  const messages = await openai.beta.threads.messages.list(run.thread_id, {
    order: 'desc',
    limit: 2,
  });

  const reply = messages.data.find((m) => m.role === 'assistant');
  if (!reply) throw new Error('Unexpected response');

  if (reply.content[0].type !== 'text')
    throw new Error('Unexpected response type');

  return {
    id: reply.id,
    type: 'answer',
    text: `${reply.content[0].text.value}`,
    sender: { id: reply.assistant_id },
  } as Message;
}

export async function createThread(): Promise<string> {
  const thread = await openai.beta.threads.create();

  return thread.id;
}

export async function loadThread(
  thread: string,
  { limit = 1, order = 'desc', ...q }: Threads.MessageListParams = {}
): Promise<Array<Message>> {
  const messages = await openai.beta.threads.messages.list(thread, {
    order,
    limit,
    ...q,
  });

  return messages.data
    .map((m) =>
      m.content[0].type === 'text'
        ? ({
            id: m.id,
            type: m.role === 'user' ? 'question' : 'answer',
            text: m.content[0].text.value,
            sender: { id: m.assistant_id || m.thread_id },
            loaded: true,
          } as Message)
        : null
    )
    .filter(Boolean) as Array<Message>;
}
