'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useSecuritySettings, useEnableTwoFactor, useDisableTwoFactor } from '../hooks';
import { toast } from 'sonner';

export function TwoFactorSection() {
  const { data: securitySettings } = useSecuritySettings();
  const enableTwoFactor = useEnableTwoFactor();
  const disableTwoFactor = useDisableTwoFactor();

  const handleToggle = (enabled: boolean) => {
    if (enabled) {
      // In a real app, this would show a modal/dialog for setup
      const code = prompt('Enter verification code from your authenticator app:');
      if (code) {
        enableTwoFactor.mutate(code, {
          onSuccess: () => {
            toast.success('Two-Factor Authentication settings saved successfully!');
          },
          onError: () => {
            toast.error('Invalid verification code');
          },
        });
      }
    } else {
      disableTwoFactor.mutate(undefined, {
        onSuccess: () => {
          toast.success('Two-factor authentication disabled');
        },
        onError: () => {
          toast.error('Failed to disable two-factor authentication');
        },
      });
    }
  };

  if (!securitySettings) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Two-Factor Authentication</CardTitle>
        <CardDescription>Add an extra layer of security to your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-medium">Enable 2FA</p>
            <p className="text-sm text-muted-foreground">
              Require a verification code in addition to your password
            </p>
          </div>
          <Switch
            checked={securitySettings.twoFactorEnabled}
            onCheckedChange={handleToggle}
            disabled={enableTwoFactor.isPending || disableTwoFactor.isPending}
          />
        </div>

        {securitySettings.twoFactorEnabled && (
          <div className="p-4 bg-muted rounded-lg space-y-3">
            <p className="text-sm font-medium">Setup Instructions</p>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Download an authenticator app (Google Authenticator, Authy)</li>
              <li>Scan the QR code below with your app</li>
              <li>Enter the 6-digit code from your app to verify</li>
            </ol>
            <div className="flex justify-center py-4">
              <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center border">
                <p className="text-sm text-muted-foreground">QR Code</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
