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
  InsiderRecommendations,
  RealVsProjection,
  WeekMatchupCard,
  PlayerAlerts,
  StandingsSnapshot,
  AllMatchupsThisWeek,
  H2HHistory,
  MetaSyncFooter,
} from '@/components/dashboard';

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
  } = useRoster(teamKey);

  const {
    standings,
    loading: standingsLoading,
    error: standingsError,
    lastSyncAt: standingsLastSyncAt,
  } = useStandings(leagueKey);

  const {
    settings,
    loading: settingsLoading,
  } = useSettings(leagueKey);

  // Get opponent team key from matchup
  const opponentTeamKey = matchup?.teams.find(t => t.team_key !== teamKey)?.team_key;

  // Fetch manager comparison data
  const {
    you: managerYou,
    opponent: managerOpponent,
    loading: managersComparisonLoading,
  } = useManagerComparison(leagueKey, teamKey, opponentTeamKey);

  // Note: legacy managers data not used, using new useManagerComparison hook instead

  // Get stat categories from settings
  const statCategories = settings?.stat_categories || capabilities?.stat_categories || [];

  // Check if we have required inputs for Insider
  const hasInsiderInputs = !!(settings && matchup && rosterPlayers.length > 0);
  const missingInsiderInputs: string[] = [];
  if (!settings) missingInsiderInputs.push('settings');
  if (!matchup) missingInsiderInputs.push('matchups');
  if (rosterPlayers.length === 0) missingInsiderInputs.push('roster');

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
        you={managerYou}
        opponent={managerOpponent}
        loading={managersComparisonLoading}
      />

      {/* 2. Insider Recommendations */}
      <InsiderRecommendations
        tips={[]} // No tips yet - backend doesn't provide them
        loading={matchupsLoading || settingsLoading || rosterLoading}
        error={null}
        hasRequiredInputs={hasInsiderInputs}
        missingInputs={missingInsiderInputs}
      />

      {/* 3. Real vs Projection */}
      <RealVsProjection
        weekActual={weekActual}
        projection={null} // Backend doesn't provide projection
        loading={matchupsLoading}
        error={null}
        projectionAvailable={false}
        projectionMissingReason="Projection not implemented by backend"
        lastSyncAt={lastSyncAt?.toISOString() || null}
      />

      {/* 4. Week Matchup Card + Breakdown */}
      <WeekMatchupCard
        matchup={matchup}
        myTeamKey={teamKey}
        statCategories={statCategories}
        loading={matchupsLoading || capabilitiesLoading}
        error={null}
        lastSyncAt={lastSyncAt?.toISOString() || null}
      />

      {/* 5. Player Alerts */}
      <PlayerAlerts
        players={rosterPlayers}
        loading={rosterLoading}
        error={rosterError}
        lastSyncAt={rosterLastSyncAt}
      />

      {/* 6. All Matchups This Week */}
      <AllMatchupsThisWeek
        matchups={allMatchups}
        myTeamKey={teamKey}
        week={typeof currentWeek === 'string' ? parseInt(currentWeek) : currentWeek ?? null}
        loading={matchupsLoading}
        error={null}
      />

      {/* 7. H2H History (MissingState permanente V1.3) */}
      <H2HHistory lastCheckedAt={new Date().toISOString()} />

      {/* 8. Standings Snapshot */}
      <StandingsSnapshot
        standings={standings}
        myTeamKey={teamKey}
        loading={standingsLoading}
        error={standingsError}
        lastSyncAt={standingsLastSyncAt}
      />

      {/* 9. Meta Sync Footer (data health) */}
      <MetaSyncFooter
        syncStatus={{
          overall_status: isStale ? 'stale' : 'fresh',
          domains: {
            matchups: {
              status: isStale ? 'stale' : 'fresh',
              last_sync_at: lastSyncAt?.toISOString() || null,
            },
            roster: {
              status: rosterLastSyncAt ? 'fresh' : 'missing',
              last_sync_at: rosterLastSyncAt || null,
            },
          },
        }}
        canSync={false}
      />
    </div>
  );
}
