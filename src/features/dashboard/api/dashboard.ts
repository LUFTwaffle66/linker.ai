import { supabase } from '@/lib/supabase';
import type { FreelancerDashboardData } from '../components/freelancer-dashboard';
import type { ClientDashboardData } from '../components/client-dashboard';
import type { ActivityItem } from '../components/recent-activity-card';
import type { Proposal } from '@/features/proposals/types';

type DashboardProposal = Proposal & {
  total_budget: number;
  created_at: string;
  project_id: string;
  status: string;
  timeline?: string;
  project?: {
    id?: string;
    title?: string;
    client?: { full_name?: string } | null;
  } | null;
  freelancer?: { full_name?: string; avatar_url?: string } | null;
};

/**
 * Fetch freelancer dashboard data
 */
export async function getFreelancerDashboard(userId: string): Promise<FreelancerDashboardData> {
  // Fetch proposals
  const { data: proposals } = await supabase
    .from('proposals')
    .select(`
      *,
      project:projects(*)
    `)
    .eq('freelancer_id', userId)
    .order('created_at', { ascending: false });

  const proposalsList = (proposals || []) as DashboardProposal[];

  // Calculate metrics
  const totalProposals = proposalsList.length;
  const acceptedProposals = proposalsList.filter((p) => p.status === 'accepted').length || 0;
  const pendingProposals = proposalsList.filter((p) => p.status === 'submitted' || p.status === 'under_review').length || 0;
  const successRate = totalProposals > 0 ? Math.round((acceptedProposals / totalProposals) * 100) : 0;

  // Mock data for now (will be replaced with real data)
  const totalEarnings = acceptedProposals * 5000; // Mock calculation
  const activeProjects = acceptedProposals;
  const completedProjects = 0; // TODO: Track completed projects

  // Recent proposals
  const recentProposals = proposalsList.slice(0, 5).map((p: DashboardProposal) => ({
    id: p.id,
    projectTitle: p.project?.title || 'Unknown Project',
    amount: p.total_budget,
    status: p.status,
    submittedAt: new Date(p.created_at),
  }));

  // Recent activities
  const recentActivities: ActivityItem[] = proposalsList.slice(0, 10).map((p: DashboardProposal) => ({
    id: p.id,
    title: `Proposal ${p.status}`,
    description: `Your proposal for "${p.project?.title}" was ${p.status}`,
    timestamp: new Date(p.created_at),
    type: 'proposal' as const,
    status: p.status,
  }));

  // Active projects list (mock for now)
  const activeProjectsList = proposalsList
    .filter((p: DashboardProposal) => p.status === 'accepted')
    .slice(0, 3)
    .map((p: DashboardProposal) => ({
      id: p.project?.id || '',
      title: p.project?.title || 'Unknown Project',
      client: p.project?.client?.full_name || 'Client',
      budget: p.total_budget,
      deadline: p.timeline,
      progress: 50, // Mock progress
    }));

  return {
    totalEarnings,
    activeProjects,
    proposalsSent: totalProposals,
    successRate,
    pendingProposals,
    completedProjects,
    recentActivities,
    recentProposals,
    activeProjectsList,
  };
}

/**
 * Fetch client dashboard data
 */
export async function getClientDashboard(userId: string): Promise<ClientDashboardData> {
  // Fetch projects
  const { data: projects } = await supabase
    .from('projects')
    .select(`
      *,
      proposals:proposals(
        *,
        freelancer:profiles!proposals_freelancer_id_fkey(
          id,
          clerk_user_id,
          full_name,
          avatar_url
        )
      )
    `)
    .eq('client_id', userId)
    .order('created_at', { ascending: false });

  const projectsList = projects || [];

  // Calculate metrics
  const totalProjects = projectsList.length || 0;
  const activeProjects = projectsList.filter((p) => p.status === 'open' || p.status === 'in_progress').length || 0;
  const completedProjects = projectsList.filter((p) => p.status === 'completed').length || 0;
  const allProposals = (projectsList.flatMap((p) => p.proposals || []) || []) as DashboardProposal[];
  const proposalsReceived = allProposals.length;
  const pendingProposals = allProposals.filter((p: DashboardProposal) => p.status === 'submitted' || p.status === 'under_review').length;

  // Mock total spent calculation
  const totalSpent = completedProjects * 8000; // Mock calculation
  const totalFreelancersHired = allProposals.filter((p: DashboardProposal) => p.status === 'accepted').length;

  // Active projects list
  const activeProjectsList = projectsList
    .filter((p) => p.status === 'open' || p.status === 'in_progress')
    .slice(0, 3)
    .map((p) => ({
      id: p.id,
      title: p.title,
      budget: p.fixed_budget,
      proposalCount: p.proposals?.length || 0,
      status: p.status,
      postedAt: new Date(p.created_at),
    }));

  // Recent proposals
  const recentProposalsList = allProposals
    .slice(0, 5)
    .map((p: DashboardProposal) => ({
      id: p.id,
      projectId: p.project_id,
      projectTitle: projectsList.find((proj) => proj.id === p.project_id)?.title || 'Unknown Project',
      freelancerName: p.freelancer?.full_name || 'Unknown Freelancer',
      freelancerAvatar: p.freelancer?.avatar_url,
      amount: p.total_budget,
      status: p.status,
      submittedAt: new Date(p.created_at),
    }));

  // Recent activities
  const recentActivities: ActivityItem[] = [
    ...allProposals.slice(0, 5).map((p: DashboardProposal) => ({
      id: p.id,
      title: 'New Proposal Received',
      description: `${p.freelancer?.full_name || 'A freelancer'} submitted a proposal`,
      timestamp: new Date(p.created_at),
      type: 'proposal' as const,
      status: p.status,
    })),
    ...projectsList.slice(0, 5).map((p) => ({
      id: p.id,
      title: 'Project Posted',
      description: `Your project "${p.title}" was posted`,
      timestamp: new Date(p.created_at),
      type: 'project' as const,
      status: p.status,
    })),
  ]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 10);

  return {
    totalSpent,
    activeProjects,
    totalFreelancersHired,
    projectsCompleted: completedProjects,
    proposalsReceived,
    pendingProposals,
    recentActivities,
    activeProjectsList,
    recentProposalsList,
  };
}
