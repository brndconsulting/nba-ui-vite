/**
 * H2H History Section (E) - MissingState permanente
 * 
 * Estado inicial V1.3: NO disponible (no indexado en backend)
 * 
 * Copy exacto (OBLIGATORIO):
 * "H2H Cross-League History requires deep-sync. Not available in current snapshot."
 * 
 * Además mostrar:
 * - "Endpoint needed: /v1/h2h"
 * - last_checked_at
 */
import { History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MissingState } from "./states";

interface H2HHistoryProps {
  lastCheckedAt?: string | null;
}

/**
 * H2H History Card - Always MissingState in V1.3
 */
export function H2HHistory({ lastCheckedAt }: H2HHistoryProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <History className="h-4 w-4" />
          H2H Cross-League History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <MissingState
          title="Not Available"
          message="H2H Cross-League History requires deep-sync. Not available in current snapshot."
          endpointNeeded="/v1/h2h"
          lastCheckedAt={lastCheckedAt}
        />
      </CardContent>
    </Card>
  );
}
