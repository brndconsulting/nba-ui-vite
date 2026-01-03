import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { MissingState } from '@/components/states';

interface MatchupCategory {
  stat_key: string;
  display_label: string;
  you_value: string | number | null;
  opponent_value: string | number | null;
  result: 'W' | 'L' | 'T' | '-';
}

interface WeekMatchupCardProps {
  week: number;
  youTeam: string;
  opponentTeam: string;
  weekStart?: string;
  weekEnd?: string;
  categories: MatchupCategory[];
  seriesScore?: string;
  lastSyncAt?: string;
  isLoading?: boolean;
  error?: string;
}

const getResultBadgeVariant = (result: string) => {
  switch (result) {
    case 'W':
      return 'default';
    case 'L':
      return 'secondary';
    case 'T':
      return 'outline';
    default:
      return 'outline';
  }
};

const getResultColor = (result: string) => {
  switch (result) {
    case 'W':
      return 'text-green-700';
    case 'L':
      return 'text-red-700';
    case 'T':
      return 'text-yellow-700';
    default:
      return 'text-muted-foreground';
  }
};

export function WeekMatchupCard({
  week,
  youTeam,
  opponentTeam,
  weekStart,
  weekEnd,
  categories,
  seriesScore,
  lastSyncAt,
  isLoading,
  error,
}: WeekMatchupCardProps) {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Week {week} Matchup</CardTitle>
          <CardDescription>Category breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
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
          <CardTitle>Week {week} Matchup</CardTitle>
          <CardDescription>Category breakdown</CardDescription>
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

  const hasCategories = categories && categories.length > 0;
  const dateRange = weekStart && weekEnd ? `${weekStart} – ${weekEnd}` : '';

  return (
    <Card className="h-full flex flex-col md:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Week {week} Matchup</CardTitle>
            <CardDescription className="mt-1">
              {dateRange && <span>{dateRange}</span>}
              {dateRange && <span className="mx-2">•</span>}
              <span>{youTeam} vs {opponentTeam}</span>
            </CardDescription>
          </div>
          {seriesScore && (
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {seriesScore}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        {!hasCategories ? (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>No matchup data available for this week</span>
          </div>
        ) : (
          <Table className="text-sm">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[35%]">Category</TableHead>
                <TableHead className="text-right">You</TableHead>
                <TableHead className="text-right">Opponent</TableHead>
                <TableHead className="text-center w-[80px]">Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.stat_key}>
                  <TableCell className="font-medium">{cat.display_label}</TableCell>
                  <TableCell className="text-right">
                    {cat.you_value === null || cat.you_value === '-' ? (
                      <span className="text-muted-foreground">-</span>
                    ) : (
                      <span>{cat.you_value}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {cat.opponent_value === null || cat.opponent_value === '-' ? (
                      <span className="text-muted-foreground">-</span>
                    ) : (
                      <span>{cat.opponent_value}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {cat.result === '-' ? (
                      <span className="text-xs text-muted-foreground">—</span>
                    ) : (
                      <Badge
                        variant={getResultBadgeVariant(cat.result)}
                        className={`${getResultColor(cat.result)}`}
                      >
                        {cat.result}
                      </Badge>
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
