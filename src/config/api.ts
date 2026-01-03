/**
 * Configuración centralizada de API
 * 
 * En dev: usa proxy de Vite (/api -> backend)
 * En prod: usa VITE_API_BASE_URL (URL pública del backend en Railway)
 * 
 * NOTE: Backend is owner-scoped, no need to pass owner_id from frontend.
 * The backend determines owner from OAuth session/token.
 */

// Production: VITE_API_BASE_URL must be set (e.g., https://nba-api-production-1f32.up.railway.app)
// Development: falls back to /api which is proxied by Vite
const getApiBase = (): string => {
  // In production, VITE_API_BASE_URL is required
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // Legacy fallback
  if (import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE;
  }
  // Development: use proxy
  return '/api';
};

export const API_BASE = getApiBase();

/**
 * API Endpoints - All endpoints are owner-scoped on the backend
 * No need to pass owner_id from frontend
 */
export const API_ENDPOINTS = {
  // Context - Get all leagues for owner
  context: () => `${API_BASE}/v1/context`,
  
  // Set active league/team
  setActiveContext: (leagueKey: string, teamKey?: string) => {
    const params = new URLSearchParams();
    params.set('league_key', leagueKey);
    if (teamKey) params.set('team_key', teamKey);
    return `${API_BASE}/v1/context/active?${params.toString()}`;
  },

  // League Teams - Get teams for a specific league
  leagueTeams: (leagueKey: string) => 
    `${API_BASE}/v1/league-teams?league_key=${encodeURIComponent(leagueKey)}`,

  // Matchups - Get matchups for a league/team
  matchups: (leagueKey: string, teamKey?: string, week?: number) => {
    const params = new URLSearchParams();
    params.set('league_key', leagueKey);
    if (teamKey) params.set('team_key', teamKey);
    if (week) params.set('week', String(week));
    return `${API_BASE}/v1/matchups?${params.toString()}`;
  },

  // Standings - Get standings for a league
  standings: (leagueKey: string) => 
    `${API_BASE}/v1/standings?league_key=${encodeURIComponent(leagueKey)}`,

  // Settings - Get league settings
  settings: (leagueKey: string) => 
    `${API_BASE}/v1/settings?league_key=${encodeURIComponent(leagueKey)}`,

  // Roster - Get roster for a team
  roster: (teamKey: string) => 
    `${API_BASE}/v1/roster?team_key=${encodeURIComponent(teamKey)}`,

  // Player Pool - Get free agents for a league
  playerPool: (leagueKey: string) => 
    `${API_BASE}/v1/player-pool?league_key=${encodeURIComponent(leagueKey)}`,

  // Schedule - Get schedule for a league
  schedule: (leagueKey: string, sport: string, startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    params.set('league_key', leagueKey);
    params.set('sport', sport);
    if (startDate) params.set('start_date', startDate);
    if (endDate) params.set('end_date', endDate);
    return `${API_BASE}/v1/schedule?${params.toString()}`;
  },

  // Sports Schedule - Get games from BallDontLie
  sportsSchedule: (sport: string, startDate: string, endDate: string) => {
    const params = new URLSearchParams();
    params.set('sport', sport);
    params.set('start_date', startDate);
    params.set('end_date', endDate);
    return `${API_BASE}/v1/sports-schedule?${params.toString()}`;
  },

  // Sync Status - Get sync status for all domains
  syncStatus: (leagueKey?: string) => {
    if (leagueKey) {
      return `${API_BASE}/v1/sync-status?league_key=${encodeURIComponent(leagueKey)}`;
    }
    return `${API_BASE}/v1/sync-status`;
  },

  // League Managers - Get managers for a league
  leagueManagers: (leagueKey: string) => 
    `${API_BASE}/v1/league-managers?league_key=${encodeURIComponent(leagueKey)}`,

  // Owner Profile - Get owner profile
  ownerProfile: () => `${API_BASE}/v1/owner-profile`,

  // League Strengths - Get league strengths analysis
  leagueStrengths: (leagueKey: string) => 
    `${API_BASE}/v1/league-strengths?league_key=${encodeURIComponent(leagueKey)}`,
};
