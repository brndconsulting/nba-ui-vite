/**
 * InsiderPanel - Renderiza 4 cards determinísticas
 * - 100% shadcn/ui
 * - Textos desde copy_key
 * - Evidence opcional (debug)
 */
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { copy } from '@/lib/copy/es';
import type { InsiderData, Card as InsiderCard } from '@/lib/schemas/insider';

interface InsiderPanelProps {
  data: InsiderData | null;
  loading: boolean;
  error: string | null;
  showEvidence?: boolean;
}

export function InsiderPanel({
  data,
  loading,
  error,
  showEvidence = false,
}: InsiderPanelProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Función helper para interpolar params en copy keys
  const interpolateText = (text: string, params: Record<string, unknown>): string => {
    let result = text;
    Object.entries(params).forEach(([key, value]) => {
      result = result.replace(`{{${key}}}`, String(value));
    });
    return result;
  };

  // Función helper para obtener copy text
  const getCopyText = (key: string, params: Record<string, unknown> = {}): string => {
    const keys = key.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = copy;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (typeof value === 'string') {
      return interpolateText(value, params);
    }
    
    return key; // Fallback: devolver la key si no existe
  };

  // Función para renderizar badge por tipo (usando tokens shadcn)
  const getCardTypeColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'bg-muted text-foreground';
      case 'negative':
        return 'bg-destructive/10 text-destructive';
      case 'neutral':
        return 'bg-muted text-muted-foreground';
      case 'info':
        return 'bg-muted text-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data || data.cards.length !== 4) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Sin datos de insights disponibles</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{copy.insider.title}</h2>
        <p className="text-muted-foreground">{copy.insider.subtitle}</p>
      </div>

      {data.cards.map((card: InsiderCard) => (
        <Card key={card.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <CardTitle>{getCopyText(card.title_key, card.params)}</CardTitle>
                <CardDescription>
                  {getCopyText(card.body_key, card.params)}
                </CardDescription>
              </div>
              <Badge className={getCardTypeColor(card.type)}>
                {card.type}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Actions */}
            {card.actions && card.actions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {card.actions.map((action, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Aquí iría la navegación
                      console.warn('Action:', action.action);
                    }}
                  >
                    {getCopyText(action.label_key)}
                  </Button>
                ))}
              </div>
            )}

            {/* Evidence (debug) */}
            {showEvidence && card.evidence && card.evidence.length > 0 && (
              <div className="border-t pt-4">
                <button
                  onClick={() =>
                    setExpandedCard(expandedCard === card.id ? null : card.id)
                  }
                  className="text-xs text-muted-foreground hover:underline"
                >
                  {expandedCard === card.id ? '▼' : '▶'} {copy.insider.evidence.label}
                </button>

                {expandedCard === card.id && (
                  <div className="mt-2 space-y-2 text-xs">
                    {card.evidence.map((ev, idx) => (
                      <div key={idx} className="bg-muted p-2 rounded">
                        <div>
                          <strong>{copy.insider.evidence.domain}:</strong> {ev.domain}
                        </div>
                        <div>
                          <strong>{copy.insider.evidence.lastSyncAt}:</strong>{' '}
                          {ev.last_sync_at || 'N/A'}
                        </div>
                        {ev.checksum && (
                          <div>
                            <strong>{copy.insider.evidence.checksum}:</strong>{' '}
                            {ev.checksum.substring(0, 8)}...
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Meta info */}
      {data.meta && (
        <div className="text-xs text-muted-foreground text-center">
          Datos desde {new Date(data.meta.last_sync_at_min).toLocaleString()} hasta{' '}
          {new Date(data.meta.last_sync_at_max).toLocaleString()}
        </div>
      )}
    </div>
  );
}
