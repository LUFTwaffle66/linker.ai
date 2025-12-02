import { redirect } from 'next/navigation';
import { ensureUserRole } from '@/features/onboarding/actions';
import { ClientOnboarding } from '@/features/onboarding/components/client-onboarding';

type ClientOnboardingPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ClientOnboardingPage({ params }: ClientOnboardingPageProps) {
  const { locale } = await params;
  const result = await ensureUserRole('client');

  if (!result.success) {
    if (result.error === 'Unauthorized') {
      redirect(`/${locale}/login?redirectTo=/${locale}/onboarding/client`);
    }

    throw new Error(`Unable to set user role: ${result.error}`);
  }

  if (result.role !== 'client') {
    redirect(`/${locale}/login?redirectTo=/${locale}/onboarding/client`);
  }

  return <ClientOnboarding />;
}
