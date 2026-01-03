/**
 * AllMatchupsThisWeek Component
 * 
 * Shows all matchups for the current week in the league
 * 100% shadcn/ui components only
 */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Users } from 'lucide-react';
import type { NormalizedMatchup } from '@/hooks/useMatchups';

interface AllMatchupsThisWeekProps {
  matchups: NormalizedMatchup[];
  myTeamKey: string | null;
  week: number | null;
  loading: boolean;
  error: string | null;
}

function MatchupRow({ 
  matchup, 
  myTeamKey 
}: { 
  matchup: NormalizedMatchup; 
  myTeamKey: string | null;
}) {
  const team1 = matchup.teams[0];
  const team2 = matchup.teams[1];
  const isMyMatchup = team1?.team_key === myTeamKey || team2?.team_key === myTeamKey;

  return (
    <div className={`flex items-center justify-between py-2 ${isMyMatchup ? 'bg-muted/50 px-2 rounded' : ''}`}>
      <div className="flex-1 text-right">
        <span className={`text-sm ${team1?.team_key === myTeamKey ? 'font-medium' : ''}`}>
          {team1?.name || 'TBD'}
        </span>
        {team1?.points_total !== null && (
          <span className="text-xs text-muted-foreground ml-1">
            ({team1.points_total})
          </span>
        )}
      </div>
      
      <div className="px-3">
        <span className="text-xs text-muted-foreground">vs</span>
      </div>
      
      <div className="flex-1 text-left">
        <span className={`text-sm ${team2?.team_key === myTeamKey ? 'font-medium' : ''}`}>
          {team2?.name || 'TBD'}
        </span>
        {team2?.points_total !== null && (
          <span className="text-xs text-muted-foreground ml-1">
            ({team2.points_total})
          </span>
        )}
      </div>

      {matchup.winner_team_key && (
        <Badge variant="outline" className="ml-2 text-xs">
          {matchup.winner_team_key === team1?.team_key ? '←' : '→'}
        </Badge>
      )}
    </div>
  );
}

export function AllMatchupsThisWeek({
  matchups,
  myTeamKey,
  week,
  loading,
  error,
}: AllMatchupsThisWeekProps) {
  if (error) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            All Matchups
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

  if (matchups.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            All Matchups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No matchups available for this week
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            All Matchups
          </CardTitle>
          {week && (
            <Badge variant="secondary">Week {week}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {matchups.map((matchup, index) => (
            <MatchupRow 
              key={`${matchup.week}-${index}`} 
              matchup={matchup} 
              myTeamKey={myTeamKey} 
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
