-- =============================================
-- Notification Helper Functions
-- =============================================

CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_category notification_category,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_project_id UUID DEFAULT NULL,
  p_proposal_id UUID DEFAULT NULL,
  p_conversation_id UUID DEFAULT NULL,
  p_payment_intent_id UUID DEFAULT NULL,
  p_actor_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}',
  p_action_url TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_notification_id UUID;
  v_actor_name TEXT;
  v_actor_avatar TEXT;
  v_should_show_notification BOOLEAN;
BEGIN
  SELECT
    CASE p_category
      WHEN 'project_opportunity' THEN inapp_project_updates
      WHEN 'proposal' THEN inapp_proposal_updates
      WHEN 'message' THEN inapp_messages
      WHEN 'payment' THEN inapp_payments
      WHEN 'review' THEN inapp_reviews
      WHEN 'system' THEN inapp_system
      ELSE true
    END
  INTO v_should_show_notification
  FROM notification_preferences
  WHERE user_id = p_user_id;

  IF v_should_show_notification = false THEN
    RETURN NULL;
  END IF;

  IF p_actor_id IS NOT NULL THEN
    SELECT full_name, avatar_url
    INTO v_actor_name, v_actor_avatar
    FROM users
    WHERE id = p_actor_id;
  END IF;

  INSERT INTO notifications (
    user_id,
    category,
    type,
    title,
    message,
    project_id,
    proposal_id,
    conversation_id,
    payment_intent_id,
    actor_id,
    actor_name,
    actor_avatar_url,
    metadata,
    action_url
  ) VALUES (
    p_user_id,
    p_category,
    p_type,
    p_title,
    p_message,
    p_project_id,
    p_proposal_id,
    p_conversation_id,
    p_payment_intent_id,
    p_actor_id,
    v_actor_name,
    v_actor_avatar,
    p_metadata,
    p_action_url
  )
  RETURNING id INTO v_notification_id;

  RETURN v_notification_id;
END;
$$;

CREATE OR REPLACE FUNCTION mark_notification_read(p_notification_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE notifications
  SET
    is_read = true,
    read_at = NOW(),
    updated_at = NOW()
  WHERE id = p_notification_id
    AND user_id = auth.uid();
END;
$$;

CREATE OR REPLACE FUNCTION mark_all_notifications_read()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE notifications
  SET
    is_read = true,
    read_at = NOW(),
    updated_at = NOW()
  WHERE user_id = auth.uid()
    AND is_read = false;
END;
$$;

CREATE OR REPLACE FUNCTION get_unread_notification_count()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO v_count
  FROM notifications
  WHERE user_id = auth.uid()
    AND is_read = false
    AND is_archived = false;

  RETURN v_count;
END;
$$;

CREATE OR REPLACE FUNCTION archive_notification(p_notification_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE notifications
  SET
    is_archived = true,
    updated_at = NOW()
  WHERE id = p_notification_id
    AND user_id = auth.uid();
END;
$$;

CREATE OR REPLACE FUNCTION cleanup_old_notifications(p_days_old INTEGER DEFAULT 30)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  DELETE FROM notifications
  WHERE is_archived = true
    AND created_at < NOW() - INTERVAL '1 day' * p_days_old;

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RETURN v_deleted_count;
END;
$$;

CREATE OR REPLACE FUNCTION get_client_profile(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  profile_image TEXT,
  location VARCHAR,
  website VARCHAR,
  industry VARCHAR,
  company_size VARCHAR,
  about_company TEXT,
  project_goals TEXT[],
  project_description TEXT,
  budget_range VARCHAR,
  timeline VARCHAR,
  onboarding_completed BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    cp.id, cp.user_id, cp.profile_image, cp.location, cp.website,
    cp.industry, cp.company_size, cp.about_company, cp.project_goals,
    cp.project_description, cp.budget_range, cp.timeline,
    cp.onboarding_completed, cp.created_at, cp.updated_at
  FROM client_profiles cp
  WHERE cp.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_freelancer_profile(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  profile_image TEXT,
  title VARCHAR,
  location VARCHAR,
  bio TEXT,
  experience INT,
  skills TEXT[],
  portfolio_title VARCHAR,
  portfolio_description TEXT,
  portfolio_tags TEXT[],
  portfolio_image TEXT,
  hourly_rate DECIMAL,
  onboarding_completed BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    fp.id, fp.user_id, fp.profile_image, fp.title, fp.location,
    fp.bio, fp.experience, fp.skills, fp.portfolio_title,
    fp.portfolio_description, fp.portfolio_tags, fp.portfolio_image,
    fp.hourly_rate, fp.onboarding_completed, fp.created_at, fp.updated_at
  FROM freelancer_profiles fp
  WHERE fp.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;