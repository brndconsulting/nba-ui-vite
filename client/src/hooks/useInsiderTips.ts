import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '@/config/api';
import { useMatchups } from './useMatchups';

interface Bullet {
  label?: string;
  text: string;
}

interface EvidenceInput {
  domain: string;
  last_sync_at?: string;
  snapshot_id?: string;
  status?: 'fresh' | 'stale' | 'missing';
}

interface Evidence {
  inputs: EvidenceInput[];
  reasoning?: string;
  notes: string[];
}

export interface InsiderCardData {
  id: string;
  title: string;
  status: 'ready' | 'missing_inputs' | 'empty' | 'coming_soon' | 'error' | 'stale';
  summary: string;
  bullets?: Bullet[];
  impact?: 'low' | 'medium' | 'high' | null;
  confidence?: 'low' | 'medium' | 'high' | null;
  evidence?: Evidence;
  limitations?: string[];
  error?: { error_id: string; message: string };
}

interface UseInsiderTipsState {
  data: InsiderCardData[];
  loading: boolean;
  error: string | null;
  generatedAt: string | null;
}

export const useInsiderTips = (
  leagueKey: string,
  teamKey: string
): UseInsiderTipsState => {
  const [state, setState] = useState<UseInsiderTipsState>({
    data: [],
    loading: true,
    error: null,
    generatedAt: null,
  });

  // Use matchups hook to get locally generated insider data
  const { matchup } = useMatchups(leagueKey, teamKey);

  useEffect(() => {
    if (!leagueKey || !teamKey) {
      setState({
        data: [],
        loading: false,
        error: 'Missing league_key or team_key',
        generatedAt: null,
      });
      return;
    }

    const fetchInsiderTips = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const url = API_ENDPOINTS.matchups(leagueKey, teamKey);
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const json = await response.json() as { data?: { insider?: { generated_at?: string; cards?: InsiderCardData[] } } };

        // Check if insider data exists
        const insiderData = json.data?.insider;

        // If backend doesn't provide insider data, use locally generated insights from matchup
        if (!insiderData && matchup?.insider) {
          const localCards: InsiderCardData[] = matchup.insider.map((card) => ({
            id: card.category,
            title: card.title,
            status: 'ready',
            summary: card.description,
            impact: card.impact as 'low' | 'medium' | 'high',
            bullets: card.action ? [{ text: card.action }] : undefined,
            evidence: {
              inputs: [{ domain: 'matchups', status: 'fresh' }],
              notes: ['Generated locally from matchup data'],
            },
            limitations: [],
          }));

          setState({
            data: localCards,
            loading: false,
            error: null,
            generatedAt: new Date().toISOString(),
          });
          return;
        }

        if (!insiderData) {
          // Backend hasn't implemented insider yet - show MissingState for all 4 cards
          const defaultCards: InsiderCardData[] = [
            {
              id: 'matchup_edge',
              title: 'Matchup Edge',
              status: 'missing_inputs',
              summary: 'Insider engine not provided by backend',
              evidence: {
                inputs: [
                  {
                    domain: 'matchups',
                    status: 'missing',
                  },
                ],
                notes: [],
              },
              limitations: [],
            },
            {
              id: 'streaming_edge',
              title: 'Streaming Edge',
              status: 'missing_inputs',
              summary: 'Insider engine not provided by backend',
              evidence: {
                inputs: [
                  {
                    domain: 'schedule',
                    status: 'missing',
                  },
                ],
                notes: [],
              },
              limitations: [],
            },
            {
              id: 'risk_watch',
              title: 'Risk Watch',
              status: 'missing_inputs',
              summary: 'Insider engine not provided by backend',
              evidence: {
                inputs: [
                  {
                    domain: 'roster',
                    status: 'missing',
                  },
                ],
                notes: [],
              },
              limitations: [],
            },
            {
              id: 'category_swing',
              title: 'Category Swing',
              status: 'missing_inputs',
              summary: 'Insider engine not provided by backend',
              evidence: {
                inputs: [
                  {
                    domain: 'matchups',
                    status: 'missing',
                  },
                ],
                notes: [],
              },
              limitations: [],
            },
          ];

          setState({
            data: defaultCards,
            loading: false,
            error: null,
            generatedAt: null,
          });
          return;
        }

        // Backend provided insider data
        const cards = insiderData.cards || [];

        setState({
          data: cards,
          loading: false,
          error: null,
          generatedAt: insiderData.generated_at || null,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';

        // Fallback to MissingState cards on error
        const defaultCards: InsiderCardData[] = [
          {
            id: 'matchup_edge',
            title: 'Matchup Edge',
            status: 'error',
            summary: 'Failed to load insights',
            error: { error_id: 'FETCH_ERROR', message: errorMessage },
            limitations: [],
          },
          {
            id: 'streaming_edge',
            title: 'Streaming Edge',
            status: 'error',
            summary: 'Failed to load insights',
            error: { error_id: 'FETCH_ERROR', message: errorMessage },
            limitations: [],
          },
          {
            id: 'risk_watch',
            title: 'Risk Watch',
            status: 'error',
            summary: 'Failed to load insights',
            error: { error_id: 'FETCH_ERROR', message: errorMessage },
            limitations: [],
          },
          {
            id: 'category_swing',
            title: 'Category Swing',
            status: 'error',
            summary: 'Failed to load insights',
            error: { error_id: 'FETCH_ERROR', message: errorMessage },
            limitations: [],
          },
        ];

        setState({
          data: defaultCards,
          loading: false,
          error: errorMessage,
          generatedAt: null,
        });
      }
    };

    fetchInsiderTips();
  }, [leagueKey, teamKey, matchup]);

  return state;
};
