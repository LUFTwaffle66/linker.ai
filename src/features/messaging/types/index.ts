import { z } from 'zod';

export type UserType = 'client' | 'freelancer';

export interface User {
  id: string;
  name: string;
  avatar: string;
  type: UserType;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  attachments?: FileAttachment[];
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
  isMuted: boolean;
  isStarred: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationSettings {
  isMuted: boolean;
  isStarred: boolean;
  isBlocked: boolean;
}

// Zod Schemas
export const sendMessageSchema = z.object({
  conversationId: z.string().min(1),
  content: z.string().min(1).max(5000),
  attachments: z.array(z.any()).optional(),
});

export type SendMessageFormData = z.infer<typeof sendMessageSchema>;

export const createConversationSchema = z.object({
  participantId: z.string().min(1),
  message: z.string().min(1).max(5000),
});

export type CreateConversationFormData = z.infer<typeof createConversationSchema>;
