import { useAuth } from '@/features/auth/lib/auth-client';
import { FreelancerProfile, useFreelancerProfile } from '@/features/profiles';

interface FreelancerProfilePageProps {
  params: Promise<{
    freelancerId: string;
    locale: string;
  }>;
}

export default async function FreelancerProfilePage({ params }: FreelancerProfilePageProps) {
  const { freelancerId } = await params;

  return <FreelancerProfilePageClient freelancerId={freelancerId} />;
}

function FreelancerProfilePageClient({ freelancerId }: { freelancerId: string }) {
  'use client';

  const { user } = useAuth();
  const { data, isLoading, error } = useFreelancerProfile(freelancerId);

  // Check if the logged-in user is viewing their own profile
  const isOwnProfile = user?.id === freelancerId;

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
            {error instanceof Error ? error.message : 'Failed to load freelancer profile'}
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return <FreelancerProfile profile={data} freelancerId={freelancerId} isOwnProfile={isOwnProfile} />;
}
