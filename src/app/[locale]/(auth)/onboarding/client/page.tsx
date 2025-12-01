import { redirect } from 'next/navigation';
import { ensureUserRole } from '@/features/onboarding/actions';
import { ClientOnboarding } from '@/features/onboarding/components/client-onboarding';

type ClientOnboardingPageProps = {
  params: { locale: string };
};

export default async function ClientOnboardingPage({ params }: ClientOnboardingPageProps) {
  const locale = params.locale;
  const result = await ensureUserRole('client');

  if (!result.success) {
    redirect(`/${locale}/login?redirectTo=/${locale}/onboarding/client`);
  }

  return <ClientOnboarding />;
}
