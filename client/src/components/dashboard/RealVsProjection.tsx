/**
 * RealVsProjection Component
 * 
 * Shows Week Actual vs Projection in 2 side-by-side cards
 * Projection has Total/Average toggle and window selector (disabled if not supported)
 * 100% shadcn/ui components only
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AlertCircle, TrendingUp, Target } from 'lucide-react';

interface CategoryStat {
  stat_id: number;
  display_name: string;
  value: string | number;
  direction?: 'higher' | 'lower';
}

interface RealVsProjectionProps {
  weekActual: {
    week: number;
    score: string;
    categories: CategoryStat[];
  } | null;
  projection: {
    score: string;
    categories: CategoryStat[];
  } | null;
  loading: boolean;
  error: string | null;
  projectionAvailable: boolean;
  projectionMissingReason?: string;
  lastSyncAt: string | null;
}

function WeekActualCard({
  data,
  loading,
}: {
  data: RealVsProjectionProps['weekActual'];
  loading: boolean;
}) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-4" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Week Actual
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

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Week {data.week} Actual
        </CardTitle>
        <CardDescription>Current matchup score</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-4">{data.score}</div>
        
        {data?.categories?.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stat</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.categories.slice(0, 5).map(cat => (
                <TableRow key={cat.stat_id}>
                  <TableCell className="text-sm">{cat.display_name}</TableCell>
                  <TableCell className="text-right text-sm">{cat.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-muted-foreground">No category data</p>
        )}
      </CardContent>
    </Card>
  );
}

function ProjectionCard({
  data,
  loading,
  available,
  missingReason,
}: {
  data: RealVsProjectionProps['projection'];
  loading: boolean;
  available: boolean;
  missingReason?: string;
}) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-full mb-4" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!available) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Target className="h-4 w-4" />
            Projection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {missingReason || 'Projection not implemented by backend'}
            </AlertDescription>
          </Alert>
          
          {/* Show disabled controls per spec */}
          <div className="mt-4 space-y-2 opacity-50">
            <Tabs defaultValue="total">
              <TabsList className="w-full">
                <TabsTrigger value="total" disabled className="flex-1">Total</TabsTrigger>
                <TabsTrigger value="average" disabled className="flex-1">Average</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder="Season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="season">Season</SelectItem>
                <SelectItem value="30d">30D</SelectItem>
                <SelectItem value="14d">14D</SelectItem>
                <SelectItem value="7d">7D</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Target className="h-4 w-4" />
          Projection
        </CardTitle>
        <CardDescription>Projected end-of-week score</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Controls */}
        <div className="space-y-2 mb-4">
          <Tabs defaultValue="total">
            <TabsList className="w-full">
              <TabsTrigger value="total" className="flex-1">Total</TabsTrigger>
              <TabsTrigger value="average" className="flex-1">Average</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Select defaultValue="season">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="season">Season</SelectItem>
              <SelectItem value="30d">30D</SelectItem>
              <SelectItem value="14d">14D</SelectItem>
              <SelectItem value="7d">7D</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {data ? (
          <>
            <div className="text-2xl font-bold mb-4">{data.score}</div>
            
            {data?.categories?.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stat</TableHead>
                    <TableHead className="text-right">Projected</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.categories.slice(0, 5).map(cat => (
                    <TableRow key={cat.stat_id}>
                      <TableCell className="text-sm">{cat.display_name}</TableCell>
                      <TableCell className="text-right text-sm">{cat.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">No projection data</p>
        )}
      </CardContent>
    </Card>
  );
}

export function RealVsProjection({
  weekActual,
  projection,
  loading,
  error,
  projectionAvailable,
  projectionMissingReason,
  lastSyncAt,
}: RealVsProjectionProps) {
  if (error) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Real vs Projection</CardTitle>
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Real vs Projection</h3>
        {lastSyncAt && (
          <span className="text-xs text-muted-foreground">
            {new Date(lastSyncAt).toLocaleString()}
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <WeekActualCard data={weekActual} loading={loading} />
        <ProjectionCard 
          data={projection} 
          loading={loading} 
          available={projectionAvailable}
          missingReason={projectionMissingReason}
        />
      </div>
    </div>
  );
}
