/**
 * Reusable State Components - SHADCN-ONLY
 * 
 * 5 wrappers reutilizables según spec v1.2:
 * - LoadingState: Card + Skeleton + texto "Loading…"
 * - EmptyState: Card + texto claro + Button CTA
 * - MissingState: Alert con motivo exacto ("never synced / not exposed / no permission")
 * - StaleState: Badge + Alert con last_sync_at + motivo
 * - ErrorState: Alert destructive con error_id/timestamp + CTA si aplica
 */
import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Loader2, 
  AlertCircle, 
  AlertTriangle, 
  Clock, 
  RefreshCw,
  Inbox
} from 'lucide-react';

// ============================================================================
// LOADING STATE
// ============================================================================
interface LoadingStateProps {
  message?: string;
  /** Number of skeleton rows to show */
  rows?: number;
}

export function LoadingState({ 
  message = 'Loading...', 
  rows = 3 
}: LoadingStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground">{message}</p>
        <div className="w-full max-w-md mt-6 space-y-3">
          {Array.from({ length: rows }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// EMPTY STATE
// ============================================================================
interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  title = 'No data available',
  description = 'There is no data to display at this time.',
  icon,
  action,
}: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 text-muted-foreground">
          {icon || <Inbox className="h-12 w-12" />}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          {description}
        </p>
        {action && (
          <Button onClick={action.onClick} variant="outline">
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MISSING STATE
// ============================================================================
type MissingReason = 
  | 'never_synced' 
  | 'not_exposed' 
  | 'no_permission' 
  | 'not_supported'
  | 'not_provided_by_backend'
  | string;

interface MissingStateProps {
  /** Domain or feature name */
  domain?: string;
  /** Reason for missing data */
  reason: MissingReason;
  /** Optional timestamp of last attempt */
  lastAttemptAt?: string | null;
  /** Optional action to sync */
  onSync?: () => void;
}

const REASON_MESSAGES: Record<string, string> = {
  never_synced: 'This data has never been synced. Click sync to fetch it.',
  not_exposed: 'This data is not exposed by the API.',
  no_permission: 'You do not have permission to access this data.',
  not_supported: 'This feature is not supported for this league type.',
  not_provided_by_backend: 'This domain is not provided by the backend.',
};

export function MissingState({
  domain,
  reason,
  lastAttemptAt,
  onSync,
}: MissingStateProps) {
  const message = REASON_MESSAGES[reason] || reason;

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>
        {domain ? `${domain} - Missing` : 'Data Missing'}
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p>{message}</p>
        {lastAttemptAt && (
          <p className="text-xs mt-2 opacity-70">
            Last attempt: {new Date(lastAttemptAt).toLocaleString()}
          </p>
        )}
        {onSync && (
          <Button 
            onClick={onSync} 
            variant="outline" 
            size="sm" 
            className="mt-3"
          >
            <RefreshCw className="h-3 w-3 mr-2" />
            Sync Now
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

// ============================================================================
// STALE STATE
// ============================================================================
interface StaleStateProps {
  /** Last sync timestamp (ISO string) */
  lastSyncAt: string;
  /** Optional message explaining staleness */
  message?: string;
  /** Optional action to refresh */
  onRefresh?: () => void;
}

export function StaleState({
  lastSyncAt,
  message = 'Data may be outdated',
  onRefresh,
}: StaleStateProps) {
  const syncDate = new Date(lastSyncAt);
  const timeAgo = getTimeAgo(syncDate);

  return (
    <Alert>
      <Clock className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-2">
        Stale Data
        <Badge variant="secondary" className="text-xs">
          {timeAgo}
        </Badge>
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p>{message}</p>
        <p className="text-xs mt-1 opacity-70">
          Last synced: {syncDate.toLocaleString()}
        </p>
        {onRefresh && (
          <Button 
            onClick={onRefresh} 
            variant="outline" 
            size="sm" 
            className="mt-3"
          >
            <RefreshCw className="h-3 w-3 mr-2" />
            Refresh
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

// ============================================================================
// ERROR STATE
// ============================================================================
interface ErrorStateProps {
  /** Error message */
  error: string;
  /** Optional error ID for support */
  errorId?: string;
  /** Timestamp of the error */
  timestamp?: string;
  /** Technical details (shown in collapsible) */
  details?: Record<string, unknown>;
  /** Retry action */
  onRetry?: () => void;
  /** Is this a 401 (auth) error? */
  isAuthError?: boolean;
  /** Reconnect action for auth errors */
  onReconnect?: () => void;
}

export function ErrorState({
  error,
  errorId,
  timestamp,
  details,
  onRetry,
  isAuthError = false,
  onReconnect,
}: ErrorStateProps) {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>
        {isAuthError ? 'Session Expired' : 'Error'}
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p>{error}</p>
        
        {errorId && (
          <p className="text-xs mt-2 font-mono opacity-70">
            Error ID: {errorId}
          </p>
        )}
        
        {timestamp && (
          <p className="text-xs mt-1 opacity-70">
            {new Date(timestamp).toLocaleString()}
          </p>
        )}
        
        {details && Object.keys(details).length > 0 && (
          <details className="mt-3">
            <summary className="text-xs cursor-pointer hover:underline">
              Technical details
            </summary>
            <pre className="mt-2 p-2 bg-background/50 rounded text-xs overflow-auto max-h-32">
              {JSON.stringify(details, null, 2)}
            </pre>
          </details>
        )}
        
        <div className="flex gap-2 mt-3">
          {isAuthError && onReconnect ? (
            <Button onClick={onReconnect} variant="outline" size="sm">
              Reconnect
            </Button>
          ) : onRetry ? (
            <Button onClick={onRetry} variant="outline" size="sm">
              <RefreshCw className="h-3 w-3 mr-2" />
              Retry
            </Button>
          ) : null}
        </div>
      </AlertDescription>
    </Alert>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

// ============================================================================
// EXPORTS
// ============================================================================
export type { 
  LoadingStateProps, 
  EmptyStateProps, 
  MissingStateProps, 
  StaleStateProps, 
  ErrorStateProps,
  MissingReason 
};
