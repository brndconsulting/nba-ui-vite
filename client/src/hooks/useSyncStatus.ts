/**
 * useSyncStatus - Hook to fetch sync status for all domains
 * 
 * Returns status for each domain (fresh/stale/missing) with timestamps
 * Used by Header to show data health indicators
 * 
 * NOTE: Backend is owner-scoped. No need to pass owner_id.
 */

import { useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS } from '@/config/api';

export type SyncStatusType = 'fresh' | 'stale' | 'missing';

export interface DomainStatus {
  status: SyncStatusType;
  last_sync_at: string | null;
  message: string;
  display_name?: string;
  description?: string;
}

export interface SyncStatusData {
  sync_status: Record<string, DomainStatus>;
  overall_status: 'fresh' | 'stale' | 'incomplete';
  league_key: string | null;
  owner_id: string;
  domains_count?: number;
}

interface UseSyncStatusResult {
  data: SyncStatusData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSyncStatus(
  leagueKey: string | null
): UseSyncStatusResult {
  const [data, setData] = useState<SyncStatusData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSyncStatus = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const url = API_ENDPOINTS.syncStatus(leagueKey || undefined);
      console.warn('[useSyncStatus] Fetching:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const envelope = await response.json();
      console.warn('[useSyncStatus] Response:', envelope);
      
      // Handle envelope format
      if (envelope.data) {
        setData(envelope.data);
      } else if (envelope.sync_status) {
        // Direct format
        setData(envelope);
      } else if (!envelope.success && envelope.errors) {
        throw new Error(envelope.errors[0]?.message || 'Unknown error');
      }
    } catch (err) {
      console.error('[useSyncStatus] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch sync status');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [leagueKey]);

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchSyncStatus();
  }, [fetchSyncStatus]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(fetchSyncStatus, 60000);
    return () => clearInterval(interval);
  }, [fetchSyncStatus]);

  return {
    data,
    loading,
    error,
    refetch: fetchSyncStatus,
  };
}

/**
 * Get color variant for a sync status
 */
export function getStatusVariant(status: SyncStatusType): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'fresh':
      return 'default'; // green/success
    case 'stale':
      return 'secondary'; // yellow/warning
    case 'missing':
      return 'destructive'; // red/error
    default:
      return 'outline';
  }
}

/**
 * Get color class for a sync status dot indicator
 */
export function getStatusDotClass(status: SyncStatusType): string {
  switch (status) {
    case 'fresh':
      return 'bg-primary';
    case 'stale':
      return 'bg-muted-foreground';
    case 'missing':
      return 'bg-destructive';
    default:
      return 'bg-muted';
  }
}

/**
 * Format timestamp for display
 */
export function formatSyncTime(isoString: string | null): string {
  if (!isoString) return 'Never';
  
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  } catch {
    return 'Unknown';
  }
}
