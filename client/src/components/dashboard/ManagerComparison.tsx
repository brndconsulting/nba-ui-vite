<<<<<<< HEAD
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
=======
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useManagerComparison } from '@/hooks/useManagerComparison';
>>>>>>> 906a2a0 (feat: ManagerComparison component with two-column layout and real data integration)

export interface Manager {
  nickname: string;
  felo_score: string | number;
  felo_tier: string;
  image_url?: string;
  team_name: string;
  team_key: string;
  // Weekly matchup score
  weekly_score?: number;
  // Standings data
  position?: number;
  wins?: number;
  losses?: number;
  ties?: number;
  points_for?: number;
  points_against?: number;
  games_played?: number;
  total_games?: number;
  // Head-to-head record
  h2h_wins?: number;
  h2h_losses?: number;
  h2h_ties?: number;
}

interface ManagerComparisonProps {
  you?: Manager | null;
  opponent?: Manager | null;
  loading?: boolean;
  week?: number;
  leagueName?: string;
  status?: 'live' | 'final' | 'upcoming';
  timeRemaining?: string;
}

const getTierColor = (tier: string) => {
  const tierLower = tier?.toLowerCase() || '';
  switch (tierLower) {
    case 'platinum':
      return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
    case 'gold':
      return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30';
    case 'silver':
      return 'bg-gray-400/20 text-gray-300 border border-gray-400/30';
    case 'bronze':
      return 'bg-orange-500/20 text-orange-300 border border-orange-500/30';
    default:
      return 'bg-accent text-accent-foreground';
  }
};

const getTierLabel = (tier: string) => {
  return tier?.charAt(0).toUpperCase() + tier?.slice(1).toLowerCase();
};

const getRankingLabel = (position?: number) => {
  if (!position) return '';
  const suffix = position === 1 ? 'st' : position === 2 ? 'nd' : position === 3 ? 'rd' : 'th';
  return `#${position}${suffix}`;
};

const getStatusBadge = (status?: string) => {
  switch (status) {
    case 'live':
      return <Badge className="bg-green-500/20 text-green-300 border border-green-500/30">Live</Badge>;
    case 'final':
      return <Badge className="bg-gray-500/20 text-gray-300 border border-gray-500/30">Final</Badge>;
    case 'upcoming':
      return <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30">Upcoming</Badge>;
    default:
      return null;
  }
};

export function ManagerComparison({ 
  you, 
  opponent, 
  loading = false,
  week = 1,
  leagueName = 'NBA Fantasy',
  status = 'live',
  timeRemaining
}: ManagerComparisonProps) {
<<<<<<< HEAD
=======
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

>>>>>>> 906a2a0 (feat: ManagerComparison component with two-column layout and real data integration)
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
<<<<<<< HEAD
          <div className="h-64 bg-background rounded animate-pulse" />
=======
          <div className="h-40 bg-muted rounded animate-pulse" />
>>>>>>> 906a2a0 (feat: ManagerComparison component with two-column layout and real data integration)
        </CardContent>
      </Card>
    );
  }

  const youScore = you?.weekly_score || 0;
  const oppScore = opponent?.weekly_score || 0;
  const youGames = you?.games_played || 0;
  const youTotal = you?.total_games || 0;
  const oppGames = opponent?.games_played || 0;
  const oppTotal = opponent?.total_games || 0;

  // Calculate progress percentages
  const youProgress = youTotal > 0 ? (youGames / youTotal) * 100 : 0;
  const oppProgress = oppTotal > 0 ? (oppGames / oppTotal) * 100 : 0;

  return (
    <Card className="overflow-hidden">
<<<<<<< HEAD
      <CardContent className="p-0">
        {/* A) TOP BAR - Context */}
        <div className="flex justify-between items-center px-6 py-3 border-b border-border bg-background/50">
          <span className="text-sm font-semibold text-foreground">{leagueName}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Week {week} · {getStatusBadge(status)}
            </span>
            {timeRemaining && (
              <span className="text-xs text-muted-foreground ml-2">{timeRemaining}</span>
            )}
          </div>
        </div>

        {/* B) MATCHUP HEADER - Identity */}
        <div className="grid grid-cols-3 gap-4 px-6 py-6 border-b border-border">
          {/* Left Team */}
          <div className="flex flex-col items-center gap-3">
            {you?.image_url && you.image_url !== 'false' && (
              <img
                src={you.image_url}
                alt={you.nickname}
                className="w-16 h-16 rounded-full border-2 border-border"
              />
            )}
            <div className="text-center">
              <h3 className="font-bold text-base text-blue-400">{you?.team_name || 'Your Team'}</h3>
              <p className="text-xs text-muted-foreground">{you?.nickname || 'Manager'}</p>
            </div>
          </div>

          {/* Center - Weekly Result */}
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-3">
              <span className="text-5xl font-bold text-foreground">{youScore}</span>
              <span className="text-2xl text-muted-foreground">/</span>
              <span className="text-5xl font-bold text-foreground">{oppScore}</span>
            </div>
            <span className="text-xs text-muted-foreground font-medium">Weekly Series</span>
          </div>

          {/* Right Team */}
          <div className="flex flex-col items-center gap-3">
            {opponent?.image_url && opponent.image_url !== 'false' && (
              <img
                src={opponent.image_url}
                alt={opponent.nickname}
                className="w-16 h-16 rounded-full border-2 border-border"
              />
            )}
            <div className="text-center">
              <h3 className="font-bold text-base text-blue-400">{opponent?.team_name || 'Opponent'}</h3>
              <p className="text-xs text-muted-foreground">{opponent?.nickname || 'Manager'}</p>
            </div>
          </div>
        </div>

        {/* D) VOLUME / PACE - Games Played */}
        <div className="grid grid-cols-3 gap-4 px-6 py-4 border-b border-border">
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-semibold text-foreground">{youGames}/{youTotal}</span>
            <span className="text-xs text-muted-foreground">Games</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-muted-foreground">Played</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-semibold text-foreground">{oppGames}/{oppTotal}</span>
            <span className="text-xs text-muted-foreground">Games</span>
          </div>
        </div>

        {/* E) PROGRESS BAR - Visual Representation */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex h-3 rounded-full overflow-hidden bg-background border border-border">
            <div 
              className="bg-orange-500 transition-all duration-300"
              style={{ width: `${youProgress}%` }}
              title={`Your progress: ${youProgress.toFixed(0)}%`}
            />
            <div 
              className="bg-amber-900 transition-all duration-300"
              style={{ width: `${oppProgress}%` }}
              title={`Opponent progress: ${oppProgress.toFixed(0)}%`}
            />
          </div>
        </div>

        {/* TEAM PERFORMANCE - Stats Strip */}
        <div className="grid grid-cols-4 gap-2 px-6 py-4">
          {/* Tier */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-muted-foreground">Tier</span>
            {you?.felo_tier && (
              <Badge className={`${getTierColor(you.felo_tier)} text-xs`}>
                {getTierLabel(you.felo_tier)}
              </Badge>
            )}
          </div>

          {/* Rating */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-muted-foreground">Rating</span>
            <span className="text-sm font-bold text-foreground">
              {typeof you?.felo_score === 'string' ? parseInt(you.felo_score) : you?.felo_score || '—'}
            </span>
          </div>

          {/* Ranking */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-muted-foreground">Ranking</span>
            <span className="text-sm font-bold text-foreground">
              {getRankingLabel(you?.position) || '—'}
            </span>
          </div>

          {/* Season Record */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-muted-foreground">Record</span>
            <span className="text-sm font-bold text-foreground">
              {you?.wins || 0}-{you?.losses || 0}
              {you?.ties && you.ties > 0 ? `-${you.ties}` : ''}
            </span>
          </div>
        </div>

        {/* OPPONENT STATS STRIP (below) */}
        <div className="grid grid-cols-4 gap-2 px-6 py-4 border-t border-border bg-background/30">
          {/* Tier */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-muted-foreground">Tier</span>
            {opponent?.felo_tier && (
              <Badge className={`${getTierColor(opponent.felo_tier)} text-xs`}>
                {getTierLabel(opponent.felo_tier)}
              </Badge>
            )}
          </div>

          {/* Rating */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-muted-foreground">Rating</span>
            <span className="text-sm font-bold text-foreground">
              {typeof opponent?.felo_score === 'string' ? parseInt(opponent.felo_score) : opponent?.felo_score || '—'}
            </span>
          </div>

          {/* Ranking */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-muted-foreground">Ranking</span>
            <span className="text-sm font-bold text-foreground">
              {getRankingLabel(opponent?.position) || '—'}
            </span>
          </div>

          {/* Season Record */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-muted-foreground">Record</span>
            <span className="text-sm font-bold text-foreground">
              {opponent?.wins || 0}-{opponent?.losses || 0}
              {opponent?.ties && opponent.ties > 0 ? `-${opponent.ties}` : ''}
            </span>
          </div>
        </div>
=======
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
>>>>>>> 906a2a0 (feat: ManagerComparison component with two-column layout and real data integration)
      </CardContent>
    </Card>
  );
}
