import type {
  UserProfile,
  SecuritySettings,
  NotificationSettings,
  PreferenceSettings,
  ProfileUpdateFormData,
  PasswordChangeFormData,
  NotificationSettingsFormData,
  PreferenceSettingsFormData,
} from '../types';
import {
  MOCK_USER_PROFILE,
  MOCK_SECURITY_SETTINGS,
  MOCK_NOTIFICATION_SETTINGS,
  MOCK_PREFERENCE_SETTINGS,
} from './mock-data';

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
let userProfile = { ...MOCK_USER_PROFILE };
let securitySettings = { ...MOCK_SECURITY_SETTINGS };
let notificationSettings = { ...MOCK_NOTIFICATION_SETTINGS };
let preferenceSettings = { ...MOCK_PREFERENCE_SETTINGS };

/**
 * Get user profile
 */
export const getUserProfile = async (): Promise<UserProfile> => {
  await simulateDelay();
  return userProfile;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  data: Partial<ProfileUpdateFormData>
): Promise<UserProfile> => {
  await simulateDelay(800);

  userProfile = {
    ...userProfile,
    ...data,
  };

  return userProfile;
};

/**
 * Upload profile picture
 */
export const uploadProfilePicture = async (file: File): Promise<string> => {
  await simulateDelay(1000);

  // Simulate file upload and return URL
  const avatarUrl = URL.createObjectURL(file);
  userProfile.avatar = avatarUrl;

  return avatarUrl;
};

/**
 * Remove profile picture
 */
export const removeProfilePicture = async (): Promise<void> => {
  await simulateDelay(500);
  userProfile.avatar = undefined;
};

/**
 * Get security settings
 */
export const getSecuritySettings = async (): Promise<SecuritySettings> => {
  await simulateDelay();
  return securitySettings;
};

/**
 * Change password
 */
export const changePassword = async (data: PasswordChangeFormData): Promise<void> => {
  await simulateDelay(800);

  // Simulate password validation
  if (data.currentPassword !== 'correct-password') {
    throw new ApiError(400, 'Current password is incorrect');
  }

  // Password changed successfully
};

/**
 * Enable two-factor authentication
 */
export const enableTwoFactor = async (verificationCode: string): Promise<void> => {
  await simulateDelay(800);

  if (verificationCode !== '123456') {
    throw new ApiError(400, 'Invalid verification code');
  }

  securitySettings.twoFactorEnabled = true;
};

/**
 * Disable two-factor authentication
 */
export const disableTwoFactor = async (): Promise<void> => {
  await simulateDelay(500);
  securitySettings.twoFactorEnabled = false;
};

/**
 * Revoke session
 */
export const revokeSession = async (sessionId: string): Promise<void> => {
  await simulateDelay(500);

  securitySettings.activeSessions = securitySettings.activeSessions.filter(
    (s) => s.id !== sessionId
  );
};

/**
 * Get notification settings
 */
export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  await simulateDelay();
  return notificationSettings;
};

/**
 * Update notification settings
 */
export const updateNotificationSettings = async (
  data: Partial<NotificationSettingsFormData>
): Promise<NotificationSettings> => {
  await simulateDelay(500);

  notificationSettings = {
    ...notificationSettings,
    ...data,
  };

  return notificationSettings;
};

/**
 * Get preference settings
 */
export const getPreferenceSettings = async (): Promise<PreferenceSettings> => {
  await simulateDelay();
  return preferenceSettings;
};

/**
 * Update preference settings
 */
export const updatePreferenceSettings = async (
  data: Partial<PreferenceSettingsFormData>
): Promise<PreferenceSettings> => {
  await simulateDelay(500);

  preferenceSettings = {
    ...preferenceSettings,
    ...data,
  };

  return preferenceSettings;
};
