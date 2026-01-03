/**
 * ManagerVsManager Component
 * 
 * Shows "me vs rival" with avatar, felo tier, record, etc.
 * 100% shadcn/ui components only
 */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Trophy, Users } from 'lucide-react';
import type { Manager } from '@/hooks/useLeagueManagers';

interface ManagerVsManagerProps {
  myManager: Manager | null;
  opponentManager: Manager | null;
  loading: boolean;
  error: string | null;
  lastSyncAt: string | null;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getTierVariant(tier?: string): 'default' | 'secondary' | 'outline' {
  switch (tier?.toLowerCase()) {
    case 'gold':
      return 'default';
    case 'silver':
      return 'secondary';
    default:
      return 'outline';
  }
}

function ManagerCard({ 
  manager, 
  label,
  loading 
}: { 
  manager: Manager | null; 
  label: string;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 p-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
    );
  }

  if (!manager) {
    return (
      <div className="flex flex-col items-center gap-3 p-4 text-center">
        <Avatar className="h-16 w-16">
          <AvatarFallback>?</AvatarFallback>
        </Avatar>
        <p className="text-sm text-muted-foreground">{label} not available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 p-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src={manager.image_url} alt={manager.nickname} />
        <AvatarFallback>{getInitials(manager.nickname)}</AvatarFallback>
      </Avatar>
      
      <div className="text-center">
        <p className="font-medium">{manager.nickname}</p>
        <p className="text-sm text-muted-foreground">{manager.team_name}</p>
      </div>

      {manager.felo_tier && (
        <Badge variant={getTierVariant(manager.felo_tier)} className="capitalize">
          {manager.felo_tier}
        </Badge>
      )}

      {manager.felo_score && (
        <p className="text-xs text-muted-foreground">
          Felo: {manager.felo_score}
        </p>
      )}
    </div>
  );
}

export function ManagerVsManager({
  myManager,
  opponentManager,
  loading,
  error,
  lastSyncAt,
}: ManagerVsManagerProps) {
  if (error) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Manager vs Manager
          </CardTitle>
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

  if (!loading && !myManager && !opponentManager) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Manager vs Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Cannot map opponent team from matchup. Manager data not available.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Manager vs Manager
          </CardTitle>
          {lastSyncAt && (
            <span className="text-xs text-muted-foreground">
              {new Date(lastSyncAt).toLocaleString()}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <ManagerCard 
            manager={myManager} 
            label="My Manager" 
            loading={loading} 
          />
          
          <div className="flex items-center justify-center">
            <Separator orientation="vertical" className="h-full" />
          </div>
          
          <ManagerCard 
            manager={opponentManager} 
            label="Opponent" 
            loading={loading} 
          />
        </div>
        
        <Separator className="my-4" />
        
        <p className="text-xs text-center text-muted-foreground">
          Week matchup comparison
        </p>
      </CardContent>
    </Card>
  );
}
