import type { Message, MessagesContext } from '@/providers/types.d';
import type { AssistantScope } from '@/actions/types.d';

export type AssistantContext = MessagesContext & {
  thread?: string;
  loading: boolean;
  error: boolean;

  ask: (text: string) => Promise<void>;
  retry: () => void;
};

export { Message, AssistantScope };
