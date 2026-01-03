/**
 * PlayerAlerts Component
 * 
 * Shows player injury/status alerts from roster
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
import { AlertCircle, AlertTriangle } from 'lucide-react';
import type { RosterPlayer } from '@/hooks/useRoster';

interface PlayerAlertsProps {
  players: RosterPlayer[];
  loading: boolean;
  error: string | null;
  lastSyncAt: string | null;
}

function getStatusVariant(status?: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status?.toUpperCase()) {
    case 'IL':
    case 'IL+':
    case 'O':
    case 'OUT':
      return 'destructive';
    case 'GTD':
    case 'DTD':
      return 'secondary';
    case 'Q':
    case 'QUESTIONABLE':
      return 'outline';
    default:
      return 'default';
  }
}

export function PlayerAlerts({
  players,
  loading,
  error,
  lastSyncAt,
}: PlayerAlertsProps) {
  // Filter players with injury status
  const injuredPlayers = players.filter(p => p.status && p.status !== 'H');

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Player Alerts
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
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (players.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Player Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Roster not synced yet. Please sync first.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (injuredPlayers.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Player Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No injury alerts. All players healthy.
          </p>
          {lastSyncAt && (
            <p className="text-xs text-muted-foreground mt-2">
              Last sync: {new Date(lastSyncAt).toLocaleString()}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Player Alerts
          </CardTitle>
          <Badge variant="secondary">{injuredPlayers.length}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Note</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {injuredPlayers.map(player => (
              <TableRow key={player.player_key}>
                <TableCell className="text-sm">
                  {player.name.full}
                  <span className="text-xs text-muted-foreground ml-1">
                    ({player.display_position})
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(player.status)}>
                    {player.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {player.injury_note || player.status_full || '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {lastSyncAt && (
          <p className="text-xs text-muted-foreground mt-2 text-right">
            Last sync: {new Date(lastSyncAt).toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
