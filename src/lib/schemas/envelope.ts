/**
 * Zod schemas para validación de Envelope responses
 * 
 * Este es el SINGLE SOURCE OF TRUTH para validación de contratos
 * Todos los endpoints /v1/* deben retornar un Envelope válido
 */
import { z } from 'zod';

/**
 * ErrorDetail - Error con código estable y mensaje
 */
export const errorDetailSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.string(), z.any()).optional(),
});

/**
 * MetaData - Metadatos presentes en CADA response
 */
export const metaDataSchema = z.object({
  owner_id: z.string(),
  snapshot_date: z.string(),
  from_cache: z.boolean().default(false),
  last_sync_at: z.string(),
});

/**
 * Capabilities - Feature flags para UI rendering
 */
export const capabilitiesSchema = z.object({
  has_context: z.boolean().default(false),
  has_matchups: z.boolean().default(false),
  has_waivers: z.boolean().default(false),
  has_analytics: z.boolean().default(false),
  has_roster: z.boolean().default(false),
  has_standings: z.boolean().default(false),
  has_sync_status: z.boolean().default(false),
});

/**
 * V1Envelope - Universal response envelope para todos los /v1/* endpoints
 * 
 * Reglas:
 * - success siempre presente
 * - meta siempre presente
 * - capabilities siempre presente
 * - data existe solo si success=true
 * - errors existe solo si success=false
 */
export const v1EnvelopeSchema = z.object({
  success: z.boolean(),
  meta: metaDataSchema,
  capabilities: capabilitiesSchema,
  data: z.record(z.string(), z.any()).nullable().optional(),
  errors: z.array(errorDetailSchema).nullable().optional(),
});

/**
 * Validar que un response sea un Envelope válido
 */
export function validateEnvelope(data: unknown): {
  valid: boolean;
  error?: string;
  envelope?: z.infer<typeof v1EnvelopeSchema>;
} {
  try {
    const envelope = v1EnvelopeSchema.parse(data);
    
    // Validaciones adicionales
    if (envelope.success && !envelope.data) {
      return {
        valid: false,
        error: "success=true but data is missing or null",
      };
    }
    
    if (!envelope.success && !envelope.errors) {
      return {
        valid: false,
        error: "success=false but errors is missing or null",
      };
    }
    
    if (!envelope.meta) {
      return {
        valid: false,
        error: "meta is required in all responses",
      };
    }
    
    if (!envelope.meta.owner_id) {
      return {
        valid: false,
        error: "meta.owner_id is required",
      };
    }
    
    if (!envelope.meta.snapshot_date) {
      return {
        valid: false,
        error: "meta.snapshot_date is required",
      };
    }
    
    if (!envelope.meta.last_sync_at) {
      return {
        valid: false,
        error: "meta.last_sync_at is required",
      };
    }
    
    return {
      valid: true,
      envelope,
    };
  } catch (err) {
    return {
      valid: false,
      error: err instanceof Error ? err.message : "Unknown validation error",
    };
  }
}

/**
 * Obtener estado de sincronización desde last_sync_at
 */
export function getSyncStatus(lastSyncAt: string): 'fresh' | 'stale' | 'missing' {
  if (lastSyncAt === 'missing') {
    return 'missing';
  }
  
  try {
    const lastSync = new Date(lastSyncAt);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastSync.getTime()) / (1000 * 60);
    
    // Fresh: < 5 minutes
    if (diffMinutes < 5) {
      return 'fresh';
    }
    
    // Stale: >= 5 minutes
    return 'stale';
  } catch {
    return 'missing';
  }
}

export type ErrorDetail = z.infer<typeof errorDetailSchema>;
export type MetaData = z.infer<typeof metaDataSchema>;
export type Capabilities = z.infer<typeof capabilitiesSchema>;
export type V1Envelope = z.infer<typeof v1EnvelopeSchema>;
