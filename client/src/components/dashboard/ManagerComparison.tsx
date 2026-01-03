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
  // Optional fields from backend (when out=metadata is implemented)
  trophies?: {
    gold: number;
    silver: number;
    bronze: number;
  };
  user_level?: string;
  user_points?: number;
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
}

const getTierColor = (tier: string) => {
  const tierLower = tier?.toLowerCase() || '';
  switch (tierLower) {
    case 'platinum':
      return 'bg-accent text-accent-foreground';
    case 'gold':
      return 'bg-accent text-accent-foreground';
    case 'silver':
      return 'bg-accent text-accent-foreground';
    case 'bronze':
      return 'bg-accent text-accent-foreground';
    default:
      return 'bg-accent text-accent-foreground';
  }
};

const getTierLabel = (tier: string) => {
  return tier?.charAt(0).toUpperCase() + tier?.slice(1).toLowerCase();
};

function ManagerCard({ manager, position }: { manager?: Manager | null; position: 'left' | 'right' }) {
  if (!manager) {
    return (
      <div className={`flex flex-col items-center justify-center p-6 bg-background rounded-lg ${position === 'left' ? 'border-r border-border' : ''}`}>
        <p className="text-sm text-muted-foreground">No data available</p>
      </div>
    );
  }

  const felo = typeof manager.felo_score === 'string' ? parseInt(manager.felo_score) : manager.felo_score;

  return (
    <div className={`flex flex-col p-6 ${position === 'left' ? 'border-r border-border' : ''}`}>
      {/* Avatar + Name */}
      <div className="flex flex-col items-center mb-4">
        {manager.image_url && manager.image_url !== 'false' && (
          <img
            src={manager.image_url}
            alt={manager.nickname}
            className="w-16 h-16 rounded-full mb-3 border-2 border-border"
          />
        )}
        <h3 className="font-bold text-center text-sm">{manager.nickname}</h3>
        <p className="text-xs text-muted-foreground text-center mt-1">{manager.team_name}</p>
      </div>

      {/* Tier Badge */}
      <div className="flex justify-center mb-4">
        <Badge className={getTierColor(manager.felo_tier)}>
          {getTierLabel(manager.felo_tier)}
        </Badge>
      </div>

      {/* Felo Score */}
      <div className="flex flex-col items-center mb-6">
        <span className="text-xs text-muted-foreground mb-1">Rating</span>
        <span className="text-3xl font-bold text-foreground">{felo}</span>
      </div>

      {/* League Position */}
      {manager.position !== undefined && (
        <div className="flex flex-col items-center mb-4 pb-4 border-b border-border">
          <span className="text-xs text-muted-foreground block mb-1">Ranking</span>
          <span className="text-2xl font-bold text-foreground">#{manager.position}</span>
        </div>
      )}

      {/* Season Record (W-L-T) */}
      {(manager.wins !== undefined || manager.losses !== undefined) && (
        <div className="flex flex-col items-center mb-4 pb-4 border-b border-border">
          <span className="text-xs text-muted-foreground block mb-1">Season Record</span>
          <span className="text-lg font-semibold text-foreground">
            {manager.wins || 0}-{manager.losses || 0}
            {manager.ties && manager.ties > 0 ? `-${manager.ties}` : ''}
          </span>
        </div>
      )}

      {/* Head-to-Head Record */}
      {(manager.h2h_wins !== undefined || manager.h2h_losses !== undefined) && (
        <div className="flex flex-col items-center mb-4 pb-4 border-b border-border">
          <span className="text-xs text-muted-foreground block mb-1">Head-to-Head</span>
          <span className="text-lg font-semibold text-foreground">
            {manager.h2h_wins || 0}-{manager.h2h_losses || 0}
            {manager.h2h_ties && manager.h2h_ties > 0 ? `-${manager.h2h_ties}` : ''}
          </span>
        </div>
      )}

      {/* Points For/Against */}
      {manager.points_for !== undefined && (
        <div className="grid grid-cols-2 gap-3 w-full text-center text-xs">
          <div>
            <span className="text-muted-foreground block">PF</span>
            <span className="font-semibold text-foreground">{manager.points_for || 0}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">PA</span>
            <span className="font-semibold text-foreground">{manager.points_against || 0}</span>
          </div>
        </div>
      )}

      {/* Trophies - when available */}
      {manager.trophies && (
        <div className="text-center text-xs mt-3">
          <span className="text-muted-foreground">Trophies: </span>
          <span className="font-semibold">
            {manager.trophies.gold > 0 && `${manager.trophies.gold}🥇`}
            {manager.trophies.silver > 0 && ` ${manager.trophies.silver}🥈`}
            {manager.trophies.bronze > 0 && ` ${manager.trophies.bronze}🥉`}
            {manager.trophies.gold === 0 && manager.trophies.silver === 0 && manager.trophies.bronze === 0 && '—'}
          </span>
        </div>
      )}
    </div>
  );
}

export function ManagerComparison({ you, opponent, loading = false }: ManagerComparisonProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Manager Matchup</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-0 border border-border rounded-lg overflow-hidden">
          <ManagerCard manager={you} position="left" />
          <ManagerCard manager={opponent} position="right" />
        </div>
      </CardContent>
    </Card>
  );
}
