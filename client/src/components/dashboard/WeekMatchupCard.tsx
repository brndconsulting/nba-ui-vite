/**
 * WeekMatchupCard Component
 * 
 * Shows week matchup with rival, dates, and category breakdown table
 * 100% shadcn/ui components only
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AlertCircle, Trophy, Calendar } from 'lucide-react';
import type { NormalizedMatchup } from '@/hooks/useMatchups';

interface StatCategory {
  stat_id: number;
  name: string;
  display_name: string;
}

interface WeekMatchupCardProps {
  matchup: NormalizedMatchup | null;
  myTeamKey: string | null;
  statCategories?: StatCategory[];
  loading: boolean;
  error: string | null;
  lastSyncAt: string | null;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function getWinnerBadge(isWinner: boolean, isTied: boolean) {
  if (isTied) return <Badge variant="secondary">Tied</Badge>;
  if (isWinner) return <Badge variant="default">Winner</Badge>;
  return null;
}

export function WeekMatchupCard({
  matchup,
  myTeamKey,
  statCategories = [],
  loading,
  error,
  lastSyncAt,
}: WeekMatchupCardProps) {
  if (error) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Week Matchup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-4 w-full" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!matchup) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Week Matchup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No matchup data available for current week
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Find my team and opponent from matchup.teams
  const myTeam = matchup.teams.find(t => t.team_key === myTeamKey) || matchup.teams[0];
  const opponentTeam = matchup.teams.find(t => t.team_key !== myTeamKey) || matchup.teams[1];

  const myTeamWon = matchup.winner_team_key === myTeam?.team_key;
  const opponentWon = matchup.winner_team_key === opponentTeam?.team_key;

  // Build category breakdown from stat_winners and team stats
  const categoryBreakdown = statCategories
    .filter(cat => !cat.display_name.includes('/')) // Filter out display-only stats like FGM/A
    .map(cat => {
      const statWinner = matchup.stat_winners.find(sw => sw.stat_id === String(cat.stat_id));
      const myStatValue = myTeam?.stats.find(s => s.stat_id === String(cat.stat_id))?.value;
      const oppStatValue = opponentTeam?.stats.find(s => s.stat_id === String(cat.stat_id))?.value;
      
      let winner: 'me' | 'opp' | 'tie' | null = null;
      if (statWinner) {
        if (statWinner.is_tied) {
          winner = 'tie';
        } else if (statWinner.winner_team_key === myTeam?.team_key) {
          winner = 'me';
        } else if (statWinner.winner_team_key === opponentTeam?.team_key) {
          winner = 'opp';
        }
      }

      return {
        statId: cat.stat_id,
        displayName: cat.display_name,
        myValue: myStatValue || '-',
        oppValue: oppStatValue || '-',
        winner,
      };
    });

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Week {matchup.week} Matchup
          </CardTitle>
          <div className="flex items-center gap-2">
            {matchup.is_playoffs && <Badge variant="default">Playoffs</Badge>}
            <Badge variant="outline">{matchup.status}</Badge>
          </div>
        </div>
        <CardDescription className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {formatDate(matchup.week_start)} - {formatDate(matchup.week_end)}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Teams Header */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="font-medium text-sm truncate">{myTeam?.name || 'My Team'}</p>
            {myTeam && getWinnerBadge(myTeamWon, matchup.is_tied)}
          </div>
          <div className="flex items-center justify-center">
            <span className="text-xl font-bold text-muted-foreground">vs</span>
          </div>
          <div>
            <p className="font-medium text-sm truncate">{opponentTeam?.name || 'Opponent'}</p>
            {opponentTeam && getWinnerBadge(opponentWon, matchup.is_tied)}
          </div>
        </div>

        {/* Score */}
        {myTeam?.points_total !== null && opponentTeam?.points_total !== null && (
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="text-2xl font-bold">{myTeam.points_total}</div>
            <div className="flex items-center justify-center">
              <span className="text-muted-foreground">-</span>
            </div>
            <div className="text-2xl font-bold">{opponentTeam.points_total}</div>
          </div>
        )}

        <Separator />

        {/* Category Breakdown */}
        {categoryBreakdown.length > 0 ? (
          <div>
            <h4 className="text-sm font-medium mb-2">Category Breakdown</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Me</TableHead>
                  <TableHead className="text-right">Opp</TableHead>
                  <TableHead className="text-center">Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryBreakdown.map(cat => (
                  <TableRow key={cat.statId}>
                    <TableCell className="text-sm">{cat.displayName}</TableCell>
                    <TableCell className="text-right text-sm">{cat.myValue}</TableCell>
                    <TableCell className="text-right text-sm">{cat.oppValue}</TableCell>
                    <TableCell className="text-center">
                      {cat.winner === 'me' && <Badge variant="default">W</Badge>}
                      {cat.winner === 'opp' && <Badge variant="secondary">L</Badge>}
                      {cat.winner === 'tie' && <Badge variant="outline">T</Badge>}
                      {!cat.winner && <span className="text-muted-foreground">-</span>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Category breakdown not available
            </AlertDescription>
          </Alert>
        )}

        {/* Last Sync */}
        {lastSyncAt && (
          <p className="text-xs text-muted-foreground text-right">
            Last sync: {new Date(lastSyncAt).toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
