export interface Project {
  id: number;
  title: string;
  category: string;
  budget: string;
  timeline: string;
  description: string;
  skills: string[];
  postedDate: string;
  proposals: number;
  client: {
    name: string;
    rating: number;
    verified: boolean;
    spent: string;
  };
  fullDescription?: string;
  deliverables?: string[];
  experienceLevel?: string;
  projectType?: string;
  location?: string;
  connects?: number;
}

export interface Expert {
  id: number;
  name: string;
  title: string;
  hourlyRate: string;
  rating: number;
  reviews: number;
  skills: string[];
  location: string;
  available: boolean;
  avatar: string;
  verified: boolean;
  topRated: boolean;
  completedProjects: number;
  certification: string;
  description: string;
  portfolio?: string[];
  languages?: string[];
  successRate?: number;
  responseTime?: string;
}
