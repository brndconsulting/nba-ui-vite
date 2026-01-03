/**
 * API Response Schemas (Zod)
 * Based on ACTUAL backend response structures from nba-api
 * 
 * Design Rule: All nullable fields use .nullable() to handle null from API
 * All optional fields use .optional() for fields that may not exist
 */
import { z } from "zod";

// ===== Common Envelope =====

export const MetaSchema = z.object({
  owner_id: z.string(),
  snapshot_date: z.string(),
  from_cache: z.boolean(),
  last_sync_at: z.string(),
});

export const CapabilitiesSchema = z.object({
  has_context: z.boolean().optional().default(false),
  has_settings: z.boolean().optional().default(false),
  has_matchups: z.boolean().optional().default(false),
  has_waivers: z.boolean().optional().default(false),
  has_analytics: z.boolean().optional().default(false),
  has_roster: z.boolean().optional().default(false),
  has_standings: z.boolean().optional().default(false),
  has_schedule: z.boolean().optional().default(false),
  has_team_stats: z.boolean().optional().default(false),
  has_player_pool: z.boolean().optional().default(false),
  has_manager_profiles: z.boolean().optional().default(false),
  has_sync_status: z.boolean().optional().default(false),
});

export const ErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.string(), z.unknown()).optional(),
});

// Base envelope - meta and capabilities may be missing in some responses
export const BaseEnvelopeSchema = z.object({
  success: z.boolean().optional().default(true),
  meta: MetaSchema.optional(),
  capabilities: CapabilitiesSchema.optional(),
  errors: z.array(ErrorSchema).nullable().optional().transform(v => v ?? []),
});

// ===== Context Schemas (/v1/context) =====

// League from /v1/context - NO teams nested
export const LeagueSchema = z.object({
  league_key: z.string(),
  league_id: z.string().optional(),
  name: z.string(),
  season: z.union([z.number(), z.string()]),
  game_key: z.string(),
  scoring_type: z.string().nullable().optional(),
  num_teams: z.number().optional(),
  current_week: z.union([z.number(), z.string(), z.null()]).optional(),
  url: z.string().optional(),
  logo_url: z.string().nullable().optional(), // Can be "false" string
});

export const ContextDataSchema = z.object({
  owner_id: z.string().optional(),
  leagues_count: z.number().optional(),
  leagues: z.array(LeagueSchema).default([]),
  active_league_key: z.string().nullable().optional(),
  active_team_key: z.string().nullable().optional(),
  sync_status: z.record(z.string(), z.any()).optional(),
});

export const ContextResponseSchema = BaseEnvelopeSchema.extend({
  data: ContextDataSchema.nullable(),
});

// ===== League Teams Schemas (/v1/league-teams) =====

export const TeamSchema = z.object({
  team_key: z.string(),
  team_id: z.string(),
  name: z.string(),
  manager_id: z.string().nullable().optional(),
  manager_name: z.string().nullable().optional(),
  logo_url: z.string().nullable().optional(),
  waiver_priority: z.number().optional(),
  number_of_moves: z.number().optional(),
  number_of_trades: z.number().optional(),
});

export const LeagueTeamsDataSchema = z.object({
  league_key: z.string(),
  teams_count: z.number().optional(),
  teams: z.array(TeamSchema).default([]),
  sync_status: z.record(z.string(), z.any()).optional(),
});

export const LeagueTeamsResponseSchema = BaseEnvelopeSchema.extend({
  data: LeagueTeamsDataSchema.nullable(),
});

// ===== Sync Status Schemas (/v1/sync-status) =====

export const SyncDomainStatusSchema = z.object({
  status: z.enum(["fresh", "stale", "missing"]),
  last_sync_at: z.string().nullable(),
  message: z.string(),
  display_name: z.string().optional(),
  description: z.string().optional(),
});

export const SyncStatusDataSchema = z.object({
  sync_status: z.record(z.string(), SyncDomainStatusSchema),
  overall_status: z.enum(["fresh", "stale", "incomplete"]),
  league_key: z.string().nullable(),
  owner_id: z.string(),
  domains_count: z.number().optional(),
});

export const SyncStatusResponseSchema = BaseEnvelopeSchema.extend({
  data: SyncStatusDataSchema.nullable(),
});

// ===== Settings Schemas (/v1/settings) =====

export const StatCategorySchema = z.object({
  stat_id: z.number(),
  name: z.string(),
  display_name: z.string(),
  sort_order: z.number().optional(),
  is_only_display_stat: z.boolean().optional(),
  position_type: z.string().optional(),
});

export const RosterPositionSchema = z.object({
  position: z.string(),
  position_type: z.string().optional(),
  count: z.number().optional(),
  is_starting_position: z.boolean().optional(),
});

export const SettingsDataSchema = z.object({
  league_key: z.string(),
  league_name: z.string().optional(),
  season: z.union([z.number(), z.string()]).optional(),
  game_code: z.string().optional(),
  scoring_type: z.string().optional(),
  is_categories: z.boolean().optional(),
  is_points: z.boolean().optional(),
  has_categories: z.boolean().optional(),
  has_team_stats: z.boolean().optional(),
  has_player_pool: z.boolean().optional(),
  has_schedule: z.boolean().optional(),
  num_teams: z.number().optional(),
  num_playoff_teams: z.number().optional(),
  playoff_start_week: z.number().optional(),
  current_week: z.union([z.number(), z.string()]).optional(),
  start_week: z.union([z.number(), z.string()]).optional(),
  end_week: z.union([z.number(), z.string()]).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  trade_end_date: z.string().optional(),
  trade_ratify_type: z.string().optional(),
  waiver_type: z.string().optional(),
  waiver_rule: z.string().optional(),
  uses_faab: z.boolean().optional(),
  uses_playoff: z.boolean().optional(),
  stat_categories: z.array(StatCategorySchema).optional(),
  roster_positions: z.array(RosterPositionSchema).optional(),
});

export const SettingsResponseSchema = BaseEnvelopeSchema.extend({
  data: SettingsDataSchema.nullable(),
});

// ===== Standings Schemas (/v1/standings) =====

export const TeamStandingsSchema = z.object({
  rank: z.number(),
  playoff_seed: z.string().optional(),
  outcome_totals: z.object({
    wins: z.string(),
    losses: z.string(),
    ties: z.string(),
    percentage: z.string(),
  }).optional(),
  games_back: z.string().optional(),
});

export const StandingsTeamSchema = z.object({
  team_key: z.string(),
  team_id: z.string().optional(),
  name: z.string(),
  logo_url: z.string().nullable().optional(),
  managers: z.array(z.any()).optional(),
  team_stats: z.any().optional(),
  team_points: z.any().optional(),
  team_standings: TeamStandingsSchema.optional(),
});

export const StandingsDataSchema = z.object({
  league_key: z.string(),
  week: z.union([z.number(), z.string()]).optional(),
  teams_count: z.number().optional(),
  teams: z.array(StandingsTeamSchema).default([]),
});

export const StandingsResponseSchema = BaseEnvelopeSchema.extend({
  data: StandingsDataSchema.nullable(),
});

// ===== Player Pool Schemas (/v1/player-pool) =====

export const PlayerNameSchema = z.object({
  full: z.string(),
  first: z.string().optional(),
  last: z.string().optional(),
  ascii_first: z.string().optional(),
  ascii_last: z.string().optional(),
});

export const PlayerSchema = z.object({
  player_key: z.string(),
  player_id: z.string(),
  name: PlayerNameSchema,
  editorial_team_full_name: z.string().optional(),
  editorial_team_abbr: z.string().optional(),
  display_position: z.string().optional(),
  primary_position: z.string().optional(),
  headshot: z.object({
    url: z.string(),
    size: z.string().optional(),
  }).optional(),
  image_url: z.string().optional(),
  eligible_positions: z.array(z.object({ position: z.string() })).optional(),
  games_week_total: z.number().optional(),
  games_remaining_week: z.number().optional(),
  games_by_day: z.record(z.string(), z.number()).optional(),
  next_games: z.array(z.any()).optional(),
  schedule_available: z.boolean().optional(),
  next_game: z.any().nullable().optional(),
});

export const PlayerPoolDataSchema = z.object({
  league_key: z.string(),
  sport: z.string().optional(),
  players_count: z.number().optional(),
  week_info: z.any().optional(),
  schedule_info: z.any().optional(),
  players: z.array(PlayerSchema).default([]),
  raw: z.any().optional(),
});

export const PlayerPoolResponseSchema = BaseEnvelopeSchema.extend({
  data: PlayerPoolDataSchema.nullable(),
});

// ===== Type Exports =====

export type Meta = z.infer<typeof MetaSchema>;
export type Capabilities = z.infer<typeof CapabilitiesSchema>;
export type ApiError = z.infer<typeof ErrorSchema>;
export type League = z.infer<typeof LeagueSchema>;
export type Team = z.infer<typeof TeamSchema>;
export type ContextData = z.infer<typeof ContextDataSchema>;
export type ContextResponse = z.infer<typeof ContextResponseSchema>;
export type LeagueTeamsData = z.infer<typeof LeagueTeamsDataSchema>;
export type LeagueTeamsResponse = z.infer<typeof LeagueTeamsResponseSchema>;
export type SyncDomainStatus = z.infer<typeof SyncDomainStatusSchema>;
export type SyncStatusData = z.infer<typeof SyncStatusDataSchema>;
export type SyncStatusResponse = z.infer<typeof SyncStatusResponseSchema>;
export type StatCategory = z.infer<typeof StatCategorySchema>;
export type RosterPosition = z.infer<typeof RosterPositionSchema>;
export type SettingsData = z.infer<typeof SettingsDataSchema>;
export type SettingsResponse = z.infer<typeof SettingsResponseSchema>;
export type TeamStandings = z.infer<typeof TeamStandingsSchema>;
export type StandingsTeam = z.infer<typeof StandingsTeamSchema>;
export type StandingsData = z.infer<typeof StandingsDataSchema>;
export type StandingsResponse = z.infer<typeof StandingsResponseSchema>;
export type PlayerName = z.infer<typeof PlayerNameSchema>;
export type Player = z.infer<typeof PlayerSchema>;
export type PlayerPoolData = z.infer<typeof PlayerPoolDataSchema>;
export type PlayerPoolResponse = z.infer<typeof PlayerPoolResponseSchema>;

// ===== UI State Types =====

export type DataState = "loading" | "empty" | "missing" | "stale" | "error" | "ready";

export interface UIState<T> {
  state: DataState;
  data: T | null;
  error: string | null;
  lastSyncAt: string | null;
  reason: string | null;
}
