'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, DollarSign, TrendingUp, FileText, Upload } from 'lucide-react';
import { useAuth } from '@/features/auth/lib/auth-client';
import { ProjectHeader } from './project-header';
import { ProjectMessagesTab } from './project-messages-tab';
import { ProjectPaymentTab } from './project-payment-tab';
import { ProjectUpdatesTab } from './project-updates-tab';
import { ProjectProposalsTab } from './project-proposals-tab';
import { ProjectDeliverablesTab } from './project-deliverables-tab';
import { ProjectSidebar } from './project-sidebar';
import { useProject } from '../api/get-project';
import { useProject as useProjectDetails } from '@/features/projects/hooks/use-projects';

interface ActiveProjectViewProps {
  projectId: string;
}

export function ActiveProjectView({ projectId }: ActiveProjectViewProps) {
  const [activeTab, setActiveTab] = useState('messages');
  const { user } = useAuth();
  const { data: project, isLoading } = useProject(projectId);
  const { data: projectDetails } = useProjectDetails(projectId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <p className="text-muted-foreground">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  // Determine user role in project
  const isClient = projectDetails?.client_id === user?.id;
  const isFreelancer = projectDetails?.hired_freelancer_id === user?.id;
  const projectStatus = projectDetails?.status || 'open';

  // Show proposals tab only for clients when project is open (not hired yet)
  const showProposals = isClient && (projectStatus === 'open' || projectStatus === 'draft');
  // Show work tabs (messages, payment, updates) only when project is in progress
  const showWorkTabs = projectStatus === 'in_progress' || projectStatus === 'completed';

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Header */}
        <ProjectHeader project={project} />

        {/* Tabs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Tabs */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className={`grid w-full ${showProposals ? 'grid-cols-1' : 'grid-cols-4'} mb-6`}>
                {showProposals && (
                  <TabsTrigger value="proposals" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="hidden sm:inline">Proposals</span>
                  </TabsTrigger>
                )}
                {showWorkTabs && (
                  <>
                    <TabsTrigger value="messages" className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      <span className="hidden sm:inline">Messages</span>
                    </TabsTrigger>
                    <TabsTrigger value="deliverables" className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      <span className="hidden sm:inline">Deliverables</span>
                    </TabsTrigger>
                    <TabsTrigger value="payment" className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="hidden sm:inline">Payment</span>
                    </TabsTrigger>
                    <TabsTrigger value="updates" className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      <span className="hidden sm:inline">Updates</span>
                    </TabsTrigger>
                  </>
                )}
              </TabsList>

              {/* Proposals Tab - Only for clients with open projects */}
              {showProposals && (
                <TabsContent value="proposals">
                  <ProjectProposalsTab projectId={projectId} isClient={isClient} />
                </TabsContent>
              )}

              {/* Work Tabs - Only when project is in progress */}
              {showWorkTabs && (
                <>
                  {/* Messages Tab */}
                  <TabsContent value="messages">
                    <ProjectMessagesTab projectId={projectId} />
                  </TabsContent>

                  {/* Deliverables Tab */}
                  <TabsContent value="deliverables">
                    <ProjectDeliverablesTab
                      projectId={projectId}
                      isClient={isClient}
                      isFreelancer={isFreelancer}
                      freelancerId={isFreelancer ? user?.id : undefined}
                    />
                  </TabsContent>

                  {/* Payment Tab */}
                  <TabsContent value="payment">
                    <ProjectPaymentTab project={project} />
                  </TabsContent>

                  {/* Updates Tab */}
                  <TabsContent value="updates">
                    <ProjectUpdatesTab projectId={projectId} />
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>

          {/* Sidebar */}
          <ProjectSidebar project={project} />
        </div>
      </div>
    </div>
  );
}
