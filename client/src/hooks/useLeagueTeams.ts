/**
 * Hook para cargar equipos de una liga desde /v1/league-teams
 * 
 * NOTE: Backend is owner-scoped. No need to pass owner_id.
 */
import { useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS } from '@/config/api';

export interface LeagueTeam {
  team_key: string;
  team_id: string;
  name: string;
  logo_url?: string | null;
  manager_id?: string | null;
  manager_name?: string | null;
  waiver_priority?: number;
  number_of_moves?: number;
  number_of_trades?: number;
}

interface UseLeagueTeamsResult {
  teams: LeagueTeam[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useLeagueTeams(leagueKey: string | null): UseLeagueTeamsResult {
  const [teams, setTeams] = useState<LeagueTeam[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = useCallback(async () => {
    if (!leagueKey) {
      setTeams([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = API_ENDPOINTS.leagueTeams(leagueKey);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();

      // Handle envelope format: { success, meta, data: { teams: [...] } }
      if (data.data?.teams) {
        setTeams(data.data.teams);
      } 
      // Handle direct format: { teams: [...] }
      else if (data.teams) {
        setTeams(data.teams);
      } 
      // Handle error
      else {
        const errorMsg = data.errors?.[0]?.message || 'Failed to load teams';
        setError(errorMsg);
        setTeams([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error loading teams');
      setTeams([]);
    } finally {
      setLoading(false);
    }
  }, [leagueKey]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return { teams, loading, error, refetch: fetchTeams };
}
