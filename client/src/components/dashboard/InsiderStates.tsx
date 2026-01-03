import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircle, Clock, Zap } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingStateProps {
  title?: string;
}

export const InsiderLoadingState: React.FC<LoadingStateProps> = ({
  title: _title = 'Loading...',
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48 mt-2" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
      </CardContent>
    </Card>
  );
};

interface MissingStateProps {
  title?: string;
  domains?: string[];
  reason?: string;
  lastCheckedAt?: string;
}

export const InsiderMissingState: React.FC<MissingStateProps> = ({
  title = 'Insider not available',
  domains = [],
  reason,
  lastCheckedAt: _lastCheckedAt,
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {domains.length > 0 && (
          <CardDescription>Missing: {domains.join(', ')}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center gap-3">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {reason || 'Required data not available. Run sync to populate.'}
          </AlertDescription>
        </Alert>
        {_lastCheckedAt && (
          <p className="text-xs text-muted-foreground">
            Last checked: {new Date(_lastCheckedAt).toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export const InsiderEmptyState: React.FC<EmptyStateProps> = ({
  title = 'No insights found',
  message = 'No insights found for this card.',
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
        <p className="text-sm text-muted-foreground text-center">{message}</p>
      </CardContent>
    </Card>
  );
};

interface ComingSoonStateProps {
  title?: string;
  message?: string;
}

export const InsiderComingSoonState: React.FC<ComingSoonStateProps> = ({
  title = 'Coming soon',
  message = 'This insight is coming soon.',
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Zap className="w-4 h-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
        <p className="text-sm text-muted-foreground text-center">{message}</p>
      </CardContent>
    </Card>
  );
};

interface StaleStateProps {
  title?: string;
  message?: string;
  lastSyncAt?: string;
}

export const InsiderStaleState: React.FC<StaleStateProps> = ({
  title = 'Data may be outdated',
  message = 'This data may be outdated. Run sync for fresh data.',
  lastSyncAt: _lastSyncAt,
}) => {
  return (
    <Card className="h-full flex flex-col border-yellow-200">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="w-4 h-4 text-yellow-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center gap-3">
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-900">
            {message}
          </AlertDescription>
        </Alert>
        {_lastSyncAt && (
          <p className="text-xs text-muted-foreground">
            Last sync: {new Date(_lastSyncAt).toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

interface ErrorStateProps {
  title?: string;
  errorId?: string;
  message?: string;
  onRetry?: () => void;
}

export const InsiderErrorState: React.FC<ErrorStateProps> = ({
  title = 'Error loading insight',
  errorId,
  message = 'An error occurred while loading this insight.',
  onRetry,
}) => {
  return (
    <Card className="h-full flex flex-col border-red-200">
      <CardHeader>
        <CardTitle className="text-base text-red-700">{title}</CardTitle>
        {errorId && (
          <CardDescription className="text-red-600">
            Error ID: {errorId}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center gap-3">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            Retry
          </button>
        )}
      </CardContent>
    </Card>
  );
};
