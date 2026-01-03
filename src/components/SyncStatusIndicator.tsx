/**
 * SyncStatusIndicator - Data Health Indicator for Header
 * 
 * 100% shadcn/ui components:
 * - Badge
 * - Button
 * - Popover, PopoverContent, PopoverTrigger
 * - Separator
 * - Skeleton
 * 
 * Only Tailwind tokens - no custom colors
 */

import { useAppContext } from '@/contexts/ContextProvider';
import { 
  useSyncStatus, 
  formatSyncTime,
  type SyncStatusType,
  type DomainStatus,
} from '@/hooks/useSyncStatus';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  Loader2,
} from 'lucide-react';

/**
 * Fixed domain list per spec v1.2 contract
 */
const REQUIRED_DOMAINS = [
  { key: 'context_leagues', display_name: 'Context & Leagues' },
  { key: 'league_teams', display_name: 'League Teams' },
  { key: 'settings', display_name: 'Settings' },
  { key: 'standings', display_name: 'Standings' },
  { key: 'matchups', display_name: 'Matchups' },
  { key: 'roster', display_name: 'Roster' },
  { key: 'team_stats', display_name: 'Team Stats' },
  { key: 'player_pool', display_name: 'Player Pool' },
  { key: 'owner_profile', display_name: 'Owner Profile' },
  { key: 'league_managers', display_name: 'League Managers' },
  { key: 'league_strengths', display_name: 'League Strengths' },
  { key: 'schedule', display_name: 'Schedule' },
] as const;

/**
 * Status icon based on domain status
 */
function StatusIcon({ status }: { status: SyncStatusType | 'running' }) {
  switch (status) {
    case 'fresh':
      return <CheckCircle2 className="h-4 w-4 text-primary" />;
    case 'stale':
      return <Clock className="h-4 w-4 text-muted-foreground" />;
    case 'missing':
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    case 'running':
      return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
    default:
      return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
  }
}

/**
 * Single domain row in the popover
 */
function DomainRow({ 
  displayName,
  info,
}: { 
  displayName: string;
  info: DomainStatus | null;
}) {
  const status = info?.status || 'missing';
  const lastSyncAt = info?.last_sync_at || null;

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <StatusIcon status={status} />
        <span className="text-sm">{displayName}</span>
      </div>
      <span className="text-xs text-muted-foreground">
        {formatSyncTime(lastSyncAt)}
      </span>
    </div>
  );
}

/**
 * Overall status badge
 */
function OverallStatusBadge({ 
  status, 
  loading 
}: { 
  status: 'fresh' | 'stale' | 'incomplete' | 'running' | null;
  loading: boolean;
}) {
  if (loading) {
    return <Skeleton className="h-6 w-20" />;
  }

  const getVariant = (): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'fresh':
        return 'default';
      case 'stale':
        return 'secondary';
      case 'incomplete':
        return 'destructive';
      case 'running':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'fresh':
        return 'Synced';
      case 'stale':
        return 'Stale';
      case 'incomplete':
        return 'Incomplete';
      case 'running':
        return 'Syncing...';
      default:
        return 'Unknown';
    }
  };

  return (
    <Badge variant={getVariant()}>
      {getLabel()}
    </Badge>
  );
}

/**
 * Main SyncStatusIndicator component
 */
export function SyncStatusIndicator() {
  const { activeLeague } = useAppContext();
  const { data, loading, error, refetch } = useSyncStatus(
    activeLeague?.league_key || null
  );

  if (error && !data) {
    return (
      <Badge variant="destructive" className="gap-1">
        <AlertCircle className="h-3 w-3" />
        Error
      </Badge>
    );
  }

  const syncStatusMap = data?.sync_status || {};
  
  const statusCounts = REQUIRED_DOMAINS.reduce(
    (acc, domain) => {
      const info = syncStatusMap[domain.key];
      const status = info?.status || 'missing';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          disabled={loading}
        >
          <OverallStatusBadge 
            status={data?.overall_status || null} 
            loading={loading} 
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Data Health</h4>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8"
              onClick={() => refetch()}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* Summary badges */}
          <div className="flex gap-2 flex-wrap">
            {statusCounts.fresh > 0 && (
              <Badge variant="default">{statusCounts.fresh} fresh</Badge>
            )}
            {statusCounts.stale > 0 && (
              <Badge variant="secondary">{statusCounts.stale} stale</Badge>
            )}
            {statusCounts.missing > 0 && (
              <Badge variant="destructive">{statusCounts.missing} missing</Badge>
            )}
          </div>

          <Separator />

          {/* Domain list */}
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto space-y-1">
              {REQUIRED_DOMAINS.map((domain) => (
                <DomainRow 
                  key={domain.key} 
                  displayName={domain.display_name}
                  info={syncStatusMap[domain.key] || null} 
                />
              ))}
            </div>
          )}

          <Separator />
          
          <p className="text-xs text-muted-foreground">
            {REQUIRED_DOMAINS.length} domains tracked
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
