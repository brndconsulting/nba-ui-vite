import { Clock } from "lucide-react"
import { copy } from "@/copy/es"

interface StaleStateProps {
  lastSyncAt: string
}

export function StaleState({ lastSyncAt }: StaleStateProps) {
  return (
    <div className="mx-auto max-w-md rounded-lg border border-border bg-accent p-4">
      <div className="flex items-start gap-3">
        <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
        <div>
          <h3 className="font-semibold text-foreground">{copy.common.staleTitle}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {copy.common.lastUpdate}: {new Date(lastSyncAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}
