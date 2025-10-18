import type {
  UserProfile,
  SecuritySettings,
  NotificationSettings,
  PreferenceSettings,
} from '../types';

export const CURRENT_USER_ID = 'user-1';

export const MOCK_USER_PROFILE: UserProfile = {
  id: CURRENT_USER_ID,
  name: 'Devansh Tiwari',
  email: 'devansh@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  timezone: 'America/Los_Angeles',
  role: 'AI Expert',
  userType: 'contractor',
  joined: 'January 2024',
  isEmailVerified: true,
  title: 'Senior AI/ML Engineer',
  bio: 'Passionate AI engineer with 5+ years of experience in building intelligent automation solutions. Specialized in NLP, computer vision, and workflow automation.',
};

export const MOCK_SECURITY_SETTINGS: SecuritySettings = {
  twoFactorEnabled: false,
  activeSessions: [
    {
      id: 'session-1',
      device: 'Chrome on MacBook Pro',
      location: 'San Francisco, CA',
      isCurrent: true,
      lastActive: 'Active now',
    },
    {
      id: 'session-2',
      device: 'Safari on iPhone 14',
      location: 'San Francisco, CA',
      isCurrent: false,
      lastActive: '2 hours ago',
    },
  ],
};

export const MOCK_NOTIFICATION_SETTINGS: NotificationSettings = {
  emailNotifications: true,
  pushNotifications: true,
  projectAlerts: true,
  messageNotifications: true,
  marketingEmails: false,
};

export const MOCK_PREFERENCE_SETTINGS: PreferenceSettings = {
  language: 'en',
  timezone: 'pst',
  dateFormat: 'mdy',
  timeFormat: '12h',
  profileVisibility: 'public',
  showOnlineStatus: true,
  showWorkHistory: true,
};
