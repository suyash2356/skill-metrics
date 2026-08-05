GRANT SELECT ON public.v_resource_features TO authenticated;
GRANT SELECT ON public.v_user_item_implicit TO authenticated;
GRANT SELECT ON public.v_session_sequences TO authenticated;
GRANT SELECT ON public.v_recommendation_outcomes TO authenticated;
GRANT SELECT ON public.v_resource_features TO service_role;
GRANT SELECT ON public.v_user_item_implicit TO service_role;
GRANT SELECT ON public.v_session_sequences TO service_role;
GRANT SELECT ON public.v_recommendation_outcomes TO service_role;