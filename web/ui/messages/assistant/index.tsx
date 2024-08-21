import { Provider as MessagesProvider } from '@/providers/messages/context';

import { AssistantMessages } from './Chat';
import { UserQuestion } from './UserQuestion';

export function Assistant() {
  return (
    <MessagesProvider namespace="Assistant">
      <div className="p-2 rounded-box flex flex-col overflow-hidden max-h-[60vh]">
        <AssistantMessages />
        <UserQuestion />
      </div>
    </MessagesProvider>
  );
}
