'use client';

import { useState } from 'react';
import { ConversationList } from './conversation-list';
import { ChatHeader } from './chat-header';
import { MessageList } from './message-list';
import { MessageInput } from './message-input';
import { EmptyState } from './empty-state';
import type { Conversation } from '../types';
import { CURRENT_USER_ID } from '../api/mock-data';

export function MessagingView() {
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  const handleConversationSelect = (conversation: Conversation) => {
    setActiveConversation(conversation);
  };

  const handleConversationDeleted = () => {
    setActiveConversation(null);
  };

  // Get the other participant (not the current user)
  const otherParticipant = activeConversation?.participants.find(
    (p) => p.id !== CURRENT_USER_ID
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Conversation List - Left Sidebar */}
      <div className="w-80 shrink-0">
        <ConversationList
          currentUserId={CURRENT_USER_ID}
          activeConversationId={activeConversation?.id || null}
          onConversationSelect={handleConversationSelect}
        />
      </div>

      {/* Chat Area - Right Side */}
      <div className="flex-1 flex flex-col">
        {activeConversation && otherParticipant ? (
          <>
            <ChatHeader
              otherParticipant={otherParticipant}
              conversation={activeConversation}
              onConversationDeleted={handleConversationDeleted}
            />

            <MessageList conversationId={activeConversation.id} currentUserId={CURRENT_USER_ID} />

            <MessageInput conversationId={activeConversation.id} />
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
