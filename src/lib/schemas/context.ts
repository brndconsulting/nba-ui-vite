/**
 * Zod schemas para validación de contexto
 * 
 * Based on actual /v1/context backend response
 */
import { z } from 'zod';

export const teamSchema = z.object({
  team_key: z.string(),
  team_id: z.string(),
  name: z.string(),
  manager_id: z.string().nullable().optional(),
  manager_name: z.string().nullable().optional(),
  logo_url: z.string().nullable().optional(),
});

// League from /v1/context - NO teams (teams come from /v1/league-teams)
export const leagueSchema = z.object({
  league_key: z.string(),
  league_id: z.string().optional(),
  name: z.string(),
  season: z.union([z.number(), z.string()]),
  game_key: z.string(),
  scoring_type: z.string().nullable().optional(),
  num_teams: z.number().optional(),
  current_week: z.union([z.number(), z.string(), z.null()]).optional(),
  logo_url: z.string().nullable().optional(), // Can be "false" string from Yahoo
  url: z.string().optional(),
  // is_finished: Yahoo's canonical flag for league status
  // true = league ended, false = active, null/undefined = unknown (backend doesn't have it yet)
  is_finished: z.boolean().nullable().optional(),
  // Optional date fields if backend provides them
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
}).passthrough();

export const contextDataSchema = z.object({
  owner_id: z.string().optional(),
  leagues_count: z.number().optional(),
  leagues: z.array(leagueSchema).default([]),
  active_league_key: z.string().nullable().optional(),
  active_team_key: z.string().nullable().optional(),
  sync_status: z.record(z.string(), z.any()).optional(),
}).passthrough();

// Flexible envelope schema - success may be missing, passthrough for extra fields
export const contextSchema = z.object({
  success: z.boolean().optional().default(true),
  data: contextDataSchema.nullable().optional(),
  errors: z.array(z.any()).nullable().optional(),
  meta: z.any().optional(),
  capabilities: z.any().optional(),
}).passthrough();

export type Team = z.infer<typeof teamSchema>;
export type League = z.infer<typeof leagueSchema>;
export type Context = z.infer<typeof contextDataSchema>;
export type ContextResponse = z.infer<typeof contextSchema>;
