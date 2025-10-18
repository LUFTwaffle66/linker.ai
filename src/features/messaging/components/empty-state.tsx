import { MessageSquare } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-muted/20">
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <div className="p-4 bg-primary/10 rounded-full">
            <MessageSquare className="w-12 h-12 text-primary" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">No Conversation Selected</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Select a conversation from the list to start messaging
          </p>
        </div>
      </div>
    </div>
  );
}
