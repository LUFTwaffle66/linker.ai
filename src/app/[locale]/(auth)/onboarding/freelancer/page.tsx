import { redirect } from 'next/navigation';
import { ensureUserRole } from '@/features/onboarding/actions';
import { FreelancerOnboarding } from '@/features/onboarding/components/freelancer-onboarding';

type FreelancerOnboardingPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function FreelancerOnboardingPage({
  params,
}: FreelancerOnboardingPageProps) {
  const { locale } = await params;
  const result = await ensureUserRole('freelancer');

  if (!result.success) {
    if (result.error === 'Unauthorized') {
      redirect(`/${locale}/login?redirectTo=/${locale}/onboarding/freelancer`);
    }

    throw new Error(`Unable to set user role: ${result.error}`);
  }

  if (result.role !== 'freelancer') {
    redirect(`/${locale}/login?redirectTo=/${locale}/onboarding/freelancer`);
  }

  return <FreelancerOnboarding />;
}
