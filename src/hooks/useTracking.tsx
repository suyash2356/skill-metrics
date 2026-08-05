import { useCallback, useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import {
  track,
  trackEvent,
  type EventVerb,
  type SubjectType,
  type TrackInput,
} from '@/lib/tracking';

/**
 * Primary tracking hook. Wraps the Zone C event spine and short-circuits when
 * nobody is signed in (events are always attributed to a user).
 */
export const useTracking = (defaultSurface?: string) => {
  const { user } = useAuth();

  const trackInteraction = useCallback(
    (input: TrackInput) => {
      if (!user?.id) return;
      track({ surface: defaultSurface, ...input });
    },
    [user?.id, defaultSurface],
  );

  const trackImpressions = useCallback(
    (
      subjectType: SubjectType,
      ids: string[],
      opts?: { surface?: string; modelVersion?: string; variant?: string },
    ) => {
      if (!user?.id || !ids.length) return;
      ids.forEach((id, i) => {
        track({
          subjectType,
          eventType: 'impression',
          subjectId: id,
          position: i + 1,
          surface: opts?.surface ?? defaultSurface,
          modelVersion: opts?.modelVersion,
          variant: opts?.variant,
        });
      });
    },
    [user?.id, defaultSurface],
  );

  return { trackInteraction, trackImpressions, isEnabled: !!user?.id };
};

/**
 * Measures how long a subject stayed visible and emits a single `dwell` event
 * with the accumulated attention time. Pauses while the tab is hidden so
 * background tabs never inflate session duration.
 */
export const useDwellTracking = (
  subjectType: SubjectType,
  subjectId: string | null | undefined,
  surface?: string,
) => {
  const { user } = useAuth();
  const accumulatedRef = useRef(0);
  const startedRef = useRef<number | null>(null);

  useEffect(() => {
    if (!user?.id || !subjectId) return;

    accumulatedRef.current = 0;
    startedRef.current = document.visibilityState === 'visible' ? Date.now() : null;

    const pause = () => {
      if (startedRef.current != null) {
        accumulatedRef.current += Date.now() - startedRef.current;
        startedRef.current = null;
      }
    };
    const resume = () => {
      if (startedRef.current == null) startedRef.current = Date.now();
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') resume();
      else pause();
    };

    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      pause();
      const total = accumulatedRef.current;
      // Ignore accidental sub-second glances.
      if (total >= 1000) {
        void trackEvent({
          subjectType,
          eventType: 'dwell',
          subjectId,
          dwellMs: total,
          surface,
        });
      }
    };
  }, [user?.id, subjectType, subjectId, surface]);
};

/**
 * Convenience wrapper for one-off verbs from event handlers.
 */
export const useTrackVerb = () => {
  const { user } = useAuth();
  return useCallback(
    (
      subjectType: SubjectType,
      eventType: EventVerb,
      subjectId: string,
      surface?: string,
      context?: Record<string, unknown>,
    ) => {
      if (!user?.id) return;
      track({ subjectType, eventType, subjectId, surface, context });
    },
    [user?.id],
  );
};
