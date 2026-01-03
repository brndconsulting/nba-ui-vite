/**
 * Dashboard State Components
 * 
 * Used when data is missing, empty, or in success state.
 * 100% shadcn/ui - no custom CSS inventions.
 */
import { AlertCircle, CheckCircle2, Clock, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface StateProps {
  title: string;
  message: string;
  details?: string;
  lastCheckedAt?: string | null;
  endpointNeeded?: string;
}

/**
 * MissingState - Data not available (backend doesn't have it)
 */
export function MissingState({ title, message, details, lastCheckedAt, endpointNeeded }: StateProps) {
  return (
    <Alert variant="default" className="border-muted">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="space-y-1">
        <p>{message}</p>
        {details && <p className="text-xs text-muted-foreground">{details}</p>}
        {endpointNeeded && (
          <p className="text-xs text-muted-foreground font-mono">Endpoint needed: {endpointNeeded}</p>
        )}
        {lastCheckedAt && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Last checked: {new Date(lastCheckedAt).toLocaleString()}
          </p>
        )}
      </AlertDescription>
    </Alert>
  );
}

/**
 * EmptyState - Data exists but is empty or coming soon
 */
export function EmptyState({ title, message, details }: StateProps) {
  return (
    <Alert variant="default" className="border-muted">
      <Info className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="space-y-1">
        <p>{message}</p>
        {details && <p className="text-xs text-muted-foreground">{details}</p>}
      </AlertDescription>
    </Alert>
  );
}

/**
 * SuccessState - All good, positive state
 */
export function SuccessState({ title, message }: StateProps) {
  return (
    <Alert variant="default" className="border-primary/20 bg-primary/5">
      <CheckCircle2 className="h-4 w-4 text-primary" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

/**
 * GatedState - Feature locked, needs sync or upgrade
 */
interface GatedStateProps {
  title: string;
  message: string;
  action?: string;
}

export function GatedState({ title, message, action }: GatedStateProps) {
  return (
    <Alert variant="default" className="border-muted bg-muted/30">
      <AlertCircle className="h-4 w-4 text-muted-foreground" />
      <AlertTitle className="text-muted-foreground">{title}</AlertTitle>
      <AlertDescription className="text-muted-foreground">
        <p>{message}</p>
        {action && <p className="text-xs mt-1 font-medium">{action}</p>}
      </AlertDescription>
    </Alert>
  );
}
