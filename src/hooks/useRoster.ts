/**
 * useRoster Hook
 * 
 * Fetches roster for a team from /v1/roster
 */
import { useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS } from '@/config/api';

export interface RosterPlayer {
  player_key: string;
  player_id?: string;
  name: {
    full: string;
    first: string;
    last: string;
  };
  display_position: string;
  primary_position?: string;
  selected_position?: {
    position: string;
    coverage_type?: string;
    week?: string;
  };
  editorial_team_full_name?: string;
  editorial_team_abbr?: string;
  headshot?: {
    url: string;
    size: string;
  };
  image_url?: string;
  status?: string; // GTD, IL, O, DTD, etc.
  status_full?: string;
  injury_note?: string;
  games_week_total?: number;
  games_remaining_week?: number;
  schedule_available?: boolean;
  games_by_day?: Record<string, number>;
  next_games?: Array<{
    date: string;
    opponent: string;
    home: boolean;
  }>;
}

interface RosterResponse {
  meta: {
    owner_id: string;
    snapshot_date: string;
    from_cache: boolean;
    last_sync_at: string;
  };
  data: {
    team_key: string;
    league_key: string;
    players_count: number;
    players: RosterPlayer[];
  } | null;
  errors?: Array<{ code: string; message: string }>;
}

interface UseRosterResult {
  players: RosterPlayer[];
  loading: boolean;
  error: string | null;
  lastSyncAt: string | null;
  refetch: () => void;
}

export function useRoster(teamKey: string | null): UseRosterResult {
  const [players, setPlayers] = useState<RosterPlayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);

  const fetchRoster = useCallback(async () => {
    if (!teamKey) {
      setPlayers([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_ENDPOINTS.roster(teamKey));
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please reconnect.');
        }
        if (response.status === 404) {
          throw new Error('Roster not synced yet. Please sync first.');
        }
        throw new Error(`Failed to fetch roster: ${response.status}`);
      }

      const json: RosterResponse = await response.json();

      if (json.errors && json.errors.length > 0) {
        throw new Error(json.errors[0].message);
      }

      if (json.data?.players) {
        setPlayers(json.data.players);
        setLastSyncAt(json.meta?.last_sync_at || null);
      } else {
        setPlayers([]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  }, [teamKey]);

  useEffect(() => {
    fetchRoster();
  }, [fetchRoster]);

  return {
    players,
    loading,
    error,
    lastSyncAt,
    refetch: fetchRoster,
  };
}
