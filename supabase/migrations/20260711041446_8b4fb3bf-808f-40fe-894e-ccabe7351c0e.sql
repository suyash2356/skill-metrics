
DO $$
DECLARE
  fn text;
  internal_funcs text[] := ARRAY[
    'public.assign_admin_role_to_creator()',
    'public.assign_member_role_on_join()',
    'public.check_user_resource_content()',
    'public.community_messages_broadcast_trigger()',
    'public.community_messages_summary_sync()',
    'public.create_default_collection()',
    'public.handle_follow_request_acceptance()',
    'public.handle_new_user()',
    'public.notify_follow_request()',
    'public.set_updated_at_profiles()',
    'public.update_community_leaderboard()',
    'public.update_conversation_on_message()',
    'public.update_resource_aggregates()',
    'public.update_review_helpful_count()',
    'public.update_session_activity()',
    'public.update_user_resource_aggregates()',
    'public.validate_post_tags()',
    'public.cleanup_old_activity()',
    'public.create_default_collections_for_existing_users()',
    'public.create_default_preferences_for_existing_users()',
    'public.migrate_profile_data()',
    'public.register_first_admin(uuid, text)',
    'public.mask_ip_address(inet)',
    'public.calculate_weighted_rating(uuid)',
    'public.get_site_average_rating()',
    'public.update_updated_at_column()',
    'public.set_updated_at()'
  ];
BEGIN
  FOREACH fn IN ARRAY internal_funcs LOOP
    BEGIN
      EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon, authenticated', fn);
    EXCEPTION WHEN undefined_function THEN
      -- skip if signature doesn't match
      NULL;
    END;
  END LOOP;
END $$;
