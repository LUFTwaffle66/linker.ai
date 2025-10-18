'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { preferenceSettingsSchema, type PreferenceSettingsFormData } from '../types';
import { usePreferenceSettings, useUpdatePreferenceSettings } from '../hooks';
import { toast } from 'sonner';

export function PrivacySettingsSection() {
  const { data: settings } = usePreferenceSettings();
  const updateSettings = useUpdatePreferenceSettings();

  const form = useForm<PreferenceSettingsFormData>({
    resolver: zodResolver(preferenceSettingsSchema),
    defaultValues: settings,
  });

  useEffect(() => {
    if (settings) {
      form.reset(settings);
    }
  }, [settings, form]);

  const onSubmit = async (data: PreferenceSettingsFormData) => {
    updateSettings.mutate(data, {
      onSuccess: () => {
        toast.success('Privacy settings saved successfully!');
      },
      onError: () => {
        toast.error('Failed to update privacy settings');
      },
    });
  };

  if (!settings) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
        <CardDescription>Control your profile visibility and data sharing</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="profileVisibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Visibility</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="public">Public - Visible to everyone</SelectItem>
                      <SelectItem value="members">
                        Members Only - Visible to LinkerAI members
                      </SelectItem>
                      <SelectItem value="private">Private - Only visible to you</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">Show Online Status</p>
                <p className="text-sm text-muted-foreground">Let others see when you're online</p>
              </div>
              <Switch
                checked={form.watch('showOnlineStatus')}
                onCheckedChange={(checked) => form.setValue('showOnlineStatus', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">Show Work History</p>
                <p className="text-sm text-muted-foreground">
                  Display completed projects on your profile
                </p>
              </div>
              <Switch
                checked={form.watch('showWorkHistory')}
                onCheckedChange={(checked) => form.setValue('showWorkHistory', checked)}
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
