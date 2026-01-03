/**
 * Hook para consumir matchups desde API /v1/matchups
 * - Obtiene matchups cacheados
 * - Valida con Zod
 * - Maneja estados (loading, error, stale)
 * - Usa helpers para extraer datos normalizados
 * 
 * NOTE: Backend is owner-scoped. No need to pass owner_id.
 */
import { useEffect, useState, useMemo } from 'react';
import { API_ENDPOINTS } from '@/config/api';
import { 
  matchupsResponseSchema, 
  extractMatchupTeams, 
  findTeamMatchup,
  type MatchupsData,
  type Matchup,
} from '@/lib/schemas/matchups';
import { InsiderService, type InsiderCard } from '@/services/insiderService';

// Normalized team for UI consumption
export interface NormalizedTeam {
  team_key: string;
  team_id: string;
  name: string;
  logo_url: string | null;
  managers: Array<{ manager_id: string; nickname: string; image_url?: string }>;
  points_total: number | null;
  stats: Array<{ stat_id: string; value: string }>;
  remaining_games: number;
  completed_games: number;
}

// Normalized matchup for UI consumption
export interface NormalizedMatchup {
  week: number;
  week_start: string;
  week_end: string;
  status: string;
  is_playoffs: boolean;
  is_consolation: boolean;
  is_tied: boolean;
  winner_team_key?: string | null;
  teams: NormalizedTeam[];
  stat_winners: Array<{ stat_id: string; winner_team_key: string | null; is_tied: boolean }>;
  insider?: InsiderCard[];
}

/**
 * Normalize a matchup from Yahoo's weird format to a clean UI format
 */
function normalizeMatchup(matchup: Matchup, leagueKey?: string): NormalizedMatchup {
  const rawTeams = extractMatchupTeams(matchup);
  
  const teams: NormalizedTeam[] = rawTeams.map(t => ({
    team_key: t.team_key,
    team_id: t.team_id,
    name: t.name,
    logo_url: t.logo_url,
    managers: t.managers,
    points_total: t.points?.total ? parseFloat(String(t.points.total)) : null,
    stats: t.stats?.stats?.map(s => ({
      stat_id: s.stat.stat_id,
      value: String(s.stat.value),
    })) || [],
    remaining_games: t.remaining_games?.total?.remaining_games ?? 0,
    completed_games: t.remaining_games?.total?.completed_games ?? 0,
  }));

  const stat_winners = matchup.stat_winners?.map(sw => ({
    stat_id: sw.stat_winner.stat_id,
    winner_team_key: sw.stat_winner.winner_team_key || null,
    is_tied: sw.stat_winner.is_tied === 1 || sw.stat_winner.is_tied === '1',
  })) || [];

  // Generate insider insights if we have matchup data
  let insider: InsiderCard[] | undefined;
  if (leagueKey && teams.length >= 2) {
    try {
      const matchupDataForInsider = {
        teams: teams.map(t => ({
          team_key: t.team_key,
          stats: t.stats.map(s => ({
            stat_id: parseInt(s.stat_id),
            value: s.value,
          })),
        })),
      };
      insider = InsiderService.generateInsights(
        matchupDataForInsider,
        leagueKey,
        teams[0].team_key,
        teams[1].team_key
      );
    } catch (err) {
      console.warn('[normalizeMatchup] Failed to generate insider insights:', err);
    }
  }

  return {
    week: typeof matchup.week === 'string' ? parseInt(matchup.week) : matchup.week,
    week_start: matchup.week_start,
    week_end: matchup.week_end,
    status: matchup.status || '',
    is_playoffs: matchup.is_playoffs === 1 || matchup.is_playoffs === '1',
    is_consolation: matchup.is_consolation === 1 || matchup.is_consolation === '1',
    is_tied: matchup.is_tied === 1 || matchup.is_tied === '1',
    teams,
    stat_winners,
    insider,
  };
}

export function useMatchups(leagueKey: string, teamKey?: string) {
  const [rawData, setRawData] = useState<MatchupsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncAt, setLastSyncAt] = useState<Date | null>(null);

  useEffect(() => {
    const fetchMatchups = async () => {
      if (!leagueKey) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const url = API_ENDPOINTS.matchups(leagueKey, teamKey);
        console.warn('[useMatchups] Fetching:', url);

        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.warn('[useMatchups] Raw response:', data);

        // Validate with Zod
        const validated = matchupsResponseSchema.parse(data);
        console.warn('[useMatchups] Validated:', validated);

        if (validated.data) {
          setRawData(validated.data);
          // Use snapshot_date or last_sync_at from meta
          if (validated.meta?.last_sync_at) {
            setLastSyncAt(new Date(validated.meta.last_sync_at));
          } else if (validated.meta?.snapshot_date) {
            setLastSyncAt(new Date(validated.meta.snapshot_date));
          }
          setError(null);
        } else {
          // No matchup data
          setRawData(null);
          setError(null);
        }
      } catch (err) {
        console.error('[useMatchups] Error:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setRawData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchups();
  }, [leagueKey, teamKey]);

  // Find and normalize the current matchup for the team
  const currentMatchup = useMemo(() => {
    if (!rawData || !teamKey) return null;
    
    const matchup = findTeamMatchup(rawData.matchups, teamKey);
    if (!matchup) return null;
    
    return normalizeMatchup(matchup, leagueKey);
  }, [rawData, teamKey, leagueKey]);

  // Normalize all matchups
  const allMatchups = useMemo(() => {
    if (!rawData) return [];
    return rawData.matchups.map(m => normalizeMatchup(m, leagueKey));
  }, [rawData, leagueKey]);

  // Calculate if data is stale (more than 1 hour old)
  const isStale = useMemo(() => {
    if (!lastSyncAt) return false;
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return lastSyncAt < oneHourAgo;
  }, [lastSyncAt]);

  return {
    // Raw data from API
    rawData,
    // Normalized current matchup for the selected team
    matchup: currentMatchup,
    // All matchups normalized
    allMatchups,
    // Current week info
    currentWeek: rawData?.current_week,
    week: rawData?.week,
    // State
    loading,
    error,
    lastSyncAt,
    isStale,
  };
}

/**
 * Hook for capabilities - uses settings endpoint instead
 */
export function useCapabilities(leagueKey: string) {
  const [capabilities, setCapabilities] = useState<{
    has_categories_scoring: boolean;
    has_points_scoring: boolean;
    stat_categories: Array<{ stat_id: number; name: string; display_name: string }>;
    roster_positions: Array<{ position: string; count: number }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCapabilities = async () => {
      if (!leagueKey) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const url = API_ENDPOINTS.settings(leagueKey);
        console.warn('[useCapabilities] Fetching:', url);

        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.warn('[useCapabilities] Response:', data);

        // Handle envelope format
        const settings = data.data || data;
        
        if (settings) {
          setCapabilities({
            has_categories_scoring: settings.is_categories || settings.has_categories || false,
            has_points_scoring: settings.is_points || false,
            stat_categories: settings.stat_categories || [],
            roster_positions: settings.roster_positions || [],
          });
          setError(null);
        } else {
          setError('No settings data available');
        }
      } catch (err) {
        console.error('[useCapabilities] Error:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setCapabilities(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCapabilities();
  }, [leagueKey]);

  return {
    capabilities,
    loading,
    error,
  };
}
