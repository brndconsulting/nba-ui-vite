import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/config/api';
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

        // Fetch managers
        const managersUrl = API_ENDPOINTS.leagueManagers(leagueKey);
        const managersResponse = await fetch(managersUrl);

        if (!managersResponse.ok) {
          throw new Error('Failed to fetch league managers');
        }

        const managersData = (await managersResponse.json()) as { data?: { managers?: Manager[] } };
        const managers = managersData.data?.managers || [];

        // Fetch league teams to get logos and match with standings
        const teamsUrl = API_ENDPOINTS.leagueTeams(leagueKey);
        const teamsResponse = await fetch(teamsUrl);
        const teamsData = (await teamsResponse.json()) as { data?: { teams?: Array<{ team_key: string; logo_url: string }> } };
        const teams = teamsData.data?.teams || [];

        // Fetch standings data
        const standingsUrl = API_ENDPOINTS.standings(leagueKey);
        const standingsResponse = await fetch(standingsUrl);
        const standingsData = (await standingsResponse.json()) as { data?: { teams?: Array<{ team_standings?: any }> } };
        const standingsArray = standingsData.data?.teams || [];
        
        // Create a map of team_key -> logo_url
        const logoMap = new Map(teams.map(t => [t.team_key, t.logo_url]));
        
        // Map standings by rank (index) to team_key
        // The standings array is ordered by rank (1st place is index 0, 2nd place is index 1, etc.)
        const standingsByTeamKey: Record<string, any> = {};
        standingsArray.forEach((standingData: any, index: number) => {
          if (standingData.team_standings && managers[index]) {
            const managerAtIndex = managers[index];
            standingsByTeamKey[managerAtIndex.team_key] = {
              position: standingData.team_standings.rank,
              wins: parseInt(standingData.team_standings.outcome_totals?.wins || '0'),
              losses: parseInt(standingData.team_standings.outcome_totals?.losses || '0'),
              ties: parseInt(standingData.team_standings.outcome_totals?.ties || '0'),
            };
          }
        });
        
        if (!managers || managers.length === 0) {
          setError('No managers found in league');
          setLoading(false);
          return;
        }

        // Find your manager
        const yourManager = managers.find((m: Manager) => m.team_key === teamKey);
        if (yourManager) {
          const yourStandings = standingsByTeamKey[yourManager.team_key] || {};
            setYou({
              nickname: yourManager.nickname,
              felo_score: yourManager.felo_score,
              felo_tier: yourManager.felo_tier,
              image_url: logoMap.get(yourManager.team_key) || yourManager.image_url,
              team_name: yourManager.team_name,
              team_key: yourManager.team_key,
              position: yourStandings.position,
              wins: yourStandings.wins,
              losses: yourStandings.losses,
              ties: yourStandings.ties,
              points_for: yourStandings.points_for,
              points_against: yourStandings.points_against,
            });
        }

        // Find opponent manager
        if (opponentTeamKey) {
          const opponentManager = managers.find((m: Manager) => m.team_key === opponentTeamKey);
          if (opponentManager) {
            const opponentStandings = standingsByTeamKey[opponentManager.team_key] || {};
            setOpponent({
              nickname: opponentManager.nickname,
              felo_score: opponentManager.felo_score,
              felo_tier: opponentManager.felo_tier,
              image_url: logoMap.get(opponentManager.team_key) || opponentManager.image_url,
              team_name: opponentManager.team_name,
              team_key: opponentManager.team_key,
              position: opponentStandings.position,
              wins: opponentStandings.wins,
              losses: opponentStandings.losses,
              ties: opponentStandings.ties,
              points_for: opponentStandings.points_for,
              points_against: opponentStandings.points_against,
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
