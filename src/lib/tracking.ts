import { supabase } from '@/integrations/supabase/client';

/**
 * Zone C (Activity) client. Every user interaction in the app funnels through
 * here and lands in the single append-only `interaction_events` spine, which is
 * the training source for the user-behaviour recommendation model.
 *
 * Nothing else should write interaction data directly.
 */

export type SubjectType =
  | 'resource'
  | 'post'
  | 'roadmap'
  | 'skill'
  | 'profile'
  | 'search'
  | 'user_resource';

export type EventVerb =
  | 'impression'
  | 'click'
  | 'open'
  | 'dwell'
  | 'download'
  | 'like'
  | 'unlike'
  | 'save'
  | 'unsave'
  | 'share'
  | 'comment'
  | 'rate'
  | 'vote'
  | 'complete'
  | 'search';

export interface TrackInput {
  subjectType: SubjectType;
  eventType: EventVerb;
  subjectId?: string | null;
  /** Where in the product the event happened, e.g. `explore.degrees`. */
  surface?: string;
  /** Time spent on the subject in ms — only for `dwell`. Capped at 30 min server-side. */
  dwellMs?: number;
  /** 1-based rank of the item in the list it was seen in. */
  position?: number;
  /** A/B bucket. */
  variant?: string;
  /** Recommender build that produced the impression. */
  modelVersion?: string;
  /** Free-form context (query text, filters, device). Never joined on. */
  context?: Record<string, unknown>;
}

const SESSION_KEY = 'sm.session_id';

/**
 * One id per browser tab session. Groups events into a visit so the
 * navigation path (`sequence_no` order) can be reconstructed for
 * session-based / next-item models.
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = window.sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

/** Max dwell we accept — anything longer is an idle tab, not attention. */
export const MAX_DWELL_MS = 30 * 60 * 1000;

/**
 * Appends one event. Fire-and-forget: tracking must never break a user flow,
 * so failures are logged and swallowed.
 */
export async function trackEvent(input: TrackInput): Promise<void> {
  try {
    const { error } = await (supabase as any).rpc('track_interaction', {
      _subject_type: input.subjectType,
      _event_type: input.eventType,
      _subject_id: input.subjectId ?? null,
      _session_id: getSessionId() || null,
      _surface: input.surface ?? null,
      _dwell_ms:
        input.dwellMs == null
          ? null
          : Math.min(Math.max(Math.round(input.dwellMs), 0), MAX_DWELL_MS),
      _position: input.position ?? null,
      _variant: input.variant ?? null,
      _model_version: input.modelVersion ?? null,
      _context: input.context ?? {},
    });
    if (error) console.warn('[tracking] failed', input.eventType, error.message);
  } catch (e) {
    console.warn('[tracking] threw', e);
  }
}

/**
 * Sends events without waiting, safe to call from render-adjacent code.
 */
export function track(input: TrackInput): void {
  void trackEvent(input);
}
