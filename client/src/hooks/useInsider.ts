/**
 * Hook para consumir insights desde API /v1/insider
 * - Obtiene 4 cards determinísticas
 * - Valida con Zod
 * - Maneja estados (loading, error)
 */
import { useEffect, useState } from 'react';
import { insiderEnvelopeSchema } from '@/lib/schemas/insider';
import { API_BASE } from '@/config/api';
import type { InsiderData } from '@/lib/schemas/insider';

export function useInsider(leagueKey: string, teamKey: string, ownerId?: string) {
  const [insider, setInsider] = useState<InsiderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsider = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          league_key: leagueKey,
          team_key: teamKey,
          ...(ownerId && { owner_id: ownerId }),
        });

        const response = await fetch(
          `${API_BASE}/v1/insider?${params}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await response.json();

        // Validar con Zod
        const validated = insiderEnvelopeSchema.parse(data);

        if (validated.success && validated.data) {
          setInsider(validated.data);
          setError(null);
        } else {
          setError('Error validando insights');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setInsider(null);
      } finally {
        setLoading(false);
      }
    };

    if (leagueKey && teamKey) {
      fetchInsider();
    }
  }, [leagueKey, teamKey, ownerId]);

  return {
    insider,
    loading,
    error,
  };
}
