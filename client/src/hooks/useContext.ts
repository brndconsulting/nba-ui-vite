/**
 * Hook para consumir contexto desde API /v1/context
 * - Obtiene ligas del owner
 * - Maneja selección activa
 * - Valida envelope format y shape
 * 
 * NOTE: Backend is owner-scoped. The frontend doesn't need to know or send owner_id.
 * The backend determines owner from OAuth session/token.
 * 
 * IMPORTANT: setActiveContext is ROBUST with fallback:
 * - First try POST with JSON body
 * - If fails, try POST with query params
 * - If both fail, persist to localStorage for session persistence
 */
import { useEffect, useState, useCallback } from 'react';
import { API_ENDPOINTS, API_BASE } from '@/config/api';

// League from /v1/context - NO teams (teams come from /v1/league-teams)
export interface League {
  league_key: string;
  league_id?: string;
  name: string;
  season: number | string;
  game_key: string;
  scoring_type?: string;
  num_teams?: number;
  current_week?: number | string | null;
  logo_url?: string | null;
  url?: string;
  // is_finished: Yahoo's canonical flag for league status
  // true = league ended, false = active, null/undefined = unknown (backend doesn't have it yet)
  is_finished?: boolean | null;
  // Optional date fields if backend provides them
  start_date?: string | null;
  end_date?: string | null;
}

export interface Team {
  team_key: string;
  team_id: string;
  name: string;
  manager_id?: string;
  manager_name?: string;
  logo_url?: string | null;
}

export interface Context {
  owner_id?: string;
  leagues_count?: number;
  leagues: League[];
  active_league_key?: string | null;
  active_team_key?: string | null;
  sync_status?: Record<string, unknown>;
}

export function useContext() {
  const [context, setContext] = useState<Context | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [persistenceStatus, setPersistenceStatus] = useState<'synced' | 'local' | 'error'>('synced');

  // Fetch context from API
  const fetchContext = useCallback(async () => {
    try {
      setLoading(true);
      const url = API_ENDPOINTS.context();
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json() as any;

      // VALIDATION: Check envelope format
      const success = data.success !== false;
      const errors = Array.isArray(data.errors) ? data.errors : [];
      const contextData = data.data || null;

      // ERROR CASE 1: Backend returned error in envelope
      if (!success || errors.length > 0) {
        const errorMessage = errors[0]?.message || 'Backend returned an error';
        setError(errorMessage);
        setContext(null);
        setLoading(false);
        return;
      }

      // ERROR CASE 2: Backend returned data:null (missing context)
      if (contextData === null) {
        setError('Context not available (backend returned data:null)');
        setContext(null);
        setLoading(false);
        return;
      }

      // ERROR CASE 3: Validate context shape - leagues must be array
      if (!Array.isArray(contextData.leagues)) {
        setError('Invalid context payload: leagues is not an array');
        setContext(null);
        setLoading(false);
        return;
      }

      // SUCCESS CASE: Valid context
      let finalContext = contextData as Context;

      // If no active context from backend, try to restore from localStorage
      if (!finalContext.active_league_key || !finalContext.active_team_key) {
        try {
          const savedContext = localStorage.getItem('activeContext');
          if (savedContext) {
            const parsed = JSON.parse(savedContext) as { league_key?: string; team_key?: string | null };
            if (parsed.league_key) {
              finalContext.active_league_key = parsed.league_key;
              finalContext.active_team_key = parsed.team_key || undefined;
            }
          }
        } catch (err) {
          // Silently fail - localStorage parsing error
        }
      }

      setContext(finalContext);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setContext(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContext();
  }, [fetchContext]);

  /**
   * Set active context with robust fallback
   * 1. Try POST with JSON body
   * 2. If fails, try POST with query params
   * 3. If both fail, persist to localStorage
   */
  const setActiveContext = useCallback(async (leagueKey: string, teamKey?: string): Promise<boolean> => {
    // Optimistic update - update local state immediately
    setContext(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        active_league_key: leagueKey,
        active_team_key: teamKey || null,
      };
    });

    // Try to persist to backend
    let persisted = false;

    // Attempt #1: POST with JSON body
    try {
      const url = `${API_BASE}/v1/context/active`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          league_key: leagueKey,
          team_key: teamKey || null,
        }),
      });

      if (response.ok) {
        persisted = true;
      }
    } catch (err) {
      // Silently fail
    }

    // Attempt #2: POST with query params (fallback)
    if (!persisted) {
      try {
        const params = new URLSearchParams();
        params.set('league_key', leagueKey);
        if (teamKey) params.set('team_key', teamKey);
        
        const url = `${API_BASE}/v1/context/active?${params.toString()}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          persisted = true;
        }
      } catch (err) {
        // Silently fail
      }
    }

    // Always save to localStorage as fallback for page refresh
    try {
      localStorage.setItem('activeContext', JSON.stringify({
        league_key: leagueKey,
        team_key: teamKey || null,
      }));
    } catch (err) {
      // Silently fail
    }

    // Update persistence status
    if (persisted) {
      setPersistenceStatus('synced');
      // Refetch context to confirm
      await fetchContext();
    } else {
      // Keep local state but mark as not persisted
      setPersistenceStatus('local');
    }

    return true; // Return true since local state was updated
  }, [fetchContext]);

  return {
    context,
    loading,
    error,
    setActiveContext,
    persistenceStatus,
    refetch: fetchContext,
  };
}
