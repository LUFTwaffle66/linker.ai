// Components
export { AccountSettingsView } from './components/account-settings-view';
export { ProfilePictureSection } from './components/profile-picture-section';
export { PersonalInfoSection } from './components/personal-info-section';
export { AccountInfoSection } from './components/account-info-section';
export { ChangePasswordSection } from './components/change-password-section';
export { TwoFactorSection } from './components/two-factor-section';
export { ActiveSessionsSection } from './components/active-sessions-section';
export { EmailNotificationsSection } from './components/email-notifications-section';
export { PushNotificationsSection } from './components/push-notifications-section';
export { RegionalSettingsSection } from './components/regional-settings-section';
export { PrivacySettingsSection } from './components/privacy-settings-section';

// Hooks
export {
  useUserProfile,
  useUpdateProfile,
  useUploadProfilePicture,
  useRemoveProfilePicture,
  useSecuritySettings,
  useChangePassword,
  useEnableTwoFactor,
  useDisableTwoFactor,
  useRevokeSession,
  useNotificationSettings,
  useUpdateNotificationSettings,
  usePreferenceSettings,
  useUpdatePreferenceSettings,
  settingsKeys,
} from './hooks';

// Types
export type {
  UserProfile,
  UserType,
  SecuritySettings,
  SessionInfo,
  NotificationSettings,
  PreferenceSettings,
  ProfileVisibility,
  DateFormat,
  TimeFormat,
  ProfileUpdateFormData,
  PasswordChangeFormData,
  TwoFactorSetupFormData,
  NotificationSettingsFormData,
  PreferenceSettingsFormData,
} from './types';

// API
export { getUserProfile, updateUserProfile, getSecuritySettings } from './api/settings';
