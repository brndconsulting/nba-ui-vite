/**
 * StandingsSnapshot Component
 * 
 * Shows league standings in a compact table
 * 100% shadcn/ui components only
 */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AlertCircle, Trophy } from 'lucide-react';
import type { TeamStanding } from '@/hooks/useStandings';

interface StandingsSnapshotProps {
  standings: TeamStanding[];
  myTeamKey: string | null;
  loading: boolean;
  error: string | null;
  lastSyncAt: string | null;
}

export function StandingsSnapshot({
  standings,
  myTeamKey,
  loading,
  error,
  lastSyncAt,
}: StandingsSnapshotProps) {
  if (error) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Standings
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
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (standings.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Standings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Standings not available
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Sort by rank
  const sortedStandings = [...standings].sort((a, b) => 
    (a.team_standings?.rank || 99) - (b.team_standings?.rank || 99)
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Standings
          </CardTitle>
          {lastSyncAt && (
            <span className="text-xs text-muted-foreground">
              {new Date(lastSyncAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Team</TableHead>
              <TableHead className="text-right">W-L-T</TableHead>
              <TableHead className="text-right">%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedStandings.map(team => {
              const isMyTeam = team.team_key === myTeamKey;
              const outcomes = team.team_standings?.outcome_totals;
              
              return (
                <TableRow 
                  key={team.team_key}
                  className={isMyTeam ? 'bg-muted/50' : undefined}
                >
                  <TableCell className="font-medium">
                    {team.team_standings?.rank || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${isMyTeam ? 'font-medium' : ''}`}>
                        {team.name}
                      </span>
                      {isMyTeam && (
                        <Badge variant="outline" className="text-xs">You</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {outcomes ? `${outcomes.wins}-${outcomes.losses}-${outcomes.ties}` : '-'}
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {outcomes?.percentage || '-'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
