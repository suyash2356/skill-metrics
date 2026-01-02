import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Secure session type - only contains non-sensitive data
export type UserSession = {
  id: string;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  country: string | null;
  is_active: boolean | null;
  last_activity: string;
  created_at: string;
};

export const useUserSessions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    const manageSession = async () => {
      if (!user?.id) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Parse user agent for device info only - NO sensitive data like IP
      const userAgent = navigator.userAgent;
      const deviceType = /Mobile|Android|iPhone|iPad/.test(userAgent) ? 'mobile' : 'desktop';
      const browser = getBrowserName(userAgent);
      const os = getOSName(userAgent);

      let sessionId = sessionStorage.getItem('session_id');

      if (!sessionId) {
        // Create new session with minimal, privacy-respecting data
        // NO IP address, NO city - only device info for security monitoring
        const { data, error } = await supabase
          .from('user_sessions')
          .insert({
            user_id: user.id,
            device_type: deviceType,
            browser: browser,
            os: os,
            user_agent: userAgent.substring(0, 100), // Truncate for privacy
            // NO ip_address - privacy concern
            // NO city - privacy concern  
            // country can be added via edge function if needed
          })
          .select('id')
          .single();
        
        if (data) {
          sessionId = data.id;
          sessionStorage.setItem('session_id', sessionId);
        }
      } else {
        // Update last activity only
        await supabase
          .from('user_sessions')
          .update({ last_activity: new Date().toISOString() })
          .eq('id', sessionId);
      }
    };

    manageSession();
    const interval = setInterval(manageSession, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user?.id]);

  // Use secure RPC function to get sessions (returns only safe, non-sensitive data)
  const { data: sessions, isLoading } = useQuery({
    queryKey: ['userSessions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // Use the secure RPC function that only returns non-sensitive data
      const { data, error } = await supabase.rpc('get_my_sessions');
      
      if (error) {
        console.error('Error fetching sessions:', error);
        return [];
      }
      
      return (data || []) as UserSession[];
    },
    enabled: !!user?.id,
  });

  const terminateSession = useMutation({
    mutationFn: async (sessionId: string) => {
      const { error } = await supabase
        .from('user_sessions')
        .delete()
        .eq('id', sessionId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSessions', user?.id] });
    },
  });

  return {
    sessions,
    isLoading,
    terminateSession: terminateSession.mutate,
  };
};

// Helper functions to extract device info from user agent
function getBrowserName(userAgent: string): string {
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Edg')) return 'Edge';
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Opera')) return 'Opera';
  return 'Unknown';
}

function getOSName(userAgent: string): string {
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
  return 'Unknown';
}
