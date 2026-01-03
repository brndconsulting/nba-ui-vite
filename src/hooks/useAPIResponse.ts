import { useState, useEffect } from "react"
import { z } from "zod"
import { createAPIResponseSchema } from "@/lib/zod-schemas"

interface UseAPIResponseResult<T> {
  data: T | null
  isLoading: boolean
  error: Array<{ code: string; message: string; field?: string }> | null
  isStale: boolean
  lastSyncAt: string | null
  capabilities: Record<string, unknown> | null
}

export function useAPIResponse<T extends z.ZodTypeAny>(
  url: string,
  dataSchema: T,
  options?: { refetchInterval?: number }
): UseAPIResponseResult<z.infer<T>> {
  const [state, setState] = useState<UseAPIResponseResult<z.infer<T>>>({
    data: null,
    isLoading: true,
    error: null,
    isStale: false,
    lastSyncAt: null,
    capabilities: null,
  })

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const fetchData = async () => {
      try {
        const response = await fetch(url, { signal: controller.signal })
        const json = await response.json()

        // Validate against API Envelope schema
        const envelopeSchema = createAPIResponseSchema(dataSchema)
        const validated = envelopeSchema.parse(json)

        if (isMounted) {
          setState({
            data: validated.data || null,
            isLoading: false,
            error: validated.errors || null,
            isStale: Object.values(validated.meta.last_sync_at).some(
              (s) => s.status === "stale"
            ),
            lastSyncAt: validated.meta.snapshot_date,
            capabilities: validated.capabilities,
          })
        }
      } catch (err) {
        if (isMounted) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: [
              {
                code: "VALIDATION_ERROR",
                message: err instanceof Error ? err.message : "Unknown error",
              },
            ],
          }))
        }
      }
    }

    fetchData()

    // Setup refetch interval if provided
    let interval: ReturnType<typeof setInterval> | null = null
    if (options?.refetchInterval) {
      interval = setInterval(fetchData, options.refetchInterval)
    }

    return () => {
      isMounted = false
      controller.abort()
      if (interval) clearInterval(interval)
    }
  }, [url, dataSchema, options?.refetchInterval])

  return state
}
