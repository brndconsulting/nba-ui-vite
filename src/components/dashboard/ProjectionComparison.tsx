/**
 * Real vs Projection Section (C)
 * 
 * Week Actual vs Projected End of Week
 * 
 * Endpoint base: /v1/matchups
 * Proyección: solo si backend manda projected_value (ideal: /v1/projections en el futuro)
 * 
 * UI: ProjectionComparison
 * - Tabla por categoría: Actual | Projected | Delta | To Reach
 * - Mostrar Series actual vs Series proyectada (si projection existe)
 * 
 * Si backend no manda projection:
 * - EmptyState (no Missing): "Calculated projections coming soon"
 * - No inventar "70" ni promedios.
 */
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "./states";

// Types
interface CategoryProjection {
  key: string;
  label: string;
  actual: number;
  projected: number | null;
  opponent_actual: number;
  opponent_projected: number | null;
}

interface SeriesProjection {
  actual: { you: number; opp: number; tie: number };
  projected: { you: number; opp: number; tie: number } | null;
}

interface ProjectionComparisonProps {
  categories: CategoryProjection[] | null;
  series: SeriesProjection | null;
  hasProjections: boolean;
}

/**
 * Calculate delta between projected and actual
 */
function calcDelta(actual: number, projected: number | null): string {
  if (projected === null) return "—";
  const delta = projected - actual;
  if (delta > 0) return `+${delta.toFixed(1)}`;
  if (delta < 0) return delta.toFixed(1);
  return "0";
}

/**
 * Calculate "to reach" (what you need to beat opponent)
 */
function calcToReach(yourActual: number, oppProjected: number | null): string {
  if (oppProjected === null) return "—";
  const toReach = oppProjected - yourActual + 1;
  if (toReach <= 0) return "Leading";
  return `+${toReach.toFixed(0)}`;
}

/**
 * Delta trend icon
 */
function DeltaIcon({ actual, projected }: { actual: number; projected: number | null }) {
  if (projected === null) return <Minus className="h-3 w-3 text-muted-foreground" />;
  if (projected > actual) return <TrendingUp className="h-3 w-3 text-primary" />;
  if (projected < actual) return <TrendingDown className="h-3 w-3 text-destructive" />;
  return <Minus className="h-3 w-3 text-muted-foreground" />;
}

/**
 * Projection Comparison Section
 */
export function ProjectionComparison({ categories, series, hasProjections }: ProjectionComparisonProps) {
  // No projections available
  if (!hasProjections || !categories) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Week Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              title="Projections Coming Soon"
              message="Calculated projections coming soon"
              details="Backend projection engine not yet available."
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Projected End of Week</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              title="Projections Coming Soon"
              message="Calculated projections coming soon"
              details="Backend projection engine not yet available."
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Week Actual */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Week Actual</CardTitle>
            {series && (
              <Badge variant="outline">
                Series: {series.actual.you}W - {series.actual.opp}L - {series.actual.tie}T
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Cat</TableHead>
                <TableHead className="text-right">You</TableHead>
                <TableHead className="text-right">Opp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.key}>
                  <TableCell className="font-medium">{cat.label}</TableCell>
                  <TableCell className="text-right">{cat.actual}</TableCell>
                  <TableCell className="text-right">{cat.opponent_actual}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Projected End of Week */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Projected End of Week</CardTitle>
            {series?.projected && (
              <Badge variant="secondary">
                Proj: {series.projected.you}W - {series.projected.opp}L - {series.projected.tie}T
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Cat</TableHead>
                <TableHead className="text-right">Proj</TableHead>
                <TableHead className="text-right">Delta</TableHead>
                <TableHead className="text-right">To Reach</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.key}>
                  <TableCell className="font-medium">{cat.label}</TableCell>
                  <TableCell className="text-right">
                    {cat.projected !== null ? cat.projected : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="flex items-center justify-end gap-1">
                      <DeltaIcon actual={cat.actual} projected={cat.projected} />
                      {calcDelta(cat.actual, cat.projected)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {calcToReach(cat.actual, cat.opponent_projected)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
