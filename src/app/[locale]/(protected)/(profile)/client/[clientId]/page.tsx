import { useAuth } from '@/features/auth/lib/auth-client';
import { ClientProfile, useClientProfile } from '@/features/profiles';

interface ClientProfilePageProps {
  params: Promise<{
    clientId: string;
    locale: string;
  }>;
}

export default async function ClientProfilePage({ params }: ClientProfilePageProps) {
  const { clientId } = await params;

  return <ClientProfilePageClient clientId={clientId} />;
}

function ClientProfilePageClient({ clientId }: { clientId: string }) {
  'use client';

  const { user } = useAuth();
  const { data, isLoading, error } = useClientProfile(clientId);

  // Check if the logged-in user is viewing their own profile
  const isOwnProfile = user?.id === clientId;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : 'Failed to load client profile'}
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return <ClientProfile profile={data} clientId={clientId} isOwnProfile={isOwnProfile} />;
}
