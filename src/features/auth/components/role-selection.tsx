'use client';

import Link from 'next/link';
import { Briefcase, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface RoleSelectionProps {
  locale: string;
}

export function RoleSelection({ locale }: RoleSelectionProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-4xl space-y-8">
        <div className="space-y-3 text-center text-white">
          <h1 className="text-4xl font-bold">Join Linker</h1>
          <p className="text-lg text-slate-300">
            Choose how you want to use the platform
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link href={`/${locale}/signup?type=freelancer`}>
            <Card className="group cursor-pointer border-2 border-slate-700 bg-slate-900/70 p-8 transition-all hover:border-blue-500 hover:bg-slate-900 hover:shadow-xl hover:shadow-blue-500/20">
              <div className="space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 transition-all group-hover:bg-blue-500 group-hover:text-white">
                  <Briefcase className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white">I'm a Freelancer</h2>
                  <p className="text-slate-400">
                    Find projects, submit proposals, and grow your freelance business with AI-powered tools.
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    Browse and apply to projects
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    Build your professional portfolio
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    Get paid securely for your work
                  </li>
                </ul>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  Continue as Freelancer
                </Button>
              </div>
            </Card>
          </Link>

          <Link href={`/${locale}/signup?type=client`}>
            <Card className="group cursor-pointer border-2 border-slate-700 bg-slate-900/70 p-8 transition-all hover:border-green-500 hover:bg-slate-900 hover:shadow-xl hover:shadow-green-500/20">
              <div className="space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 text-green-500 transition-all group-hover:bg-green-500 group-hover:text-white">
                  <Users className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white">I'm a Client</h2>
                  <p className="text-slate-400">
                    Post projects, hire talented freelancers, and manage your team efficiently.
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Post projects and receive proposals
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Hire and manage freelancers
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Track project progress and payments
                  </li>
                </ul>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  Continue as Client
                </Button>
              </div>
            </Card>
          </Link>
        </div>

        <div className="text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link
            href={`/${locale}/login`}
            className="font-medium text-blue-400 hover:text-blue-300"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
