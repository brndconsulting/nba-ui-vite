/**
 * HeaderSelectors - League + Team Selectors for Header
 * 
 * Spec v1.2:
 * - Liga: Select desde /v1/context (leagues[])
 * - Equipo: Select desde /v1/league-teams (teams[])
 * - 100% shadcn/ui (Select component)
 */
import { useAppContext } from '@/contexts/ContextProvider';
import { useLeagueTeams } from '@/hooks/useLeagueTeams';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

export function HeaderSelectors() {
  const { context, loading: contextLoading, activeLeague, activeTeam, setActiveContext } = useAppContext();
  const { teams, loading: teamsLoading } = useLeagueTeams(activeLeague?.league_key || null);

  // Handle league change
  const handleLeagueChange = async (leagueKey: string) => {
    // Set league first, team will be selected after teams load
    // Teams come from /v1/league-teams, not from context
    await setActiveContext(leagueKey, undefined);
  };

  // Handle team change
  const handleTeamChange = async (teamKey: string) => {
    if (activeLeague) {
      await setActiveContext(activeLeague.league_key, teamKey);
    }
  };

  if (contextLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-28" />
      </div>
    );
  }

  if (!context || context.leagues.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {/* League Selector */}
      <Select
        value={activeLeague?.league_key || ''}
        onValueChange={handleLeagueChange}
      >
        <SelectTrigger className="w-[180px] h-9">
          <SelectValue placeholder="Select league">
            <span className="truncate block max-w-[140px]">
              {activeLeague?.name || "Select league"}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {context.leagues.map((league) => (
            <SelectItem key={league.league_key} value={league.league_key}>
              <span className="truncate">{league.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Team Selector - uses /v1/league-teams */}
      {activeLeague && (
        <Select
          value={activeTeam?.team_key || ''}
          onValueChange={handleTeamChange}
          disabled={teamsLoading}
        >
          <SelectTrigger className="w-[160px] h-9">
            {teamsLoading ? (
              <Skeleton className="h-4 w-20" />
            ) : (
              <SelectValue placeholder="Select team">
                <span className="truncate block max-w-[120px]">
                  {activeTeam?.name || "Select team"}
                </span>
              </SelectValue>
            )}
          </SelectTrigger>
          <SelectContent>
            {teams.map((team) => (
              <SelectItem key={team.team_key} value={team.team_key}>
                <div className="flex items-center gap-2">
                  {team.logo_url && (
                    <img 
                      src={team.logo_url} 
                      alt="" 
                      className="h-4 w-4 rounded"
                    />
                  )}
                  <span className="truncate">{team.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
