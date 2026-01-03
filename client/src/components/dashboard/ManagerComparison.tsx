import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
  weekStart?: string;
  weekEnd?: string;
  lastSync?: string;
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
  return `${position}${suffix}`;
};

function ManagerCardDesktop({ 
  manager, 
  side = 'left',
  isYou = false 
}: { 
  manager?: Manager | null; 
  side: 'left' | 'right';
  isYou?: boolean;
}) {
  if (!manager) return null;

  const recordStr = `${manager.wins || 0}-${manager.losses || 0}${manager.ties && manager.ties > 0 ? `-${manager.ties}` : ''}`;
  const rankingStr = getRankingLabel(manager.position);

  return (
    <div className={`flex ${side === 'left' ? 'flex-row' : 'flex-row-reverse'} items-center gap-3`}>
      {manager.image_url && manager.image_url !== 'false' && (
        <img
          src={manager.image_url}
          alt={manager.nickname}
          className="w-12 h-12 rounded-full border-2 border-border flex-shrink-0"
        />
      )}
      <div className={`flex flex-col ${side === 'left' ? 'text-left' : 'text-right'}`}>
        <h3 className="text-lg font-bold text-blue-400">{manager.team_name}</h3>
        <p className="text-xs text-muted-foreground">{manager.nickname}</p>
        <p className="text-xs text-muted-foreground">{recordStr} | {rankingStr}</p>
      </div>
    </div>
  );
}

function ManagerCardMobile({ 
  manager, 
  isYou = false 
}: { 
  manager?: Manager | null; 
  isYou?: boolean;
}) {
  if (!manager) return null;

  const recordStr = `${manager.wins || 0}-${manager.losses || 0}${manager.ties && manager.ties > 0 ? `-${manager.ties}` : ''}`;
  const rankingStr = getRankingLabel(manager.position);

  return (
    <div className="flex flex-col items-center gap-2">
      {manager.image_url && manager.image_url !== 'false' && (
        <img
          src={manager.image_url}
          alt={manager.nickname}
          className="w-12 h-12 rounded-full border-2 border-border"
        />
      )}
      <h3 className="text-sm font-bold text-blue-400 text-center">{manager.team_name}</h3>
      <p className="text-xs text-muted-foreground text-center">{manager.nickname}</p>
      <p className="text-xs text-muted-foreground text-center">{recordStr} | {rankingStr}</p>
    </div>
  );
}

export function ManagerComparison({ 
  you, 
  opponent, 
  loading = false,
  week,
  weekStart,
  weekEnd,
  lastSync
}: ManagerComparisonProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Manager Matchup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 bg-background rounded animate-pulse" />
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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Manager Matchup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Desktop Layout */}
        <div className="hidden md:flex flex-col gap-4">
          {/* Header Info */}
          {week && (
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Week {week}</span>
              {weekStart && weekEnd && <span>{weekStart} – {weekEnd}</span>}
            </div>
          )}

          {/* Main Matchup */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <ManagerCardDesktop manager={you} side="left" isYou={true} />
            </div>

            {/* Center: Scores and Button */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">{youScore}</span>
                <span className="text-muted-foreground">vs</span>
                <span className="text-3xl font-bold">{oppScore}</span>
              </div>
              <Button variant="outline" size="sm" className="text-xs">
                Compare Managers
              </Button>
            </div>

            <div className="flex-1">
              <ManagerCardDesktop manager={opponent} side="right" isYou={false} />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col gap-4">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs mb-2">
              <span>🏀</span>
              <span>I LIVE FOR THIS NBA</span>
            </div>
            <Button variant="ghost" size="sm" className="text-blue-400 text-xs">
              My Team →
            </Button>
          </div>

          {/* Teams */}
          <div className="flex justify-between gap-4">
            <ManagerCardMobile manager={you} isYou={true} />
            <ManagerCardMobile manager={opponent} isYou={false} />
          </div>

          {/* Scores */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">{youScore}</span>
              <span className="text-xs text-muted-foreground">{youGames}/{youTotal}</span>
              <span className="text-xs text-muted-foreground">Games Played</span>
            </div>
            <span className="text-2xl text-muted-foreground">/</span>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">{oppScore}</span>
              <span className="text-xs text-muted-foreground">{oppGames}/{oppTotal}</span>
              <span className="text-xs text-muted-foreground">Games Played</span>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="flex gap-2 h-2 rounded-full overflow-hidden bg-background border border-border">
            <div 
              className="bg-orange-500" 
              style={{ width: `${youProgress}%` }}
            />
            <div 
              className="bg-amber-900" 
              style={{ width: `${oppProgress}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
