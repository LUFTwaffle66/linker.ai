import { ActiveProjectView } from '@/features/active-projects';

interface ProjectPageProps {
  params: Promise<{
    projectId: string;
    locale: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;
  return <ActiveProjectView projectId={projectId} />;
}
