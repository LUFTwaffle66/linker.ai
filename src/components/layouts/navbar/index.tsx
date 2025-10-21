'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from '@/i18n/routing';
import { HelpCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';
import { Logo } from './logo';
import { NavLinks } from './nav-links';
import { SearchBar } from './search-bar';
import { LanguageSwitcher } from './language-switcher';
import { NotificationsDropdown } from './notifications-dropdown';
import { ProfileDropdown } from './profile-dropdown';
import { MobileMenu } from './mobile-menu';

export function Navigation() {
  const router = useRouter();
  const { status } = useSession();
  const isLoggedIn = status === 'authenticated';

  return (
    <nav className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Logo />
            <NavLinks />
          </div>

          <SearchBar />

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div className="hidden md:flex items-center space-x-3">
                  <Button variant="ghost" size="icon" onClick={() => router.push(paths.public.help.getHref())}>
                    <HelpCircle className="w-5 h-5" />
                  </Button>
                  <NotificationsDropdown />
                  <Button variant="ghost" size="icon" onClick={() => router.push(paths.app.messages.getHref())}>
                    <MessageSquare className="w-5 h-5" />
                  </Button>
                </div>
                <LanguageSwitcher />
                <ProfileDropdown />
              </>
            ) : (
              <>
                <LanguageSwitcher />
                <Button
                  variant="ghost"
                  className="hidden md:inline-flex"
                  onClick={() => router.push(paths.auth.login.getHref())}
                >
                  Log In
                </Button>
                <Button className="hidden md:inline-flex" onClick={() => router.push(paths.auth.signup.getHref())}>
                  Sign Up
                </Button>
              </>
            )}
            <MobileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
