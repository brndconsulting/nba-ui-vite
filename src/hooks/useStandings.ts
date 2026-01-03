/**
 * useStandings Hook
 * 
 * Fetches standings for a league from /v1/standings
 */
import { useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS } from '@/config/api';

export interface TeamStanding {
  team_key: string;
  team_id: string;
  name: string;
  logo_url?: string;
  managers?: Array<{
    manager_id: string;
    nickname: string;
    guid?: string;
    image_url?: string;
  }>;
  team_stats?: Record<string, unknown>;
  team_points?: {
    total: string;
    coverage_type: string;
    season: string;
  };
  team_standings: {
    rank: number;
    playoff_seed?: string;
    outcome_totals: {
      wins: string;
      losses: string;
      ties: string;
      percentage: string;
    };
    games_back?: string;
  };
}

interface StandingsResponse {
  meta: {
    owner_id: string;
    snapshot_date: string;
    from_cache: boolean;
    last_sync_at: string;
  };
  data: {
    league_key: string;
    week: number;
    teams_count: number;
    teams: TeamStanding[];
  } | null;
  errors?: Array<{ code: string; message: string }>;
}

interface UseStandingsResult {
  standings: TeamStanding[];
  week: number | null;
  loading: boolean;
  error: string | null;
  lastSyncAt: string | null;
  refetch: () => void;
}

export function useStandings(leagueKey: string | null): UseStandingsResult {
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [week, setWeek] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);

  const fetchStandings = useCallback(async () => {
    if (!leagueKey) {
      setStandings([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_ENDPOINTS.standings(leagueKey));
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please reconnect.');
        }
        throw new Error(`Failed to fetch standings: ${response.status}`);
      }

      const json: StandingsResponse = await response.json();

      if (json.errors && json.errors.length > 0) {
        throw new Error(json.errors[0].message);
      }

      if (json.data?.teams) {
        setStandings(json.data.teams);
        setWeek(json.data.week);
        setLastSyncAt(json.meta?.last_sync_at || null);
      } else {
        setStandings([]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      setStandings([]);
    } finally {
      setLoading(false);
    }
  }, [leagueKey]);

  useEffect(() => {
    fetchStandings();
  }, [fetchStandings]);

  return {
    standings,
    week,
    loading,
    error,
    lastSyncAt,
    refetch: fetchStandings,
  };
}
