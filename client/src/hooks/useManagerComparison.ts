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

        // Fetch league teams to get logos
        const teamsUrl = API_ENDPOINTS.leagueTeams(leagueKey);
        const teamsResponse = await fetch(teamsUrl);
        const teamsData = (await teamsResponse.json()) as { data?: { teams?: Array<{ team_key: string; logo_url: string }> } };
        const teams = teamsData.data?.teams || [];

        // Fetch matchups to get standings data
        const matchupsUrl = API_ENDPOINTS.matchups(leagueKey, teamKey);
        const matchupsResponse = await fetch(matchupsUrl);
        const matchupsData = (await matchupsResponse.json()) as { data?: { standings?: Record<string, any> } };
        const standings = matchupsData.data?.standings || {};

        // Create a map of team_key -> logo_url
        const logoMap = new Map(teams.map(t => [t.team_key, t.logo_url]));
        
        if (!managers || managers.length === 0) {
          setError('No managers found in league');
          setLoading(false);
          return;
        }

        // Find your manager
        const yourManager = managers.find((m: Manager) => m.team_key === teamKey);
        if (yourManager) {
          const yourStandings = standings[yourManager.team_key] || {};
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
            const opponentStandings = standings[opponentManager.team_key] || {};
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
