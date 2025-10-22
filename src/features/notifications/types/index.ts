/**
 * Notification Types and Interfaces
 * These types match the database schema from migration 012_add_notifications_system.sql
 */

export type NotificationCategory =
  | 'project_opportunity'
  | 'proposal'
  | 'contract'
  | 'payment'
  | 'message'
  | 'review'
  | 'system';

// Freelancer notification types
export type FreelancerNotificationType =
  // Project & Opportunity
  | 'project_match_skills'
  | 'project_invitation'
  // Proposal & Application
  | 'proposal_submitted'
  | 'proposal_viewed'
  | 'proposal_message'
  | 'proposal_accepted'
  | 'proposal_declined'
  | 'offer_received'
  // Project & Contract
  | 'contract_started'
  | 'client_message'
  | 'project_requirements_updated'
  | 'contract_ended'
  | 'review_received'
  // Payment & Financial
  | 'upfront_payment_secured'
  | 'final_payment_released'
  | 'withdrawal_successful';

// Client notification types
export type ClientNotificationType =
  // Project Posting & Discovery
  | 'project_posted'
  | 'new_proposal_received'
  | 'ai_suggested_freelancers'
  | 'invited_freelancer_responded'
  // Proposal & Hiring
  | 'freelancer_message'
  | 'freelancer_accepted_offer'
  | 'freelancer_declined_offer'
  | 'reminder_review_proposals'
  // Project & Contract
  | 'contract_started'
  | 'freelancer_message_active'
  | 'reminder_pay_upfront'
  | 'reminder_pay_final'
  | 'contract_ended'
  | 'reminder_leave_review'
  // Payment & Financial
  | 'upfront_payment_successful'
  | 'final_payment_successful'
  | 'invoice_received';

export type NotificationType = FreelancerNotificationType | ClientNotificationType;

/**
 * Main Notification interface
 */
export interface Notification {
  id: string;
  user_id: string;
  category: NotificationCategory;
  type: NotificationType;
  title: string;
  message: string;

  // Related entities
  project_id?: string;
  proposal_id?: string;
  conversation_id?: string;
  payment_intent_id?: string;

  // Actor (who triggered this notification)
  actor_id?: string;
  actor_name?: string;
  actor_avatar_url?: string;

  // Metadata for additional context
  metadata?: Record<string, any>;

  // Action URL
  action_url?: string;

  // Status
  is_read: boolean;
  is_archived: boolean;
  read_at?: string;

  // Timestamps
  created_at: string;
  updated_at: string;
}

/**
 * Notification preferences
 */
export interface NotificationPreferences {
  id: string;
  user_id: string;

  // In-app notification preferences by category
  inapp_project_updates: boolean;
  inapp_proposal_updates: boolean;
  inapp_messages: boolean;
  inapp_payments: boolean;
  inapp_reviews: boolean;
  inapp_system: boolean;

  created_at: string;
  updated_at: string;
}

/**
 * Request types for creating notifications
 */
export interface CreateNotificationRequest {
  user_id: string;
  category: NotificationCategory;
  type: NotificationType;
  title: string;
  message: string;
  project_id?: string;
  proposal_id?: string;
  conversation_id?: string;
  payment_intent_id?: string;
  actor_id?: string;
  metadata?: Record<string, any>;
  action_url?: string;
}

/**
 * Filter options for fetching notifications
 */
export interface NotificationFilters {
  category?: NotificationCategory;
  is_read?: boolean;
  is_archived?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Notification statistics
 */
export interface NotificationStats {
  total: number;
  unread: number;
  by_category: {
    [key in NotificationCategory]?: number;
  };
}
