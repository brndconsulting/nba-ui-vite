/**
 * Week Matchup Section (D) - Main Matchup Table
 * 
 * Endpoint: /v1/matchups
 * 
 * Regla crítica:
 * - Si week != current_week → Banner: "Viewing Past/Future Week" (sin romper el resto)
 * 
 * Tabla:
 * Category | You | Opp | Winner (badge)
 * 
 * Resumen: "Series: XW - YL - ZT"
 */
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MissingState } from "./states";

// Types
interface Category {
  key: string;
  label: string;
  you: { value: number };
  opp: { value: number };
  winner: "you" | "opp" | "tie";
}

interface Series {
  you: number;
  opp: number;
  tie: number;
}

interface WeekRange {
  start: string;
  end: string;
}

interface MainMatchupTableProps {
  week: number | null;
  currentWeek: number | null;
  weekRange: WeekRange | null;
  categories: Category[] | null;
  series: Series | null;
  opponent: { team_key: string; display_name: string } | null;
}

/**
 * Winner badge variant
 */
function getWinnerBadge(winner: "you" | "opp" | "tie"): { label: string; variant: "default" | "secondary" | "outline" } {
  if (winner === "you") return { label: "Win", variant: "default" };
  if (winner === "opp") return { label: "Loss", variant: "secondary" };
  return { label: "Tie", variant: "outline" };
}

/**
 * Format date range
 */
function formatDateRange(range: WeekRange | null): string {
  if (!range) return "";
  const start = new Date(range.start).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const end = new Date(range.end).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${start} - ${end}`;
}

/**
 * Main Matchup Table Section
 */
export function MainMatchupTable({ 
  week, 
  currentWeek, 
  weekRange, 
  categories, 
  series,
  opponent 
}: MainMatchupTableProps) {
  // No data
  if (!categories || categories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Week Matchup</CardTitle>
        </CardHeader>
        <CardContent>
          <MissingState
            title="Matchup data not available"
            message="No matchup data found for this week."
            details="Sync matchups to see category breakdown."
          />
        </CardContent>
      </Card>
    );
  }

  const isViewingDifferentWeek = week !== null && currentWeek !== null && week !== currentWeek;
  const isPastWeek = week !== null && currentWeek !== null && week < currentWeek;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-medium">
              Week {week} Matchup
            </CardTitle>
            {weekRange && (
              <span className="text-xs text-muted-foreground">
                ({formatDateRange(weekRange)})
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {opponent && (
              <Badge variant="outline">vs {opponent.display_name}</Badge>
            )}
            {series && (
              <Badge variant="default">
                Series: {series.you}W - {series.opp}L - {series.tie}T
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Week context banner */}
        {isViewingDifferentWeek && (
          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {isPastWeek 
                ? `Viewing Past Week (Week ${week}). Current week is ${currentWeek}.`
                : `Viewing Future Week (Week ${week}). Current week is ${currentWeek}.`
              }
            </AlertDescription>
          </Alert>
        )}

        {/* Category Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">You</TableHead>
              <TableHead className="text-right">Opp</TableHead>
              <TableHead className="text-right">Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => {
              const badge = getWinnerBadge(cat.winner);
              return (
                <TableRow key={cat.key}>
                  <TableCell className="font-medium">{cat.label}</TableCell>
                  <TableCell className="text-right">{cat.you.value}</TableCell>
                  <TableCell className="text-right">{cat.opp.value}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={badge.variant}>{badge.label}</Badge>
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
