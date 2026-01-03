/**
 * Matchups Schemas - Based on ACTUAL /v1/matchups backend response
 * 
 * The backend returns Yahoo Fantasy API raw structure which is deeply nested.
 * This schema matches that structure exactly.
 */
import { z } from 'zod';

// ===== Meta Schema =====
export const matchupMetaSchema = z.object({
  owner_id: z.string().optional(),
  snapshot_date: z.string().optional(),
  from_cache: z.boolean().optional(),
  last_sync_at: z.string().optional(),
}).passthrough();

// ===== Stat Schema (inside team_stats) =====
export const statValueSchema = z.object({
  stat: z.object({
    stat_id: z.string(),
    value: z.union([z.string(), z.number()]),
  }),
});

// ===== Team Stats Schema =====
export const teamStatsSchema = z.object({
  coverage_type: z.string().optional(),
  week: z.string().optional(),
  stats: z.array(statValueSchema).optional(),
});

// ===== Team Points Schema =====
export const teamPointsSchema = z.object({
  coverage_type: z.string().optional(),
  week: z.string().optional(),
  total: z.union([z.string(), z.number()]).optional(),
});

// ===== Team Remaining Games Schema =====
export const teamRemainingGamesSchema = z.object({
  coverage_type: z.string().optional(),
  week: z.string().optional(),
  total: z.object({
    remaining_games: z.number(),
    live_games: z.number(),
    completed_games: z.number(),
  }).optional(),
});

// ===== Manager Schema =====
export const managerSchema = z.object({
  manager: z.object({
    manager_id: z.string(),
    nickname: z.string().optional(),
    guid: z.string().optional(),
    email: z.string().optional(),
    image_url: z.string().optional(),
    felo_score: z.string().optional(),
    felo_tier: z.string().optional(),
  }),
});

// ===== Team Info Array Element =====
// Yahoo returns team info as an array of objects, each with a single key
// e.g., [{team_key: "..."}, {team_id: "..."}, {name: "..."}, ...]
export const teamInfoArraySchema = z.array(z.any());

// ===== Team Container Schema =====
// Each team in matchup has: { team: [teamInfoArray, statsObject] }
export const teamContainerSchema = z.object({
  team: z.tuple([
    teamInfoArraySchema, // Team metadata as array of objects
    z.object({
      team_stats: teamStatsSchema.optional(),
      team_points: teamPointsSchema.optional(),
      team_remaining_games: teamRemainingGamesSchema.optional(),
    }),
  ]),
});

// ===== Teams Container Schema =====
// { "0": {team: [...]}, "1": {team: [...]}, "count": 2 }
export const teamsContainerSchema = z.object({
  "0": teamContainerSchema.optional(),
  "1": teamContainerSchema.optional(),
  count: z.number(),
});

// ===== Matchup Teams Wrapper =====
// { teams: {...} }
export const matchupTeamsWrapperSchema = z.object({
  teams: teamsContainerSchema,
});

// ===== Stat Winner Schema =====
export const statWinnerSchema = z.object({
  stat_winner: z.object({
    stat_id: z.string(),
    winner_team_key: z.string().optional(),
    is_tied: z.union([z.number(), z.string()]).optional(),
  }),
});
// ===== Matchup Schema =====
export const matchupSchema = z.object({
  week: z.union([z.number(), z.string()]),
  week_start: z.string(),
  week_end: z.string(),
  status: z.string().optional(),
  is_playoffs: z.union([z.number(), z.string()]).optional(),
  is_consolation: z.union([z.number(), z.string()]).optional(),
  is_matchup_of_the_week: z.union([z.number(), z.string()]).optional(),
  is_tied: z.union([z.number(), z.string()]).optional(),
  stat_winners: z.array(statWinnerSchema).optional(),
  "0": matchupTeamsWrapperSchema.optional(),
});

// ===== Matchups Data Schema =====
export const matchupsDataSchema = z.object({
  league_key: z.string(),
  week: z.union([z.number(), z.string()]).optional(),
  current_week: z.union([z.number(), z.string()]).nullable().optional(),
  matchups: z.array(matchupSchema),
}).passthrough();

// ===== Matchups Response Envelope =====
export const matchupsResponseSchema = z.object({
  success: z.boolean().optional().default(true),
  meta: matchupMetaSchema.optional(),
  capabilities: z.any().optional(),
  data: matchupsDataSchema.nullable().optional(),
  errors: z.array(z.any()).nullable().optional(),
}).passthrough();

// ===== Legacy aliases for backward compatibility =====
export const matchupEnvelopeSchema = matchupsResponseSchema;
export const matchupDataSchema = matchupsDataSchema;

// ===== Type Exports =====
export type MatchupMeta = z.infer<typeof matchupMetaSchema>;
export type StatValue = z.infer<typeof statValueSchema>;
export type TeamStats = z.infer<typeof teamStatsSchema>;
export type TeamPoints = z.infer<typeof teamPointsSchema>;
export type TeamRemainingGames = z.infer<typeof teamRemainingGamesSchema>;
export type Manager = z.infer<typeof managerSchema>;
export type TeamContainer = z.infer<typeof teamContainerSchema>;
export type TeamsContainer = z.infer<typeof teamsContainerSchema>;
export type StatWinner = z.infer<typeof statWinnerSchema>;
export type Matchup = z.infer<typeof matchupSchema>;
export type MatchupsData = z.infer<typeof matchupsDataSchema>;
export type MatchupsResponse = z.infer<typeof matchupsResponseSchema>;

// Legacy type aliases
export type MatchupData = MatchupsData;
export type MatchupEnvelope = MatchupsResponse;

// ===== Helper Functions =====

/**
 * Extract team info from Yahoo's weird array format
 * Returns a normalized team object
 */
export function extractTeamInfo(teamInfoArray: unknown[]): {
  team_key: string;
  team_id: string;
  name: string;
  logo_url: string | null;
  managers: Array<{ manager_id: string; nickname: string; image_url?: string }>;
} {
  let team_key = '';
  let team_id = '';
  let name = '';
  let logo_url: string | null = null;
  const managers: Array<{ manager_id: string; nickname: string; image_url?: string }> = [];

  for (const item of teamInfoArray) {
    if (typeof item !== 'object' || item === null) continue;
    
    const obj = item as Record<string, unknown>;
    
    if ('team_key' in obj) team_key = String(obj.team_key);
    if ('team_id' in obj) team_id = String(obj.team_id);
    if ('name' in obj) name = String(obj.name);
    if ('team_logos' in obj && Array.isArray(obj.team_logos)) {
      const logoObj = obj.team_logos[0] as Record<string, unknown> | undefined;
      if (logoObj?.team_logo) {
        const teamLogo = logoObj.team_logo as Record<string, unknown>;
        logo_url = teamLogo.url ? String(teamLogo.url) : null;
      }
    }
    if ('managers' in obj && Array.isArray(obj.managers)) {
      for (const m of obj.managers) {
        const mgr = (m as Record<string, unknown>).manager as Record<string, unknown> | undefined;
        if (mgr) {
          managers.push({
            manager_id: String(mgr.manager_id || ''),
            nickname: String(mgr.nickname || ''),
            image_url: mgr.image_url ? String(mgr.image_url) : undefined,
          });
        }
      }
    }
  }

  return { team_key, team_id, name, logo_url, managers };
}

/**
 * Extract both teams from a matchup in a normalized format
 */
export function extractMatchupTeams(matchup: Matchup): Array<{
  team_key: string;
  team_id: string;
  name: string;
  logo_url: string | null;
  managers: Array<{ manager_id: string; nickname: string; image_url?: string }>;
  stats: TeamStats | undefined;
  points: TeamPoints | undefined;
  remaining_games: TeamRemainingGames | undefined;
}> {
  const teams: Array<{
    team_key: string;
    team_id: string;
    name: string;
    logo_url: string | null;
    managers: Array<{ manager_id: string; nickname: string; image_url?: string }>;
    stats: TeamStats | undefined;
    points: TeamPoints | undefined;
    remaining_games: TeamRemainingGames | undefined;
  }> = [];

  const teamsWrapper = matchup["0"];
  if (!teamsWrapper) return teams;

  const teamsContainer = teamsWrapper.teams;
  
  for (const key of ["0", "1"] as const) {
    const teamContainer = teamsContainer[key];
    if (!teamContainer) continue;

    const [teamInfoArray, statsObj] = teamContainer.team;
    const info = extractTeamInfo(teamInfoArray);

    teams.push({
      ...info,
      stats: statsObj.team_stats,
      points: statsObj.team_points,
      remaining_games: statsObj.team_remaining_games,
    });
  }

  return teams;
}

/**
 * Find the current matchup for a specific team
 */
export function findTeamMatchup(
  matchups: Matchup[],
  teamKey: string
): Matchup | null {
  for (const matchup of matchups) {
    const teams = extractMatchupTeams(matchup);
    if (teams.some(t => t.team_key === teamKey)) {
      return matchup;
    }
  }
  return null;
}
