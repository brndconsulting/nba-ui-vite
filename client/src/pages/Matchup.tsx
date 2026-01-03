/**
 * Matchup Page (Dashboard Tab)
 * 
 * Layout order per spec v1.3:
 * 1. Manager vs Manager
 * 2. Insider Recommendations (4 cards 2x2)
 * 3. Real vs Projection
 * 4. Week Matchup Card + Breakdown
 * 5. Player Alerts
 * 6. All Matchups This Week
 * 7. Standings Snapshot
 * 
 * 100% shadcn/ui components only
 */
import { useAppContext } from '@/contexts/ContextProvider';
import { useMatchups, useCapabilities } from '@/hooks/useMatchups';
import { useLeagueManagers } from '@/hooks/useLeagueManagers';
import { useRoster } from '@/hooks/useRoster';
import { useStandings } from '@/hooks/useStandings';
import { useSettings } from '@/hooks/useSettings';
import { useManagerComparison } from '@/hooks/useManagerComparison';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Clock } from 'lucide-react';
import { ErrorState } from '@/components/states';
import {
  ManagerComparison,
  RealVsProjection,
  WeekMatchupCard,
  PlayerAlerts,
  StandingsSnapshot,
  AllMatchupsThisWeek,
  H2HHistory,
  MetaSyncFooter,
} from '@/components/dashboard';
import { InsiderTipsSection } from '@/components/dashboard/InsiderTipsSection';

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function StaleDataAlert({
  lastSyncAt,
  isStale,
}: {
  lastSyncAt: Date | null;
  isStale: boolean;
}) {
  if (!isStale || !lastSyncAt) return null;

  const timeAgo = getTimeAgo(lastSyncAt);

  return (
    <Alert>
      <Clock className="h-4 w-4" />
      <AlertTitle>Stale Data <span className="font-normal text-muted-foreground">{timeAgo}</span></AlertTitle>
      <AlertDescription>
        Matchup data may be outdated
        <br />
        <span className="text-xs text-muted-foreground">
          Last synced: {lastSyncAt.toLocaleString()}
        </span>
      </AlertDescription>
    </Alert>
  );
}

export default function Matchup() {
  const { activeLeague, activeTeam } = useAppContext();
  
  const leagueKey = activeLeague?.league_key || '';
  const teamKey = activeTeam?.team_key || '';

  // Fetch all required data
  const { 
    matchup, 
    allMatchups, 
    currentWeek, 
    loading: matchupsLoading, 
    error: matchupsError,
    lastSyncAt,
    isStale,
  } = useMatchups(leagueKey, teamKey);

  const { 
    capabilities, 
    loading: capabilitiesLoading,
  } = useCapabilities(leagueKey);

  const {
    managers: _managers,
  } = useLeagueManagers(leagueKey);

  const {
    players: rosterPlayers,
    loading: rosterLoading,
    error: rosterError,
    lastSyncAt: rosterLastSyncAt,
  } = useRoster(leagueKey, teamKey);

  const {
    standings,
    loading: standingsLoading,
    error: standingsError,
    lastSyncAt: standingsLastSyncAt,
  } = useStandings(leagueKey);

  const { settings } = useSettings(leagueKey);

  // Get opponent team key from matchup
  const opponentTeamKey = matchup?.teams.find(t => t.team_key !== teamKey)?.team_key;

  // Get stat categories from settings
  const statCategories = settings?.stat_categories || capabilities?.stat_categories || [];

  // Build week actual data for RealVsProjection
  const weekActual = matchup ? {
    week: matchup.week,
    score: matchup.teams.find(t => t.team_key === teamKey)?.points_total?.toString() || '0',
    categories: statCategories.map(cat => ({
      stat_id: cat.stat_id,
      display_name: cat.display_name,
      value: matchup.teams.find(t => t.team_key === teamKey)?.stats.find(s => s.stat_id === String(cat.stat_id))?.value || '-',
    })),
  } : null;

  // Global error state
  if (matchupsError) {
    return (
      <div className="space-y-4">
        <ErrorState 
          errorId="matchups-fetch-error"
          error={matchupsError}
          timestamp={new Date().toISOString()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stale Data Alert */}
      <StaleDataAlert lastSyncAt={lastSyncAt} isStale={isStale} />

      {/* 1. Manager vs Manager */}
      <ManagerComparison
        leagueKey={leagueKey}
        teamKey={teamKey}
        opponentTeamKey={opponentTeamKey}
      />

      {/* 2. Insider Tips */}
      <InsiderTipsSection leagueKey={leagueKey} teamKey={teamKey} />

      {/* 3. Real vs Projection */}
      <RealVsProjection
        weekActual={weekActual}
        projection={null}
        loading={matchupsLoading}
        error={null}
        projectionAvailable={false}
        lastSyncAt={lastSyncAt}
      />

      {/* 4. Week Matchup Card */}
      {matchup && currentWeek !== undefined && currentWeek !== null && (
        <WeekMatchupCard
          week={typeof currentWeek === 'number' ? currentWeek : parseInt(String(currentWeek))}
          teamKey={teamKey}
          loading={matchupsLoading}
        />
      )}

      {/* 5. Player Alerts */}
      <PlayerAlerts
        players={rosterPlayers}
        loading={rosterLoading}
        error={rosterError}
        lastSyncAt={rosterLastSyncAt}
      />

      {/* 6. All Matchups This Week */}
      <AllMatchupsThisWeek
        allMatchups={allMatchups}
        week={typeof currentWeek === 'number' ? currentWeek : currentWeek ? parseInt(String(currentWeek)) : null}
        loading={matchupsLoading}
      />

      {/* 7. Standings Snapshot */}
      <StandingsSnapshot
        standings={standings}
        myTeamKey={teamKey}
        loading={standingsLoading}
        error={standingsError}
        lastSyncAt={standingsLastSyncAt}
      />

      {/* Meta Footer */}
      <MetaSyncFooter
        lastSyncAt={lastSyncAt}
      />
    </div>
  );
}
