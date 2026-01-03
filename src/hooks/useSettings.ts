/**
 * useSettings Hook
 * 
 * Fetches league settings from /v1/settings
 */
import { useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS } from '@/config/api';

export interface StatCategory {
  stat_id: number;
  name: string;
  display_name: string;
  sort_order: number;
  is_only_display_stat?: boolean;
  position_type?: string;
}

export interface RosterPosition {
  position: string;
  position_type: string;
  count: number;
  is_starting_position?: boolean;
}

export interface LeagueSettings {
  league_key: string;
  league_name: string;
  season: number;
  game_code: string;
  scoring_type: string;
  is_categories: boolean;
  is_points: boolean;
  has_categories: boolean;
  has_team_stats: boolean;
  has_player_pool: boolean;
  has_schedule: boolean;
  num_teams: number;
  num_playoff_teams: number;
  playoff_start_week: number;
  current_week: number;
  start_week: number;
  end_week: number;
  start_date: string;
  end_date: string;
  trade_end_date?: string;
  trade_ratify_type?: string;
  waiver_type?: string;
  waiver_rule?: string;
  uses_faab?: boolean;
  uses_playoff?: boolean;
  stat_categories: StatCategory[];
  roster_positions: RosterPosition[];
}

interface SettingsResponse {
  meta: {
    owner_id: string;
    snapshot_date: string;
    from_cache: boolean;
    last_sync_at: string;
  };
  data: LeagueSettings | null;
  errors?: Array<{ code: string; message: string }>;
}

interface UseSettingsResult {
  settings: LeagueSettings | null;
  loading: boolean;
  error: string | null;
  lastSyncAt: string | null;
  refetch: () => void;
}

export function useSettings(leagueKey: string | null): UseSettingsResult {
  const [settings, setSettings] = useState<LeagueSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    if (!leagueKey) {
      setSettings(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_ENDPOINTS.settings(leagueKey));
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please reconnect.');
        }
        throw new Error(`Failed to fetch settings: ${response.status}`);
      }

      const json: SettingsResponse = await response.json();

      if (json.errors && json.errors.length > 0) {
        throw new Error(json.errors[0].message);
      }

      if (json.data) {
        setSettings(json.data);
        setLastSyncAt(json.meta?.last_sync_at || null);
      } else {
        setSettings(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      setSettings(null);
    } finally {
      setLoading(false);
    }
  }, [leagueKey]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    error,
    lastSyncAt,
    refetch: fetchSettings,
  };
}
