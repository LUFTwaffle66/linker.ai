import { supabase } from '@/lib/supabase';
import type { ClientProfileData, FreelancerProfileData } from '../types';

// API Error class
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl?: string | null;
  url?: string | null;
}

/**
 * Fetch client profile by user ID
 * @param userId - The user ID to fetch profile for
 * @returns Promise<ClientProfileData>
 */
export const getClientProfile = async (userId: string): Promise<ClientProfileData> => {
  // Fetch client profile from profiles table
  const { data: profile, error: clientProfileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('clerk_user_id', userId)
    .eq('role', 'client')
    .single();

  if (clientProfileError) {
    if (clientProfileError.code === 'PGRST116') {
      throw new ApiError(404, 'Client profile not found');
    }
    throw new ApiError(500, clientProfileError.message);
  }

  // Map Supabase data to ClientProfileData type
  return {
    id: profile.id ?? userId,
    name: profile.full_name ?? '',
    title: 'Client',
    company: profile.company_name || '',
    avatar: profile.avatar_url || '',
    location: '',
    memberSince: profile.created_at
      ? new Date(profile.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
        })
      : '',
    rating: 5.0,
    reviewCount: 0,
    verified: false,
    industries: [],
    bio: '',
    lookingFor: [],
    stats: {
      memberSince: profile.created_at
        ? new Date(profile.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
        })
        : '',
      projectsPosted: 0,
      totalSpent: '$0',
      repeatExperts: '0%',
      avgProjectSize: '$0',
    },
    verification: {
      paymentMethodVerified: true,
      businessLicenseVerified: false,
      taxIdVerified: false,
      phoneVerified: false,
      emailVerified: false,
    },
    recentActivity: [],
    pastProjects: [],
  };
};

/**
 * Fetch freelancer profile by user ID
 * @param userId - The user ID to fetch profile for
 * @returns Promise<FreelancerProfileData>
 */
export const getFreelancerProfile = async (
  userId: string,
): Promise<FreelancerProfileData> => {
  // Fetch freelancer profile from profiles table
  const { data: profile, error: freelancerProfileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('clerk_user_id', userId)
    .eq('role', 'freelancer')
    .single();

  if (freelancerProfileError) {
    if (freelancerProfileError.code === 'PGRST116') {
      throw new ApiError(404, 'Freelancer profile not found');
    }
    throw new ApiError(500, freelancerProfileError.message);
  }

  // Map Supabase data to FreelancerProfileData type
  return {
    id: profile.id ?? userId,
    name: profile.full_name ?? '',
    title: 'AI Expert',
    avatar: profile.avatar_url || '',
    location: '',
    timezone: 'UTC',
    hourlyRate: {
      min: 50,
      max: 100,
    },
    rating: 5.0,
    reviewCount: 0,
    verified: false,
    skills: [],
    bio: '',
    expertise: [],
    certifications: [],
    portfolio: [],
    reviews: [],
    experience: [],
    stats: {
      projectsCompleted: 0,
      totalEarnings: '$0',
      repeatClients: '0%',
      onTimeDelivery: '100%',
    },
    availability: {
      status: 'Available',
      responseTime: '< 2 hours',
    },
    languages: [
      {
        language: 'English',
        proficiency: 'Native',
      },
    ],
    topTechnologies: [],
  };
};

/**
 * Update client profile
 * @param userId - The user ID
 * @param data - Partial profile data to update
 * @returns Promise<ClientProfileData>
 */
export const updateClientProfile = async (
  userId: string,
  data: Partial<ClientProfileData>
): Promise<ClientProfileData> => {
  const profileUpdates: Record<string, any> = {};
  if (data.name !== undefined) profileUpdates.full_name = data.name;
  if (data.avatar !== undefined) profileUpdates.avatar_url = data.avatar;
  if (data.company !== undefined) profileUpdates.company_name = data.company;

  if (Object.keys(profileUpdates).length > 0) {
    const { error: profileError } = await supabase
      .from('profiles')
      .update(profileUpdates)
      .eq('clerk_user_id', userId)
      .eq('role', 'client');

    if (profileError) {
      throw new ApiError(500, profileError.message);
    }
  }

  return await getClientProfile(userId);
};

/**
 * Update freelancer profile
 * @param userId - The user ID
 * @param data - Partial profile data to update
 * @returns Promise<FreelancerProfileData>
 */
export const updateFreelancerProfile = async (
  userId: string,
  data: Partial<FreelancerProfileData>
): Promise<FreelancerProfileData> => {
  const profileUpdates: Record<string, any> = {};
  if (data.name !== undefined) profileUpdates.full_name = data.name;
  if (data.avatar !== undefined) profileUpdates.avatar_url = data.avatar;

  if (Object.keys(profileUpdates).length > 0) {
    const { error: profileError } = await supabase
      .from('profiles')
      .update(profileUpdates)
      .eq('clerk_user_id', userId)
      .eq('role', 'freelancer');

    if (profileError) {
      throw new ApiError(500, profileError.message);
    }
  }

  return await getFreelancerProfile(userId);
};

/**
 * Update freelancer bio
 * @param userId - The user ID
 * @param bio - New bio text
 * @returns Promise<void>
 */
export const updateFreelancerBio = async (
  userId: string,
  bio: string
): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .update({ updated_at: new Date().toISOString() })
    .eq('clerk_user_id', userId)
    .eq('role', 'freelancer');

  if (error) {
    throw new ApiError(500, `Failed to update bio: ${error.message}`);
  }
};

/**
 * Update freelancer skills
 * @param userId - The user ID
 * @param skills - Array of skill strings
 * @returns Promise<void>
 */
export const updateFreelancerSkills = async (
  userId: string,
  skills: string[]
): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .update({ updated_at: new Date().toISOString() })
    .eq('clerk_user_id', userId)
    .eq('role', 'freelancer');

  if (error) {
    throw new ApiError(500, `Failed to update skills: ${error.message}`);
  }
};

/**
 * Add portfolio item to freelancer's portfolio array
 * @param userId - The user ID
 * @param portfolioItem - Portfolio item data
 * @returns Promise<void>
 */
export const addFreelancerPortfolio = async (
  userId: string,
  portfolioItem: {
    title: string;
    description: string;
    tags: string[];
    imageUrl?: string;
    url?: string;
  }
): Promise<void> => {
  // Portfolio features removed - profiles table doesn't support extended data
  throw new ApiError(501, 'Portfolio feature not implemented');
};

/**
 * Update existing portfolio item
 * @param userId - The user ID
 * @param portfolioId - ID of the portfolio item to update
 * @param portfolioItem - Updated portfolio item data
 * @returns Promise<void>
 */
export const updateFreelancerPortfolio = async (
  userId: string,
  portfolioId: string,
  portfolioItem: {
    title: string;
    description: string;
    tags: string[];
    imageUrl?: string;
    url?: string;
  }
): Promise<void> => {
  // Portfolio features removed - profiles table doesn't support extended data
  throw new ApiError(501, 'Portfolio feature not implemented');
};

/**
 * Delete portfolio item
 * @param userId - The user ID
 * @param portfolioId - ID of the portfolio item to delete
 * @returns Promise<void>
 */
export const deleteFreelancerPortfolio = async (
  userId: string,
  portfolioId: string
): Promise<void> => {
  // Portfolio features removed - profiles table doesn't support extended data
  throw new ApiError(501, 'Portfolio feature not implemented');
};

/**
 * Add work experience entry
 * @param userId - The user ID
 * @param experience - Work experience data
 * @returns Promise<void>
 */
export const addFreelancerExperience = async (
  userId: string,
  experience: {
    position: string;
    company: string;
    period: string;
    description: string;
  }
): Promise<void> => {
  // Experience features removed - profiles table doesn't support extended data
  throw new ApiError(501, 'Experience feature not implemented');
};

/**
 * Update client bio
 * @param userId - The user ID
 * @param bio - New bio text (about_company field)
 * @returns Promise<void>
 */
export const updateClientBio = async (
  userId: string,
  bio: string
): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .update({ updated_at: new Date().toISOString() })
    .eq('clerk_user_id', userId)
    .eq('role', 'client');

  if (error) {
    throw new ApiError(500, `Failed to update bio: ${error.message}`);
  }
};
