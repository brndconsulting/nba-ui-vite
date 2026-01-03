import { useState, useEffect } from 'react';
import { Manager } from '@/components/dashboard/ManagerComparison';

interface UseManagerComparisonResult {
  you: Manager | null;
  opponent: Manager | null;
  loading: boolean;
  error: string | null;
}

export function useManagerComparison(
  leagueKey: string,
  teamKey: string,
  opponentTeamKey?: string
): UseManagerComparisonResult {
  const [you, setYou] = useState<Manager | null>(null);
  const [opponent, setOpponent] = useState<Manager | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!leagueKey || !teamKey) {
      setLoading(false);
      return;
    }

    const fetchManagers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/v1/league-managers?league_key=${leagueKey}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch league managers');
        }

        const data = (await response.json()) as { data?: { managers?: Manager[] } };
        const managers = data.data?.managers || [];

        // Find your manager
        const yourManager = managers.find((m: Manager) => m.team_key === teamKey);
        if (yourManager) {
          setYou({
            nickname: yourManager.nickname,
            felo_score: yourManager.felo_score,
            felo_tier: yourManager.felo_tier,
            image_url: yourManager.image_url,
            team_name: yourManager.team_name,
            team_key: yourManager.team_key,
            is_commissioner: yourManager.is_commissioner,
          });
        }

        // Find opponent manager
        if (opponentTeamKey) {
          const opponentManager = managers.find((m: Manager) => m.team_key === opponentTeamKey);
          if (opponentManager) {
            setOpponent({
              nickname: opponentManager.nickname,
              felo_score: opponentManager.felo_score,
              felo_tier: opponentManager.felo_tier,
              image_url: opponentManager.image_url,
              team_name: opponentManager.team_name,
              team_key: opponentManager.team_key,
              is_commissioner: opponentManager.is_commissioner,
            });
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load managers');
      } finally {
        setLoading(false);
      }
    };

    fetchManagers();
  }, [leagueKey, teamKey, opponentTeamKey]);

  return { you, opponent, loading, error };
}
