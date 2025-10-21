import { ActiveProjectView } from '@/features/active-projects';

interface ProjectPageProps {
  params: {
    projectId: string;
  };
}

export default function ProjectPage({ params }: any) {
  return <ActiveProjectView projectId={params?.projectId} />;
}
