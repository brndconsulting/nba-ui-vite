import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useManagerComparison } from '@/hooks/useManagerComparison';

export interface Manager {
  nickname: string;
  felo_score: string | number;
  felo_tier: string;
  image_url?: string;
  team_name: string;
  team_key: string;
  position?: number;
  wins?: number;
  losses?: number;
  ties?: number;
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
  if (!position) return '—';
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

export function ManagerComparison({
  leagueKey,
  teamKey,
  opponentTeamKey,
}: ManagerComparisonProps) {
  const { managers, matchupData, loading, error } = useManagerComparison(
    leagueKey,
    teamKey,
    opponentTeamKey
  );

  // Debug logging
  useEffect(() => {
    console.log('ManagerComparison - managers:', managers);
    console.log('ManagerComparison - matchupData:', matchupData);
    console.log('ManagerComparison - loading:', loading);
    console.log('ManagerComparison - error:', error);
  }, [managers, matchupData, loading, error]);

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

  if (!managers || managers.length < 1) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <p>No managers found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const you = managers[0];
  const opponent = managers[1];

  const youScore = matchupData?.your_score || 0;
  const oppScore = matchupData?.opponent_score || 0;
  const youGames = matchupData?.your_games_played || 0;
  const youTotal = matchupData?.your_total_games || 0;
  const oppGames = matchupData?.opponent_games_played || 0;
  const oppTotal = matchupData?.opponent_total_games || 0;

  // Calculate progress percentage (0-100)
  const totalGames = youTotal + oppTotal;
  const youProgressPercent = totalGames > 0 ? (youGames / totalGames) * 100 : 50;

  return (
    <Card className="overflow-hidden">
      {/* TWO-COLUMN LAYOUT - Single card divided in half, NO STACKING */}
      <CardContent className="p-0">
        <div className="grid grid-cols-2 gap-0">
          {/* LEFT COLUMN - Your Team */}
          <div className="border-r p-6 space-y-4">
            {/* Team Header */}
            <div className="flex flex-col items-center gap-3">
              <Avatar className="w-14 h-14">
                <AvatarImage src={you?.image_url} alt={you?.team_name} />
                <AvatarFallback>{getInitials(you?.team_name || 'Team')}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="font-bold text-base text-foreground">{you?.team_name || 'Your Team'}</h3>
                <p className="text-xs text-muted-foreground">{you?.nickname || 'Manager'}</p>
              </div>
            </div>

            {/* Weekly Score */}
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">{youScore}</div>
              <p className="text-xs text-muted-foreground">Weekly Score</p>
            </div>

            {/* Games Played */}
            <div className="text-center">
              <div className="text-sm font-semibold text-foreground">
                {youGames}/{youTotal}
              </div>
              <p className="text-xs text-muted-foreground">Games Played</p>
            </div>

            {/* Stats Grid - Tier, Rating, Ranking, Record (2x2) */}
            <div className="grid grid-cols-2 gap-3 text-center">
              {/* Tier */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Tier</p>
                {you?.felo_tier && (
                  <Badge variant={getTierVariant(you.felo_tier)} className="justify-center w-full text-xs">
                    {getTierLabel(you.felo_tier)}
                  </Badge>
                )}
              </div>

              {/* Rating */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Rating</p>
                <span className="font-bold text-foreground text-sm block">
                  {typeof you?.felo_score === 'string' ? parseInt(you.felo_score) : you?.felo_score || '—'}
                </span>
              </div>

              {/* Ranking */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Ranking</p>
                <span className="font-bold text-foreground text-sm block">
                  {getRankingLabel(you?.position)}
                </span>
              </div>

              {/* Record */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Record</p>
                <span className="font-bold text-foreground text-sm block">
                  {you?.wins || 0}-{you?.losses || 0}
                  {you?.ties && you.ties > 0 ? `-${you.ties}` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Opponent Team */}
          {opponent ? (
            <div className="p-6 space-y-4">
              {/* Team Header */}
              <div className="flex flex-col items-center gap-3">
                <Avatar className="w-14 h-14">
                  <AvatarImage src={opponent?.image_url} alt={opponent?.team_name} />
                  <AvatarFallback>{getInitials(opponent?.team_name || 'Team')}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="font-bold text-base text-foreground">{opponent?.team_name || 'Opponent'}</h3>
                  <p className="text-xs text-muted-foreground">{opponent?.nickname || 'Manager'}</p>
                </div>
              </div>

              {/* Weekly Score */}
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">{oppScore}</div>
                <p className="text-xs text-muted-foreground">Weekly Score</p>
              </div>

              {/* Games Played */}
              <div className="text-center">
                <div className="text-sm font-semibold text-foreground">
                  {oppGames}/{oppTotal}
                </div>
                <p className="text-xs text-muted-foreground">Games Played</p>
              </div>

              {/* Stats Grid - Tier, Rating, Ranking, Record (2x2) */}
              <div className="grid grid-cols-2 gap-3 text-center">
                {/* Tier */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Tier</p>
                  {opponent?.felo_tier && (
                    <Badge variant={getTierVariant(opponent.felo_tier)} className="justify-center w-full text-xs">
                      {getTierLabel(opponent.felo_tier)}
                    </Badge>
                  )}
                </div>

                {/* Rating */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Rating</p>
                  <span className="font-bold text-foreground text-sm block">
                    {typeof opponent?.felo_score === 'string'
                      ? parseInt(opponent.felo_score)
                      : opponent?.felo_score || '—'}
                  </span>
                </div>

                {/* Ranking */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Ranking</p>
                  <span className="font-bold text-foreground text-sm block">
                    {getRankingLabel(opponent?.position)}
                  </span>
                </div>

                {/* Record */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Record</p>
                  <span className="font-bold text-foreground text-sm block">
                    {opponent?.wins || 0}-{opponent?.losses || 0}
                    {opponent?.ties && opponent.ties > 0 ? `-${opponent.ties}` : ''}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 flex items-center justify-center text-muted-foreground text-sm">
              No opponent data
            </div>
          )}
        </div>

        {/* PROGRESS BAR - Full width at bottom */}
        {totalGames > 0 && (
          <>
            <Separator />
            <div className="px-6 py-4 space-y-2">
              <Progress value={youProgressPercent} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{you?.team_name}</span>
                <span>{opponent?.team_name || 'Opponent'}</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
