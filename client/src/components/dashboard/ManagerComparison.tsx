import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

function ManagerCard({ 
  manager, 
  align = 'left',
  isYou = false 
}: { 
  manager?: Manager | null; 
  align: 'left' | 'right';
  isYou?: boolean;
}) {
  if (!manager) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-background rounded-lg">
        <p className="text-sm text-muted-foreground">No data available</p>
      </div>
    );
  }

  const felo = typeof manager.felo_score === 'string' ? parseInt(manager.felo_score) : manager.felo_score;
  const alignClass = align === 'left' ? 'items-end text-right' : 'items-start text-left';

  return (
    <div className={`flex flex-col p-6 ${alignClass}`}>
      {/* Avatar + Team Name + YOU Badge */}
      <div className={`flex flex-col ${align === 'left' ? 'items-end' : 'items-start'} mb-4`}>
        {manager.image_url && manager.image_url !== 'false' && (
          <img
            src={manager.image_url}
            alt={manager.nickname}
            className="w-14 h-14 rounded-full mb-3 border-2 border-border"
          />
        )}
        <div className={`flex ${align === 'left' ? 'flex-row-reverse' : 'flex-row'} items-center gap-2 justify-center mb-1`}>
          <h3 className="font-bold text-base">{manager.team_name}</h3>
          {isYou && (
            <Badge variant="outline" className="text-xs">YOU</Badge>
          )}
        </div>
      </div>

      {/* Manager Name + Tier */}
      <div className={`flex flex-col ${align === 'left' ? 'items-end' : 'items-start'} mb-4 pb-4 border-b border-border w-full`}>
        <p className="text-xs text-muted-foreground">{manager.nickname}</p>
        {manager.felo_tier && (
          <Badge className={`${getTierColor(manager.felo_tier)} mt-1 text-xs`}>
            {getTierLabel(manager.felo_tier)}
          </Badge>
        )}
      </div>

      {/* Weekly Score - PROMINENT */}
      {manager.weekly_score !== undefined && (
        <div className={`flex flex-col ${align === 'left' ? 'items-end' : 'items-start'} mb-4 pb-4 border-b border-border w-full`}>
          <span className="text-xs text-muted-foreground block mb-1">This Week</span>
          <span className="text-4xl font-bold text-foreground">{manager.weekly_score}</span>
        </div>
      )}

      {/* Felo Score (Rating) */}
      <div className={`flex flex-col ${align === 'left' ? 'items-end' : 'items-start'} mb-4 pb-4 border-b border-border w-full`}>
        <span className="text-xs text-muted-foreground mb-1">Season Rating</span>
        <span className="text-2xl font-bold text-foreground">{felo}</span>
      </div>

      {/* League Position */}
      {manager.position !== undefined && (
        <div className={`flex flex-col ${align === 'left' ? 'items-end' : 'items-start'} mb-4 pb-4 border-b border-border w-full`}>
          <span className="text-xs text-muted-foreground block mb-1">Season Ranking</span>
          <span className="text-2xl font-bold text-foreground">#{manager.position}</span>
        </div>
      )}

      {/* Season Record (W-L-T) */}
      {(manager.wins !== undefined || manager.losses !== undefined) && (
        <div className={`flex flex-col ${align === 'left' ? 'items-end' : 'items-start'} mb-4 pb-4 border-b border-border w-full`}>
          <span className="text-xs text-muted-foreground block mb-1">Season Record</span>
          <span className="text-lg font-semibold text-foreground">
            {manager.wins || 0}-{manager.losses || 0}
            {manager.ties && manager.ties > 0 ? `-${manager.ties}` : ''}
          </span>
        </div>
      )}

      {/* Head-to-Head Record */}
      {(manager.h2h_wins !== undefined || manager.h2h_losses !== undefined) && (
        <div className={`flex flex-col ${align === 'left' ? 'items-end' : 'items-start'} w-full`}>
          <span className="text-xs text-muted-foreground block mb-1">Head-to-Head</span>
          <span className="text-lg font-semibold text-foreground">
            {manager.h2h_wins || 0}-{manager.h2h_losses || 0}
            {manager.h2h_ties && manager.h2h_ties > 0 ? `-${manager.h2h_ties}` : ''}
          </span>
        </div>
      )}
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

  // Calculate series score if both have weekly scores
  const youScore = you?.weekly_score || 0;
  const oppScore = opponent?.weekly_score || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2">
          <CardTitle className="text-lg">Manager Matchup</CardTitle>
          {week && (
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span>Week {week}</span>
              {weekStart && weekEnd && (
                <span>· {weekStart} – {weekEnd}</span>
              )}
              {youScore > 0 || oppScore > 0 && (
                <span>· Series: {youScore} – {oppScore}</span>
              )}
              {lastSync && (
                <span>· Last sync: {lastSync}</span>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-0 border border-border rounded-lg overflow-hidden">
          <ManagerCard manager={you} align="right" isYou={true} />
          <ManagerCard manager={opponent} align="left" isYou={false} />
        </div>
      </CardContent>
    </Card>
  );
}
