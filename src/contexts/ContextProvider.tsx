/**
 * ContextProvider - proporciona contexto del usuario a toda la app
 * Lee /v1/context desde API
 * Maneja selección activa de liga/equipo
 * 
 * NOTE: Backend is owner-scoped. The frontend doesn't need to know or send owner_id.
 * 
 * Data flow:
 * - Leagues come from /v1/context (no teams nested)
 * - Teams come from /v1/league-teams when a league is selected
 * - Active league/team stored LOCALLY when backend doesn't persist
 * 
 * IMPORTANT: This provider handles the case where backend /v1/context/active
 * doesn't exist or fails. In that case, selection is maintained locally.
 */
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useContext as useContextHook } from '@/hooks/useContext';
import { useLeagueTeams, type LeagueTeam } from '@/hooks/useLeagueTeams';
import type { Context, League } from '@/hooks/useContext';

interface ContextContextType {
  context: Context | null;
  loading: boolean;
  error: string | null;
  activeLeague: League | null;
  activeTeam: LeagueTeam | null;
  teams: LeagueTeam[];
  teamsLoading: boolean;
  setActiveContext: (leagueKey: string, teamKey?: string) => Promise<boolean>;
  persistenceStatus: 'synced' | 'local' | 'error';
}

const ContextContext = createContext<ContextContextType | undefined>(undefined);

export function ContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { context, loading, error, setActiveContext: setBackendContext, persistenceStatus } = useContextHook();
  
  // Local state for active league/team - this is the source of truth for UI
  const [activeLeagueKey, setActiveLeagueKey] = useState<string | null>(null);
  const [activeTeamKey, setActiveTeamKey] = useState<string | null>(null);
  
  // Derived state
  const [activeLeague, setActiveLeague] = useState<League | null>(null);
  const [activeTeam, setActiveTeam] = useState<LeagueTeam | null>(null);

  // Load teams for the active league
  const { 
    teams, 
    loading: teamsLoading 
  } = useLeagueTeams(activeLeagueKey);

  // Initialize from context when it loads
  useEffect(() => {
    if (context) {
      // If backend has active keys, use them as initial values
      if (context.active_league_key && !activeLeagueKey) {
        setActiveLeagueKey(context.active_league_key);
      }
      if (context.active_team_key && !activeTeamKey) {
        setActiveTeamKey(context.active_team_key);
      }
    }
  }, [context, activeLeagueKey, activeTeamKey]);

  // Update active league when activeLeagueKey changes
  useEffect(() => {
    if (context && activeLeagueKey) {
      const league = context.leagues.find(
        (l) => l.league_key === activeLeagueKey
      );
      setActiveLeague(league || null);
    } else {
      setActiveLeague(null);
    }
  }, [context, activeLeagueKey]);

  // Update active team when teams are loaded and activeTeamKey is set
  useEffect(() => {
    if (activeTeamKey && teams.length > 0) {
      const team = teams.find(
        (t) => t.team_key === activeTeamKey
      );
      setActiveTeam(team || null);
    } else {
      setActiveTeam(null);
    }
  }, [activeTeamKey, teams]);

  // Unified setActiveContext that updates local state AND tries backend
  const setActiveContext = useCallback(async (leagueKey: string, teamKey?: string): Promise<boolean> => {
    console.warn('[ContextProvider] setActiveContext:', { leagueKey, teamKey });
    
    // Update local state immediately (optimistic update)
    setActiveLeagueKey(leagueKey);
    if (teamKey !== undefined) {
      setActiveTeamKey(teamKey || null);
    }
    
    // Try to persist to backend (fire and forget - local state is source of truth)
    try {
      await setBackendContext(leagueKey, teamKey);
    } catch (err) {
      console.warn('[ContextProvider] Backend persistence failed, using local state:', err);
    }
    
    return true;
  }, [setBackendContext]);

  const value: ContextContextType = {
    context,
    loading,
    error,
    activeLeague,
    activeTeam,
    teams,
    teamsLoading,
    setActiveContext,
    persistenceStatus,
  };

  return (
    <ContextContext.Provider value={value}>{children}</ContextContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(ContextContext);
  if (!context) {
    throw new Error('useAppContext must be used within ContextProvider');
  }
  return context;
}
