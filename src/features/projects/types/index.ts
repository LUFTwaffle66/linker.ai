import { z } from 'zod';

export const projectPostingSchema = z.object({
  title: z
    .string()
    .min(10, 'Project title must be at least 10 characters')
    .max(100, 'Project title must not exceed 100 characters'),
  category: z
    .string()
    .min(1, 'Please select a category'),
  description: z
    .string()
    .min(100, 'Description must be at least 100 characters')
    .max(5000, 'Description must not exceed 5000 characters'),
  skills: z
    .array(z.string())
    .min(1, 'Please select at least one required skill'),
  budgetType: z.enum(['fixed', 'hourly']),
  budgetAmount: z
    .string()
    .min(1, 'Budget amount is required'),
  timeline: z
    .string()
    .min(1, 'Please select a timeline'),
  location: z.enum(['remote', 'local', 'us-only']),
  attachments: z.array(z.any()).optional(),
  invitedFreelancers: z.array(z.string()).optional(),
});

export type ProjectPostingFormData = z.infer<typeof projectPostingSchema>;

export interface ProjectPosting extends ProjectPostingFormData {
  id?: string;
  clientId?: string;
  status?: 'draft' | 'active' | 'closed';
  createdAt?: Date;
}

export interface FreelancerOption {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  skills: string[];
  hourlyRate: number;
  completedProjects: number;
}
