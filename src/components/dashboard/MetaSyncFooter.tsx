/**
 * Meta Sync Footer (G) - Data health visible
 * 
 * Fuente: /v1/sync-status
 * 
 * Formato (sutil):
 * "Data health: Matchups (Fresh — 12m ago) | Rosters (Stale — 4h ago). [Update Now]"
 * 
 * "Update Now" solo si existe endpoint de sync; si no, se omite.
 */
import { RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Types
interface DomainStatus {
  status: "fresh" | "stale" | "missing";
  last_sync_at: string | null;
  message?: string;
}

interface SyncStatus {
  overall_status: "fresh" | "stale" | "missing";
  domains: {
    matchups?: DomainStatus;
    roster?: DomainStatus;
    league_managers?: DomainStatus;
    owner_profile?: DomainStatus;
  };
}

interface MetaSyncFooterProps {
  syncStatus: SyncStatus | null;
  onUpdateNow?: () => void;
  canSync?: boolean;
}

/**
 * Format time ago
 */
function formatTimeAgo(dateStr: string | null): string {
  if (!dateStr) return "never";
  
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

/**
 * Status badge variant
 */
function getStatusVariant(status: string): "default" | "secondary" | "outline" {
  if (status === "fresh") return "default";
  if (status === "stale") return "secondary";
  return "outline";
}

/**
 * Domain status display
 */
function DomainBadge({ name, domain }: { name: string; domain: DomainStatus | undefined }) {
  if (!domain) return null;
  
  const statusLabel = domain.status.charAt(0).toUpperCase() + domain.status.slice(1);
  const timeAgo = formatTimeAgo(domain.last_sync_at);
  
  return (
    <span className="inline-flex items-center gap-1 text-xs">
      <span className="text-muted-foreground">{name}</span>
      <Badge variant={getStatusVariant(domain.status)} className="text-xs px-1.5 py-0">
        {statusLabel}
      </Badge>
      <span className="text-muted-foreground">— {timeAgo}</span>
    </span>
  );
}

/**
 * Meta Sync Footer Component
 */
export function MetaSyncFooter({ syncStatus, onUpdateNow, canSync }: MetaSyncFooterProps) {
  if (!syncStatus) {
    return (
      <div className="flex items-center justify-center py-2 text-xs text-muted-foreground">
        Data health: Unknown
      </div>
    );
  }

  const domains = syncStatus.domains;
  const hasDomains = domains.matchups || domains.roster;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-2 px-1">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-muted-foreground font-medium">Data health:</span>
        
        {domains.matchups && (
          <>
            <DomainBadge name="Matchups" domain={domains.matchups} />
            {domains.roster && <Separator orientation="vertical" className="h-3" />}
          </>
        )}
        
        {domains.roster && (
          <DomainBadge name="Rosters" domain={domains.roster} />
        )}
        
        {!hasDomains && (
          <span className="text-muted-foreground">No sync data available</span>
        )}
      </div>

      {canSync && onUpdateNow && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 text-xs"
          onClick={onUpdateNow}
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Update Now
        </Button>
      )}
    </div>
  );
}
