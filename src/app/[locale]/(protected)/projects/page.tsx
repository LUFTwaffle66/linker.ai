import type { Metadata } from 'next';
import { ProjectsClient } from './client';

export const metadata: Metadata = {
  title: 'My Projects | LinkerAI',
  description:
    'Manage your active and completed projects. Track progress, communicate with clients, and deliver quality work.',
  openGraph: {
    title: 'My Projects | LinkerAI',
    description:
      'Manage your active and completed projects. Track progress, communicate with clients, and deliver quality work.',
    type: 'website',
  },
};

export default function ProjectsPage() {
  return <ProjectsClient />;
}
