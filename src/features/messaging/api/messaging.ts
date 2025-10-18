import type { Conversation, Message, ConversationSettings, SendMessageFormData } from '../types';
import { MOCK_CONVERSATIONS, MOCK_MESSAGES, CURRENT_USER_ID } from './mock-data';

// Simulate API delay
const simulateDelay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// API Error class
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// In-memory storage for mock data
let conversations = [...MOCK_CONVERSATIONS];
let messages = [...MOCK_MESSAGES];

/**
 * Fetch all conversations for the current user
 * @returns Promise<Conversation[]>
 */
export const getConversations = async (): Promise<Conversation[]> => {
  await simulateDelay();

  // Sort by most recent first
  return conversations.sort((a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
};

/**
 * Fetch a single conversation by ID
 * @param conversationId - The conversation ID
 * @returns Promise<Conversation>
 */
export const getConversation = async (conversationId: string): Promise<Conversation> => {
  await simulateDelay();

  const conversation = conversations.find((c) => c.id === conversationId);

  if (!conversation) {
    throw new ApiError(404, 'Conversation not found');
  }

  return conversation;
};

/**
 * Fetch all messages for a conversation
 * @param conversationId - The conversation ID
 * @returns Promise<Message[]>
 */
export const getMessages = async (conversationId: string): Promise<Message[]> => {
  await simulateDelay();

  const conversationMessages = messages
    .filter((m) => m.conversationId === conversationId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  if (conversationMessages.length === 0) {
    const conversation = conversations.find((c) => c.id === conversationId);
    if (!conversation) {
      throw new ApiError(404, 'Conversation not found');
    }
  }

  return conversationMessages;
};

/**
 * Send a message in a conversation
 * @param data - Message data
 * @returns Promise<Message>
 */
export const sendMessage = async (data: SendMessageFormData): Promise<Message> => {
  await simulateDelay(800);

  const conversation = conversations.find((c) => c.id === data.conversationId);

  if (!conversation) {
    throw new ApiError(404, 'Conversation not found');
  }

  const newMessage: Message = {
    id: `msg-${Date.now()}`,
    conversationId: data.conversationId,
    senderId: CURRENT_USER_ID,
    content: data.content,
    timestamp: new Date(),
    read: false,
    attachments: data.attachments,
  };

  messages.push(newMessage);

  // Update conversation's last message and timestamp
  const conversationIndex = conversations.findIndex((c) => c.id === data.conversationId);
  conversations[conversationIndex] = {
    ...conversation,
    lastMessage: newMessage,
    updatedAt: new Date(),
  };

  return newMessage;
};

/**
 * Mark messages as read
 * @param conversationId - The conversation ID
 * @returns Promise<void>
 */
export const markAsRead = async (conversationId: string): Promise<void> => {
  await simulateDelay(300);

  // Mark all messages in this conversation as read
  messages = messages.map((m) =>
    m.conversationId === conversationId && m.senderId !== CURRENT_USER_ID
      ? { ...m, read: true }
      : m
  );

  // Update conversation's unread count
  const conversationIndex = conversations.findIndex((c) => c.id === conversationId);
  if (conversationIndex !== -1) {
    conversations[conversationIndex] = {
      ...conversations[conversationIndex],
      unreadCount: 0,
    };
  }
};

/**
 * Update conversation settings
 * @param conversationId - The conversation ID
 * @param settings - Settings to update
 * @returns Promise<Conversation>
 */
export const updateConversationSettings = async (
  conversationId: string,
  settings: Partial<ConversationSettings>
): Promise<Conversation> => {
  await simulateDelay(500);

  const conversationIndex = conversations.findIndex((c) => c.id === conversationId);

  if (conversationIndex === -1) {
    throw new ApiError(404, 'Conversation not found');
  }

  conversations[conversationIndex] = {
    ...conversations[conversationIndex],
    ...settings,
  };

  return conversations[conversationIndex];
};

/**
 * Delete a conversation
 * @param conversationId - The conversation ID
 * @returns Promise<void>
 */
export const deleteConversation = async (conversationId: string): Promise<void> => {
  await simulateDelay(500);

  const conversationIndex = conversations.findIndex((c) => c.id === conversationId);

  if (conversationIndex === -1) {
    throw new ApiError(404, 'Conversation not found');
  }

  // Remove conversation and all its messages
  conversations = conversations.filter((c) => c.id !== conversationId);
  messages = messages.filter((m) => m.conversationId !== conversationId);
};

/**
 * Search conversations
 * @param query - Search query
 * @returns Promise<Conversation[]>
 */
export const searchConversations = async (query: string): Promise<Conversation[]> => {
  await simulateDelay(400);

  if (!query.trim()) {
    return conversations;
  }

  const lowerQuery = query.toLowerCase();

  return conversations.filter((c) =>
    c.participants.some((p) => p.name.toLowerCase().includes(lowerQuery)) ||
    c.lastMessage.content.toLowerCase().includes(lowerQuery)
  );
};
