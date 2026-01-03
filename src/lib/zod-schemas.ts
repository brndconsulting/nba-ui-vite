import { z } from "zod"

export const APIErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  field: z.string().optional(),
})

export const APIMetaSchema = z.object({
  owner_id: z.string(),
  league_id: z.string().optional(),
  team_id: z.string().optional(),
  snapshot_date: z.string().datetime(),
  from_cache: z.boolean(),
  last_sync_at: z.record(z.string(), z.object({
    at: z.string().datetime().optional(),
    status: z.enum(["fresh", "stale", "missing"]),
    source: z.string(),
  })),
})

export const APICapabilitiesSchema = z.object({
  sport: z.string(),
  scoring_type: z.enum(["categories", "points", "unknown"]),
  has_categories: z.boolean(),
  has_points: z.boolean(),
  supports_waivers: z.boolean(),
  supports_injuries: z.boolean(),
  supports_trending: z.boolean(),
  supports_schedule: z.boolean(),
  supports_records: z.boolean(),
  supports_player_notes: z.boolean(),
})

export const createAPIResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => z.object({
  success: z.boolean(),
  data: dataSchema.optional(),
  errors: z.array(APIErrorSchema).optional(),
  meta: APIMetaSchema,
  capabilities: APICapabilitiesSchema,
})
