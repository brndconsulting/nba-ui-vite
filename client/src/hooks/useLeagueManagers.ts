/**
 * useLeagueManagers Hook
 * 
 * Fetches manager profiles for a league from /v1/league-managers
 * Returns managers with their felo_score, felo_tier, team info, etc.
 */
import { useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS } from '@/config/api';

export interface Manager {
  manager_id: string;
  nickname: string;
  guid?: string;
  is_commissioner?: string;
  is_current_login?: string;
  email?: string;
  image_url?: string;
  felo_score?: string;
  felo_tier?: string;
  team_key: string;
  team_name: string;
}

interface LeagueManagersResponse {
  meta: {
    owner_id: string;
    snapshot_date: string;
    from_cache: boolean;
    last_sync_at: string;
  };
  data: {
    league_key: string;
    managers_count: number;
    managers: Manager[];
  } | null;
  errors?: Array<{ code: string; message: string }>;
}

interface UseLeagueManagersResult {
  managers: Manager[];
  loading: boolean;
  error: string | null;
  lastSyncAt: string | null;
  refetch: () => void;
}

export function useLeagueManagers(leagueKey: string | null): UseLeagueManagersResult {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);

  const fetchManagers = useCallback(async () => {
    if (!leagueKey) {
      setManagers([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_ENDPOINTS.leagueManagers(leagueKey));
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please reconnect.');
        }
        throw new Error(`Failed to fetch managers: ${response.status}`);
      }

      const json: LeagueManagersResponse = await response.json();

      if (json.errors && json.errors.length > 0) {
        throw new Error(json.errors[0].message);
      }

      if (json.data?.managers) {
        setManagers(json.data.managers);
        setLastSyncAt(json.meta?.last_sync_at || null);
      } else {
        setManagers([]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      setManagers([]);
    } finally {
      setLoading(false);
    }
  }, [leagueKey]);

  useEffect(() => {
    fetchManagers();
  }, [fetchManagers]);

  return {
    managers,
    loading,
    error,
    lastSyncAt,
    refetch: fetchManagers,
  };
}
