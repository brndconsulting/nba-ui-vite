/**
 * Zod schemas para validación de Insider Engine
 */
import { z } from 'zod';

// Evidence

export const evidenceSchema = z.object({
  domain: z.string(),
  scope: z.object({
    league_key: z.string(),
    team_key: z.string().nullable().optional(),
  }),
  checksum: z.string(),
  last_sync_at: z.string().datetime(),
  path: z.string().nullable().optional(),
});

// Card

export const cardSchema = z.object({
  id: z.enum(['card_1', 'card_2', 'card_3', 'card_4']),
  type: z.enum(['positive', 'negative', 'neutral', 'info']),
  title_key: z.string(),
  body_key: z.string(),
  params: z.record(z.string(), z.any()).default({}),
  actions: z.array(
    z.object({
      label_key: z.string(),
      action: z.string(),
      route: z.string().nullable().optional(),
    })
  ).default([]),
  evidence: z.array(evidenceSchema).min(1),
});

// Insider Data

export const insiderDataSchema = z.object({
  cards: z.array(cardSchema).refine(
    (cards: Card[]) => cards.length === 4,
    { message: 'Debe haber exactamente 4 cards' }
  ),
  meta: z.object({
    last_sync_at_min: z.string().datetime(),
    last_sync_at_max: z.string().datetime(),
  }),
});

// Insider Envelope

export const insiderEnvelopeSchema = z.object({
  success: z.boolean(),
  data: insiderDataSchema.nullable(),
  errors: z.array(z.any()).default([]),
  meta: z.object({
    owner_id: z.string().nullable().optional(),
    league_key: z.string().nullable().optional(),
    team_key: z.string().nullable().optional(),
    timestamp: z.string().datetime(),
    from_cache: z.boolean(),
  }),
  capabilities: z.any().optional(),
});

// Type exports
export type Evidence = z.infer<typeof evidenceSchema>;
export type Card = z.infer<typeof cardSchema>;
export type InsiderData = z.infer<typeof insiderDataSchema>;
export type InsiderEnvelope = z.infer<typeof insiderEnvelopeSchema>;
