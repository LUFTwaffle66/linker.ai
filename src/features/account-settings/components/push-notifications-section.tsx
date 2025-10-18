'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useNotificationSettings, useUpdateNotificationSettings } from '../hooks';
import { toast } from 'sonner';

export function PushNotificationsSection() {
  const { data: settings } = useNotificationSettings();
  const updateSettings = useUpdateNotificationSettings();

  const handleToggle = (checked: boolean) => {
    updateSettings.mutate(
      { pushNotifications: checked },
      {
        onSuccess: () => {
          toast.success('Push Notification settings saved successfully!');
        },
        onError: () => {
          toast.error('Failed to update push notification settings');
        },
      }
    );
  };

  if (!settings) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Push Notifications</CardTitle>
        <CardDescription>Manage browser and mobile push notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-medium">Enable Push Notifications</p>
            <p className="text-sm text-muted-foreground">Receive instant alerts on this device</p>
          </div>
          <Switch
            checked={settings.pushNotifications}
            onCheckedChange={handleToggle}
            disabled={updateSettings.isPending}
          />
        </div>
      </CardContent>
    </Card>
  );
}
