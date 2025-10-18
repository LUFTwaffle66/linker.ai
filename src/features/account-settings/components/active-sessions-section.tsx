'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useSecuritySettings, useRevokeSession } from '../hooks';
import { toast } from 'sonner';

export function ActiveSessionsSection() {
  const { data: securitySettings } = useSecuritySettings();
  const revokeSession = useRevokeSession();

  const handleRevoke = (sessionId: string) => {
    revokeSession.mutate(sessionId, {
      onSuccess: () => {
        toast.success('Session revoked successfully');
      },
      onError: () => {
        toast.error('Failed to revoke session');
      },
    });
  };

  if (!securitySettings) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Sessions</CardTitle>
        <CardDescription>Manage devices where you're currently logged in</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {securitySettings.activeSessions.map((session, index) => (
          <div key={session.id}>
            {index > 0 && <Separator className="my-4" />}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="font-medium flex items-center gap-2">
                  {session.device}
                  {session.isCurrent && (
                    <Badge variant="secondary" className="text-xs">
                      Current
                    </Badge>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">{session.location}</p>
                <p className="text-sm text-muted-foreground">{session.lastActive}</p>
              </div>
              {!session.isCurrent && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleRevoke(session.id)}
                  disabled={revokeSession.isPending}
                >
                  Revoke
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
