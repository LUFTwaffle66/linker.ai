import { z } from 'zod';

export type UserType = 'contractor' | 'client';
export type ProfileVisibility = 'public' | 'members' | 'private';
export type DateFormat = 'mdy' | 'dmy' | 'ymd';
export type TimeFormat = '12h' | '24h';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  timezone: string;
  role: string;
  userType: UserType;
  avatar?: string;
  joined: string;
  isEmailVerified: boolean;
  title?: string;
  bio?: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  activeSessions: SessionInfo[];
}

export interface SessionInfo {
  id: string;
  device: string;
  location: string;
  isCurrent: boolean;
  lastActive: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  projectAlerts: boolean;
  messageNotifications: boolean;
  marketingEmails: boolean;
}

export interface PreferenceSettings {
  language: string;
  timezone: string;
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  profileVisibility: ProfileVisibility;
  showOnlineStatus: boolean;
  showWorkHistory: boolean;
}

// Zod Schemas
export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  location: z.string().optional(),
  title: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
});

export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/[a-z]/, 'Password must contain a lowercase letter')
      .regex(/[0-9]/, 'Password must contain a number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

export const twoFactorSetupSchema = z.object({
  verificationCode: z.string().length(6, 'Code must be 6 digits'),
});

export type TwoFactorSetupFormData = z.infer<typeof twoFactorSetupSchema>;

export const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  projectAlerts: z.boolean(),
  messageNotifications: z.boolean(),
  marketingEmails: z.boolean(),
});

export type NotificationSettingsFormData = z.infer<typeof notificationSettingsSchema>;

export const preferenceSettingsSchema = z.object({
  language: z.string(),
  timezone: z.string(),
  dateFormat: z.enum(['mdy', 'dmy', 'ymd']),
  timeFormat: z.enum(['12h', '24h']),
  profileVisibility: z.enum(['public', 'members', 'private']),
  showOnlineStatus: z.boolean(),
  showWorkHistory: z.boolean(),
});

export type PreferenceSettingsFormData = z.infer<typeof preferenceSettingsSchema>;
