
CREATE OR REPLACE FUNCTION public.track_interaction(
  _subject_type interaction_subject,
  _event_type interaction_verb,
  _subject_id uuid DEFAULT NULL::uuid,
  _session_id uuid DEFAULT NULL::uuid,
  _surface text DEFAULT NULL::text,
  _dwell_ms integer DEFAULT NULL::integer,
  _position integer DEFAULT NULL::integer,
  _variant text DEFAULT NULL::text,
  _model_version text DEFAULT NULL::text,
  _context jsonb DEFAULT '{}'::jsonb
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _uid uuid := auth.uid();
  _seq integer;
  _id  bigint;
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF _session_id IS NOT NULL THEN
    -- Bound the lookup to the last 24h so Postgres can prune partitions.
    -- A browser session never spans more than that in practice.
    SELECT COALESCE(MAX(sequence_no), 0) + 1 INTO _seq
    FROM interaction_events
    WHERE session_id = _session_id
      AND user_id = _uid
      AND occurred_at >= now() - interval '1 day';
  END IF;

  INSERT INTO interaction_events (
    user_id, session_id, subject_type, subject_id, event_type,
    dwell_ms, position, surface, variant, model_version, sequence_no, context
  ) VALUES (
    _uid, _session_id, _subject_type, _subject_id, _event_type,
    CASE WHEN _dwell_ms IS NULL THEN NULL ELSE LEAST(GREATEST(_dwell_ms, 0), 1800000) END,
    _position, _surface, _variant, _model_version, _seq, COALESCE(_context, '{}'::jsonb)
  ) RETURNING id INTO _id;

  RETURN _id;
END;
$function$;

REVOKE ALL ON FUNCTION public.track_interaction(interaction_subject, interaction_verb, uuid, uuid, text, integer, integer, text, text, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.track_interaction(interaction_subject, interaction_verb, uuid, uuid, text, integer, integer, text, text, jsonb) TO authenticated, service_role;
