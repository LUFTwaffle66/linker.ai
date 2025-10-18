import type { User, Message, Conversation } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Sarah Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    type: 'client',
    isOnline: true,
  },
  {
    id: 'user-2',
    name: 'Michael Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    type: 'freelancer',
    isOnline: true,
  },
  {
    id: 'user-3',
    name: 'Emily Davis',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    type: 'freelancer',
    isOnline: false,
    lastSeen: new Date('2024-01-15T10:30:00'),
  },
  {
    id: 'user-4',
    name: 'James Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    type: 'client',
    isOnline: false,
    lastSeen: new Date('2024-01-14T15:45:00'),
  },
  {
    id: 'user-5',
    name: 'Priya Patel',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    type: 'freelancer',
    isOnline: true,
  },
];

// Current logged in user
export const CURRENT_USER_ID = 'user-1';

export const MOCK_MESSAGES: Message[] = [
  // Conversation 1 messages (user-1 with user-2)
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'user-2',
    content: 'Hi Sarah! Thanks for reaching out about the web development project. I\'d be happy to discuss the details.',
    timestamp: new Date('2024-01-15T09:00:00'),
    read: true,
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'user-1',
    content: 'Great! I\'m looking for someone to build a responsive e-commerce website. Do you have experience with Next.js and Stripe integration?',
    timestamp: new Date('2024-01-15T09:15:00'),
    read: true,
  },
  {
    id: 'msg-3',
    conversationId: 'conv-1',
    senderId: 'user-2',
    content: 'Absolutely! I\'ve built several e-commerce platforms using Next.js with Stripe. I can share some portfolio examples if you\'d like.',
    timestamp: new Date('2024-01-15T09:30:00'),
    read: true,
  },
  {
    id: 'msg-4',
    conversationId: 'conv-1',
    senderId: 'user-1',
    content: 'That would be perfect! Also, what\'s your estimated timeline for a project of this scope?',
    timestamp: new Date('2024-01-15T10:00:00'),
    read: true,
  },
  {
    id: 'msg-5',
    conversationId: 'conv-1',
    senderId: 'user-2',
    content: 'Based on your requirements, I\'d estimate 6-8 weeks for a fully functional MVP. Here are some examples of my previous work.',
    timestamp: new Date('2024-01-15T10:30:00'),
    read: false,
    attachments: [
      {
        id: 'file-1',
        name: 'portfolio-examples.pdf',
        size: 2456789,
        type: 'application/pdf',
        url: '#',
      },
    ],
  },
  // Conversation 2 messages (user-1 with user-3)
  {
    id: 'msg-6',
    conversationId: 'conv-2',
    senderId: 'user-3',
    content: 'Hello! I saw your project posting for the mobile app design. I have 5+ years of experience in UI/UX design.',
    timestamp: new Date('2024-01-14T14:20:00'),
    read: true,
  },
  {
    id: 'msg-7',
    conversationId: 'conv-2',
    senderId: 'user-1',
    content: 'Hi Emily! Your portfolio looks impressive. Can you share your approach to user research?',
    timestamp: new Date('2024-01-14T15:00:00'),
    read: true,
  },
  {
    id: 'msg-8',
    conversationId: 'conv-2',
    senderId: 'user-3',
    content: 'I typically start with user interviews and competitive analysis, then create user personas and journey maps before moving to wireframes.',
    timestamp: new Date('2024-01-14T15:30:00'),
    read: false,
  },
  // Conversation 3 messages (user-1 with user-5)
  {
    id: 'msg-9',
    conversationId: 'conv-3',
    senderId: 'user-1',
    content: 'Hi Priya! I\'m interested in your proposal for the content writing project. Do you have experience in the tech industry?',
    timestamp: new Date('2024-01-13T11:00:00'),
    read: true,
  },
  {
    id: 'msg-10',
    conversationId: 'conv-3',
    senderId: 'user-5',
    content: 'Yes! I\'ve been writing technical content for SaaS companies for the past 3 years. I can provide samples if needed.',
    timestamp: new Date('2024-01-13T11:30:00'),
    read: true,
  },
  // Conversation 4 messages (user-1 with user-4)
  {
    id: 'msg-11',
    conversationId: 'conv-4',
    senderId: 'user-4',
    content: 'Quick question about the project timeline - can we discuss this week?',
    timestamp: new Date('2024-01-12T16:00:00'),
    read: true,
  },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    participants: [MOCK_USERS[0], MOCK_USERS[1]],
    lastMessage: MOCK_MESSAGES[4],
    unreadCount: 1,
    isMuted: false,
    isStarred: true,
    createdAt: new Date('2024-01-15T09:00:00'),
    updatedAt: new Date('2024-01-15T10:30:00'),
  },
  {
    id: 'conv-2',
    participants: [MOCK_USERS[0], MOCK_USERS[2]],
    lastMessage: MOCK_MESSAGES[7],
    unreadCount: 1,
    isMuted: false,
    isStarred: false,
    createdAt: new Date('2024-01-14T14:20:00'),
    updatedAt: new Date('2024-01-14T15:30:00'),
  },
  {
    id: 'conv-3',
    participants: [MOCK_USERS[0], MOCK_USERS[4]],
    lastMessage: MOCK_MESSAGES[9],
    unreadCount: 0,
    isMuted: false,
    isStarred: true,
    createdAt: new Date('2024-01-13T11:00:00'),
    updatedAt: new Date('2024-01-13T11:30:00'),
  },
  {
    id: 'conv-4',
    participants: [MOCK_USERS[0], MOCK_USERS[3]],
    lastMessage: MOCK_MESSAGES[10],
    unreadCount: 0,
    isMuted: true,
    isStarred: false,
    createdAt: new Date('2024-01-12T16:00:00'),
    updatedAt: new Date('2024-01-12T16:00:00'),
  },
];
