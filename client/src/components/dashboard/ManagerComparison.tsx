/**
 * Manager vs Manager Section (A)
 * 
 * PRIORIDAD #1 - Credibilidad y narrativa del matchup
 * 
 * Endpoints:
 * - /v1/owner-profile (owner)
 * - /v1/league-managers (opponent metadata)
 * - /v1/matchups (opponent_key/name)
 * 
 * Contenido permitido (solo si existe):
 * - Tier/rank (Platinum/Gold…)
 * - Trofeos (total + breakdown)
 * - Win% / record histórico
 * - Seasons/Teams
 * - Since (año)
 * - last_sync_at
 * 
 * Fallback: Si no hay profile metadata → solo display_name + badge "No Metadata"
 */
import { Trophy, Medal, Calendar, TrendingUp, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MissingState } from "./states";

// Types
interface ManagerTrophies {
  gold: number;
  silver: number;
  bronze: number;
}

interface ManagerRecord {
  wins: number;
  losses: number;
  ties: number;
}

interface ManagerProfile {
  display_name: string;
  tier?: string;
  trophies?: ManagerTrophies;
  record?: ManagerRecord;
  seasons?: number;
  teams?: number;
  since_year?: number;
  last_sync_at?: string;
}

interface ManagerComparisonProps {
  owner: ManagerProfile | null;
  opponent: ManagerProfile | null;
  opponentFromMatchup?: { team_key: string; display_name: string } | null;
}

/**
 * Tier badge color mapping
 */
function getTierVariant(tier?: string): "default" | "secondary" | "outline" {
  if (!tier) return "outline";
  const t = tier.toLowerCase();
  if (t === "platinum" || t === "gold") return "default";
  if (t === "silver") return "secondary";
  return "outline";
}

/**
 * Calculate win percentage
 */
function calcWinPct(record?: ManagerRecord): string {
  if (!record) return "—";
  const total = record.wins + record.losses + record.ties;
  if (total === 0) return "—";
  const pct = (record.wins / total) * 100;
  return `${pct.toFixed(1)}%`;
}

/**
 * Single Manager Card
 */
function ManagerCard({ 
  profile, 
  label,
  fallbackName 
}: { 
  profile: ManagerProfile | null; 
  label: "You" | "Opponent";
  fallbackName?: string;
}) {
  // No data at all
  if (!profile && !fallbackName) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <User className="h-4 w-4" />
            {label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MissingState
            title="Manager profile not available"
            message="Profile data has not been synced yet."
          />
        </CardContent>
      </Card>
    );
  }

  // Only fallback name (no metadata)
  if (!profile && fallbackName) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <User className="h-4 w-4" />
            {label}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{fallbackName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{fallbackName}</p>
              <Badge variant="outline" className="text-xs">No Metadata</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full profile
  const p = profile!;
  const totalTrophies = p.trophies 
    ? p.trophies.gold + p.trophies.silver + p.trophies.bronze 
    : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <User className="h-4 w-4" />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Name + Tier */}
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{p.display_name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{p.display_name}</p>
            {p.tier && (
              <Badge variant={getTierVariant(p.tier)} className="text-xs">
                {p.tier}
              </Badge>
            )}
          </div>
        </div>

        <Separator />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {/* Win % */}
          {p.record && (
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-xs">Win %</p>
                <p className="font-medium">{calcWinPct(p.record)}</p>
              </div>
            </div>
          )}

          {/* Record */}
          {p.record && (
            <div className="flex items-center gap-2">
              <Medal className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-xs">Record</p>
                <p className="font-medium">{p.record.wins}W-{p.record.losses}L-{p.record.ties}T</p>
              </div>
            </div>
          )}

          {/* Trophies */}
          {p.trophies && totalTrophies > 0 && (
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-xs">Trophies</p>
                <p className="font-medium">
                  {totalTrophies} ({p.trophies.gold}🥇 {p.trophies.silver}🥈 {p.trophies.bronze}🥉)
                </p>
              </div>
            </div>
          )}

          {/* Since */}
          {p.since_year && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-xs">Since</p>
                <p className="font-medium">{p.since_year}</p>
              </div>
            </div>
          )}
        </div>

        {/* Last sync */}
        {p.last_sync_at && (
          <p className="text-xs text-muted-foreground">
            Last sync: {new Date(p.last_sync_at).toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Manager Comparison Section - 2 cards side by side
 */
export function ManagerComparison({ owner, opponent, opponentFromMatchup }: ManagerComparisonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ManagerCard 
        profile={owner} 
        label="You" 
      />
      <ManagerCard 
        profile={opponent} 
        label="Opponent"
        fallbackName={opponentFromMatchup?.display_name}
      />
    </div>
  );
}
