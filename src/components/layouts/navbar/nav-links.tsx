'use client';

import { Link } from '@/i18n/routing';
import { paths } from '@/config/paths';
import { useAuth } from '@/features/auth/lib/auth-client';

export function NavLinks() {
  const { user } = useAuth();

  return (
    <div className="hidden md:flex items-center space-x-6 ml-8">
      <Link
        href={paths.public.findWork.getHref()}
        className="text-foreground hover:text-primary transition-colors"
      >
        Find Work
      </Link>
      <Link
        href={paths.public.findExperts.getHref()}
        className="text-foreground hover:text-primary transition-colors"
      >
        Find AI Experts
      </Link>
      {user?.role === 'client' && (
        <Link
          href={paths.app.postProject.getHref()}
          className="text-foreground hover:text-primary transition-colors font-medium"
        >
          Post Project
        </Link>
      )}
    </div>
  );
}
