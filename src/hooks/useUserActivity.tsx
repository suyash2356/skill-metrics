import { useCallback } from 'react';
import { useAuth } from './useAuth';
import { track, type EventVerb, type SubjectType } from '@/lib/tracking';

/**
 * Legacy-compatible activity tracker.
 *
 * Call sites keep the old `trackActivity(type, meta)` shape, but writes now go
 * to the unified `interaction_events` spine instead of the retired
 * `user_activity` table.
 */

const VERB_MAP: Record<string, EventVerb> = {
  view: 'open',
  open: 'open',
  click: 'click',
  like: 'like',
  unlike: 'unlike',
  comment: 'comment',
  share: 'share',
  save: 'save',
  unsave: 'unsave',
  bookmark: 'save',
  download: 'download',
  rate: 'rate',
  vote: 'vote',
  search: 'search',
  complete: 'complete',
  impression: 'impression',
};

interface LegacyMeta {
  post_id?: string | null;
  roadmap_id?: string | null;
  target_user_id?: string | null;
  resource_id?: string | null;
  metadata?: Record<string, unknown> | null;
  [key: string]: unknown;
}

export const useUserActivity = () => {
  const { user } = useAuth();

  const trackActivity = useCallback(
    async (activity_type: string, meta: LegacyMeta = {}) => {
      if (!user?.id) return;

      let subjectType: SubjectType = 'resource';
      let subjectId: string | null = meta.resource_id ?? null;

      if (meta.post_id) {
        subjectType = 'post';
        subjectId = meta.post_id;
      } else if (meta.roadmap_id) {
        subjectType = 'roadmap';
        subjectId = meta.roadmap_id;
      } else if (meta.target_user_id) {
        subjectType = 'profile';
        subjectId = meta.target_user_id;
      }

      track({
        subjectType,
        eventType: VERB_MAP[activity_type] ?? 'open',
        subjectId,
        surface: 'app',
        context: {
          ...(meta.metadata ?? {}),
          legacy_activity_type: activity_type,
        },
      });
    },
    [user?.id],
  );

  return { trackActivity };
};
