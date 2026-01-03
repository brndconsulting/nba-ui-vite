/**
 * Hook para validar contratos de API responses en runtime
 * 
 * Valida que todos los responses cumplan con el Envelope schema
 * Proporciona estados: Loading, Empty, Error, Stale
 */
import { useEffect, useState } from 'react';
import { validateEnvelope, getSyncStatus, type V1Envelope } from '@/lib/schemas/envelope';

export type SyncState = 'fresh' | 'stale' | 'missing';
export type DataState = 'loading' | 'empty' | 'error' | 'stale' | 'fresh';

export interface ContractValidationResult {
  valid: boolean;
  error?: string;
  envelope?: V1Envelope;
  syncState?: SyncState;
  dataState?: DataState;
}

/**
 * Validar response y retornar estado
 */
export function useContractValidator(
  response: unknown,
  loading: boolean
): ContractValidationResult {
  const [result, setResult] = useState<ContractValidationResult>({
    valid: false,
    dataState: 'loading',
  });

  useEffect(() => {
    if (loading) {
      setResult({
        valid: false,
        dataState: 'loading',
      });
      return;
    }

    if (!response) {
      setResult({
        valid: false,
        error: 'No response provided',
        dataState: 'empty',
      });
      return;
    }

    const validation = validateEnvelope(response);

    if (!validation.valid) {
      setResult({
        valid: false,
        error: validation.error,
        dataState: 'error',
      });
      return;
    }

    const envelope = validation.envelope!;

    if (!envelope.success) {
      setResult({
        valid: false,
        error: envelope.errors?.[0]?.message || 'Unknown error',
        envelope,
        dataState: 'error',
      });
      return;
    }

    if (!envelope.data || Object.keys(envelope.data).length === 0) {
      setResult({
        valid: true,
        envelope,
        dataState: 'empty',
      });
      return;
    }

    // Determinar si está stale
    const syncState = getSyncStatus(envelope.meta.last_sync_at);
    const dataState: DataState = syncState === 'stale' ? 'stale' : 'fresh';

    setResult({
      valid: true,
      envelope,
      syncState,
      dataState,
    });
  }, [response, loading]);

  return result;
}

/**
 * Hook para mostrar mensaje de estado
 */
export function getStateMessage(state: DataState): string {
  switch (state) {
    case 'loading':
      return 'Cargando...';
    case 'empty':
      return 'Sin datos disponibles';
    case 'error':
      return 'Error al cargar datos';
    case 'stale':
      return 'Datos desactualizados (última sincronización hace más de 5 minutos)';
    case 'fresh':
      return 'Datos actualizados';
    default:
      return 'Estado desconocido';
  }
}

/**
 * Hook para obtener icono de estado
 */
export function getStateIcon(state: DataState): string {
  switch (state) {
    case 'loading':
      return '⏳';
    case 'empty':
      return '📭';
    case 'error':
      return '❌';
    case 'stale':
      return '⚠️';
    case 'fresh':
      return '✅';
    default:
      return '❓';
  }
}
