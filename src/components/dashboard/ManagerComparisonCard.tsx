import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export interface ManagerProfile {
  nickname: string;
  tier?: string;
  felo_score?: number;
  trophies?: {
    gold?: number;
    silver?: number;
    bronze?: number;
  };
  record?: {
    wins: number;
    losses: number;
    ties: number;
  };
  since_year?: number;
  image_url?: string;
}

interface ManagerComparisonCardProps {
  position: 'owner' | 'opponent';
  manager?: ManagerProfile;
  loading?: boolean;
  error?: string;
}

const getTierColor = (tier?: string) => {
  switch (tier?.toLowerCase()) {
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

const calculateWinPercentage = (record?: ManagerProfile['record']) => {
  if (!record) return null;
  const total = record.wins + record.losses + record.ties;
  if (total === 0) return 0;
  return ((record.wins / total) * 100).toFixed(1);
};

export function ManagerComparisonCard({
  position,
  manager,
  loading = false,
  error,
}: ManagerComparisonCardProps) {
  const title = position === 'owner' ? 'You' : 'Opponent';

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
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

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-border rounded animate-pulse" />
            <div className="h-4 bg-border rounded animate-pulse w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!manager) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">No Metadata</p>
            <p className="text-xs text-muted-foreground mt-2">Manager profile not available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const winPct = calculateWinPercentage(manager.record);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="mt-1">{manager.nickname}</CardDescription>
          </div>
          {manager.image_url && manager.image_url !== 'false' && (
            <img
              src={manager.image_url}
              alt={manager.nickname}
              className="w-10 h-10 rounded-full"
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        {/* Tier Badge */}
        {manager.tier && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Tier:</span>
            <Badge className={getTierColor(manager.tier)}>
              {manager.tier}
            </Badge>
          </div>
        )}

        {/* Felo Score */}
        {manager.felo_score !== undefined && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Felo Score:</span>
            <span className="font-semibold">{manager.felo_score}</span>
          </div>
        )}

        {/* Trophies */}
        {manager.trophies && (
          <div className="flex items-center gap-3">
            {manager.trophies.gold ? (
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">{manager.trophies.gold}</span>
              </div>
            ) : null}
            {manager.trophies.silver ? (
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{manager.trophies.silver}</span>
              </div>
            ) : null}
            {manager.trophies.bronze ? (
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-accent" />
                <span className="text-sm">{manager.trophies.bronze}</span>
              </div>
            ) : null}
          </div>
        )}

        {/* Record */}
        {manager.record && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Record:</span>
              <span className="font-semibold">
                {manager.record.wins}W - {manager.record.losses}L - {manager.record.ties}T
              </span>
            </div>
            {winPct !== null && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Win %:</span>
                <span className="font-semibold">{winPct}%</span>
              </div>
            )}
          </div>
        )}

        {/* Since Year */}
        {manager.since_year && (
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <span>Member since</span>
            <span>{manager.since_year}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
