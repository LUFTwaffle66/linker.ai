'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectPostingForm } from '@/features/projects/components/project-posting-form';
import { paths } from '@/config/paths';

export default function PostProjectPage() {
  const router = useRouter();

  // TODO: Replace with actual authentication check
  // For now, set to false to redirect to login
  const isAuthenticated = true;

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push(paths.auth.login.getHref('/post-project'));
    }
  }, [isAuthenticated, router]);

  // Don't render the component if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <ProjectPostingForm />;
}
