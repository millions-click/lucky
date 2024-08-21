import { Provider as MessagesProvider } from '@/providers/messages/context';

import { AssistantMessages } from './Chat';
import { UserQuestion } from './UserQuestion';

export function Assistant() {
  return (
    <MessagesProvider namespace="Components.Assistant">
      <div className="flex flex-col max-h-[60vh] p-2">
        <AssistantMessages />
        <UserQuestion />
      </div>
    </MessagesProvider>
  );
}
