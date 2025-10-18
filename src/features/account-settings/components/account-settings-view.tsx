'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Lock, Bell, Globe } from 'lucide-react';
import { ProfilePictureSection } from './profile-picture-section';
import { PersonalInfoSection } from './personal-info-section';
import { AccountInfoSection } from './account-info-section';
import { ChangePasswordSection } from './change-password-section';
import { TwoFactorSection } from './two-factor-section';
import { ActiveSessionsSection } from './active-sessions-section';
import { EmailNotificationsSection } from './email-notifications-section';
import { PushNotificationsSection } from './push-notifications-section';
import { RegionalSettingsSection } from './regional-settings-section';
import { PrivacySettingsSection } from './privacy-settings-section';
import { useUserProfile } from '../hooks';

export function AccountSettingsView() {
  const [activeTab, setActiveTab] = useState('profile');
  const { data: profile, isLoading } = useUserProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <p className="text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <p className="text-muted-foreground">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="gap-2">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Preferences</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <ProfilePictureSection profile={profile} />
            <PersonalInfoSection profile={profile} />
            <AccountInfoSection profile={profile} />
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <ChangePasswordSection />
            <TwoFactorSection />
            <ActiveSessionsSection />
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <EmailNotificationsSection />
            <PushNotificationsSection />
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <RegionalSettingsSection />
            <PrivacySettingsSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
