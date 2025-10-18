'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Form } from '@/components/ui/form';
import {
  notificationSettingsSchema,
  type NotificationSettingsFormData,
} from '../types';
import { useNotificationSettings, useUpdateNotificationSettings } from '../hooks';
import { toast } from 'sonner';

export function EmailNotificationsSection() {
  const { data: settings } = useNotificationSettings();
  const updateSettings = useUpdateNotificationSettings();

  const form = useForm<NotificationSettingsFormData>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: settings,
  });

  useEffect(() => {
    if (settings) {
      form.reset(settings);
    }
  }, [settings, form]);

  const emailNotifications = form.watch('emailNotifications');

  const onSubmit = async (data: NotificationSettingsFormData) => {
    updateSettings.mutate(data, {
      onSuccess: () => {
        toast.success('Email Notification settings saved successfully!');
      },
      onError: () => {
        toast.error('Failed to update notification settings');
      },
    });
  };

  if (!settings) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Notifications</CardTitle>
        <CardDescription>Choose what updates you'd like to receive via email</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">All Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive all email updates and alerts</p>
              </div>
              <Switch
                checked={form.watch('emailNotifications')}
                onCheckedChange={(checked) => form.setValue('emailNotifications', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">Project Alerts</p>
                <p className="text-sm text-muted-foreground">New projects matching your skills</p>
              </div>
              <Switch
                checked={form.watch('projectAlerts')}
                onCheckedChange={(checked) => form.setValue('projectAlerts', checked)}
                disabled={!emailNotifications}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">Message Notifications</p>
                <p className="text-sm text-muted-foreground">When you receive new messages</p>
              </div>
              <Switch
                checked={form.watch('messageNotifications')}
                onCheckedChange={(checked) => form.setValue('messageNotifications', checked)}
                disabled={!emailNotifications}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">Marketing Emails</p>
                <p className="text-sm text-muted-foreground">
                  Tips, updates, and promotional content
                </p>
              </div>
              <Switch
                checked={form.watch('marketingEmails')}
                onCheckedChange={(checked) => form.setValue('marketingEmails', checked)}
                disabled={!emailNotifications}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="submit" disabled={updateSettings.isPending}>
                {updateSettings.isPending ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
