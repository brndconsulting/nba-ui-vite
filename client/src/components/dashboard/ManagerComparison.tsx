import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useManagerComparison } from '@/hooks/useManagerComparison';
import { MissingState } from '@/components/states';

export interface Manager {
  nickname: string;
  felo_score: string | number;
  felo_tier: string;
  image_url?: string;
  team_name: string;
  team_key: string;
  position?: number;
  wins?: number | null;
  losses?: number | null;
  ties?: number | null;
  points_for?: number;
  points_against?: number;
  games_played?: number;
  total_games?: number;
  weekly_score?: number;
}

interface ManagerComparisonProps {
  leagueKey: string;
  teamKey: string;
  opponentTeamKey?: string;
}

const getTierVariant = (tier: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  const tierLower = tier?.toLowerCase() || '';
  switch (tierLower) {
    case 'platinum':
    case 'gold':
    case 'silver':
    case 'bronze':
      return 'secondary';
    default:
      return 'default';
  }
};

const getTierLabel = (tier: string) => {
  return tier?.charAt(0).toUpperCase() + tier?.slice(1).toLowerCase();
};

const getRankingLabel = (position?: number) => {
  if (position === undefined || position === null) return null;
  const suffix = position === 1 ? 'st' : position === 2 ? 'nd' : position === 3 ? 'rd' : 'th';
  return `#${position}${suffix}`;
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

const RecordDisplay = ({ wins, losses, ties }: { wins?: number | null; losses?: number | null; ties?: number | null }) => {
  if (wins === null || wins === undefined || losses === null || losses === undefined) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  
  const record = `${wins}-${losses}${ties && ties > 0 ? `-${ties}` : ''}`;
  return <span className="font-semibold text-foreground">{record}</span>;
};

const RatingDisplay = ({ score }: { score?: string | number }) => {
  if (score === undefined || score === null) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  
  const numScore = typeof score === 'string' ? parseInt(score) : score;
  return <span className="font-semibold text-foreground">{numScore}</span>;
};

const RankingDisplay = ({ position }: { position?: number }) => {
  const label = getRankingLabel(position);
  if (!label) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  return <span className="font-semibold text-foreground">{label}</span>;
};

const TierDisplay = ({ tier }: { tier?: string }) => {
  if (!tier) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  return (
    <Badge variant={getTierVariant(tier)} className="text-xs">
      {getTierLabel(tier)}
    </Badge>
  );
};

export function ManagerComparison({
  leagueKey,
  teamKey,
  opponentTeamKey,
}: ManagerComparisonProps) {
  const { you, opponent, loading, error } = useManagerComparison(
    leagueKey,
    teamKey,
    opponentTeamKey
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-40 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            <p className="font-semibold">Error loading matchup</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!you) {
    return (
      <Card>
        <CardContent className="p-6">
          <MissingState reason="manager_data_not_available" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {/* A) HEADER: Identidad */}
        <div className="flex items-center justify-between gap-4">
          {/* Left: Owner */}
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="w-12 h-12">
              <AvatarImage src={you?.image_url} alt={you?.team_name} />
              <AvatarFallback>{getInitials(you?.team_name || 'Team')}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-foreground">{you?.team_name}</p>
              <p className="text-sm text-muted-foreground">{you?.nickname}</p>
            </div>
          </div>

          {/* Center: Compare Button */}
          <Button variant="outline" size="sm">
            Compare Managers
          </Button>

          {/* Right: Opponent */}
          {opponent ? (
            <div className="flex items-center gap-3 flex-1 justify-end">
              <div className="text-right">
                <p className="font-bold text-foreground">{opponent?.team_name}</p>
                <p className="text-sm text-muted-foreground">{opponent?.nickname}</p>
              </div>
              <Avatar className="w-12 h-12">
                <AvatarImage src={opponent?.image_url} alt={opponent?.team_name} />
                <AvatarFallback>{getInitials(opponent?.team_name || 'Team')}</AvatarFallback>
              </Avatar>
            </div>
          ) : (
            <div className="flex-1 text-right text-sm text-muted-foreground">
              No opponent
            </div>
          )}
        </div>

        <Separator />

        {/* B) WEEKLY SERIES */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Weekly Series</h3>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">
              {you?.team_name} vs {opponent?.team_name || 'Opponent'}
            </p>
            <p className="text-xs text-muted-foreground">Week data not yet available</p>
          </div>
        </div>

        <Separator />

        {/* C) SEASON METRICS - Tabla comparativa */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Season Metrics</h3>
          
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {/* Header */}
            <div className="font-semibold text-muted-foreground">Metric</div>
            <div className="font-semibold text-muted-foreground">{you?.team_name}</div>
            <div className="font-semibold text-muted-foreground">—</div>
            <div className="font-semibold text-muted-foreground">{opponent?.team_name || 'Opponent'}</div>

            {/* Tier */}
            <div className="text-muted-foreground">Tier</div>
            <div><TierDisplay tier={you?.felo_tier} /></div>
            <div></div>
            <div>{opponent ? <TierDisplay tier={opponent?.felo_tier} /> : <span className="text-xs text-muted-foreground">—</span>}</div>

            {/* Rating */}
            <div className="text-muted-foreground">Rating</div>
            <div><RatingDisplay score={you?.felo_score} /></div>
            <div></div>
            <div>{opponent ? <RatingDisplay score={opponent?.felo_score} /> : <span className="text-xs text-muted-foreground">—</span>}</div>

            {/* Ranking */}
            <div className="text-muted-foreground">Ranking</div>
            <div><RankingDisplay position={you?.position} /></div>
            <div></div>
            <div>{opponent ? <RankingDisplay position={opponent?.position} /> : <span className="text-xs text-muted-foreground">—</span>}</div>

            {/* Record */}
            <div className="text-muted-foreground">Record</div>
            <div><RecordDisplay wins={you?.wins} losses={you?.losses} ties={you?.ties} /></div>
            <div></div>
            <div>{opponent ? <RecordDisplay wins={opponent?.wins} losses={opponent?.losses} ties={opponent?.ties} /> : <span className="text-xs text-muted-foreground">—</span>}</div>
          </div>
        </div>

        <Separator />

        {/* E) FOOTER: Sync Status */}
        <div className="text-xs text-muted-foreground">
          <p>Last sync: managers 9:40 PM • standings 9:10 PM</p>
        </div>
      </CardContent>
    </Card>
  );
}
