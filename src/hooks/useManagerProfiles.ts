import { useState, useEffect } from 'react';
import { ManagerProfile } from '@/components/dashboard/ManagerComparisonCard';

interface UseManagerProfilesResult {
  owner: ManagerProfile | null;
  opponent: ManagerProfile | null;
  loading: boolean;
  error: string | null;
}

export function useManagerProfiles(
  leagueKey: string,
  teamKey: string,
  opponentTeamKey?: string
): UseManagerProfilesResult {
  const [owner, setOwner] = useState<ManagerProfile | null>(null);
  const [opponent, setOpponent] = useState<ManagerProfile | null>(null);
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

        // Fetch league managers
        const managersRes = await fetch(
          `/v1/league-managers?league_key=${leagueKey}`
        );

        if (!managersRes.ok) {
          throw new Error('Failed to fetch league managers');
        }

        const managersData = await managersRes.json();

        if (!managersData.data?.teams) {
          setError('No manager data available');
          return;
        }

        // Extract owner and opponent from the teams data
        const teams = managersData.data.teams;
        let ownerProfile: ManagerProfile | null = null;
        let opponentProfile: ManagerProfile | null = null;

        // Find owner team
        for (const key in teams) {
          const teamData = teams[key]?.team;
          if (!teamData) continue;

          // teamData is an array where the last element contains managers
          const managersArray = teamData[teamData.length - 1];
          if (!managersArray?.managers) continue;

          const manager = managersArray.managers[0]?.manager;
          if (!manager) continue;

          const profile: ManagerProfile = {
            nickname: manager.nickname || 'Unknown',
            tier: manager.felo_tier,
            felo_score: manager.felo_score ? parseInt(manager.felo_score) : undefined,
            image_url: manager.image_url,
          };

          if (manager.team_key === teamKey) {
            ownerProfile = profile;
          }

          if (opponentTeamKey && manager.team_key === opponentTeamKey) {
            opponentProfile = profile;
          }
        }

        setOwner(ownerProfile);
        setOpponent(opponentProfile);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load manager profiles');
      } finally {
        setLoading(false);
      }
    };

    fetchManagers();
  }, [leagueKey, teamKey, opponentTeamKey]);

  return { owner, opponent, loading, error };
}
