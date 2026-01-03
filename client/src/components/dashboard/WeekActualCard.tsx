import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

interface MatchupStat {
  stat_key: string;
  display_label: string;
  you_value: string | number | null;
  opponent_value: string | number | null;
  result?: 'W' | 'L' | 'T' | '-';
  value_type?: 'count' | 'ratio' | 'percentage';
}

interface WeekActualCardProps {
  week: number;
  stats: MatchupStat[];
  seriesScore?: string;
  lastSyncAt?: string;
  isLoading?: boolean;
  error?: string;
}

export function WeekActualCard({
  week,
  stats,
  seriesScore,
  lastSyncAt,
  isLoading,
  error,
}: WeekActualCardProps) {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Week {week} Actual</CardTitle>
          <CardDescription>Current matchup score</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full border-destructive/50">
        <CardHeader>
          <CardTitle>Week {week} Actual</CardTitle>
          <CardDescription>Current matchup score</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasStats = stats && stats.length > 0;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Week {week} Actual</CardTitle>
            <CardDescription>Current matchup score</CardDescription>
          </div>
          {seriesScore && (
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {seriesScore}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        {!hasStats ? (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>No stats available in snapshot</span>
          </div>
        ) : (
          <Table className="text-sm">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Category</TableHead>
                <TableHead className="text-right">You</TableHead>
                <TableHead className="text-right">Opponent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.map((stat) => (
                <TableRow key={stat.stat_key}>
                  <TableCell className="font-medium">{stat.display_label}</TableCell>
                  <TableCell className="text-right">
                    {stat.you_value === null || stat.you_value === '-' ? (
                      <span className="text-muted-foreground">-</span>
                    ) : (
                      <span>{stat.you_value}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {stat.opponent_value === null || stat.opponent_value === '-' ? (
                      <span className="text-muted-foreground">-</span>
                    ) : (
                      <span>{stat.opponent_value}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {lastSyncAt && (
          <div className="mt-4 text-xs text-muted-foreground">
            Last sync: {new Date(lastSyncAt).toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
