/**
 * Waiver & Recomendaciones
 * - ContextGate obligatorio
 * - Estados honestos: Skeleton, EmptyState, ErrorState, StaleState
 * - 100% shadcn/ui
 * - Textos desde copy keys
 */
import { ContextGate } from '@/components/ContextGate';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { copy } from '@/lib/copy/es';

interface Recommendation {
  id: string;
  playerName: string;
  action: 'add' | 'drop' | 'add_drop';
  reason: string;
  source: 'yahoo' | 'user';
  confidence?: number;
}

export function Waiver() {
  // Estados simulados (sin data real = EmptyState honesto)
  const isLoading = false;
  const isEmpty = true;
  const isError = false;
  const recommendations: Recommendation[] = [];
  const lastSyncAt = new Date();

  // Helper para color de acción (usando tokens shadcn)
  const getActionColor = (action: string) => {
    switch (action) {
      case 'add':
        return 'bg-accent text-accent-foreground';
      case 'drop':
        return 'bg-destructive text-destructive-foreground';
      case 'add_drop':
        return 'bg-primary text-primary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // Helper para color de fuente (usando tokens shadcn)
  const getSourceColor = (source: string) => {
    switch (source) {
      case 'yahoo':
        return 'bg-primary text-primary-foreground';
      case 'user':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <ContextGate>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{copy.waiver.title}</h1>
              <p className="text-muted-foreground">{copy.waiver.subtitle}</p>
            </div>

            {/* Error State */}
            {isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{copy.waiver.error.failedToLoad}</AlertDescription>
              </Alert>
            )}

            {/* Empty State */}
            {isEmpty && !isLoading && (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">{copy.waiver.empty.noRecommendations}</p>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {copy.waiver.actions.refresh}
                </Button>
              </Card>
            )}

            {/* Stale State */}
            {!isEmpty && lastSyncAt && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {copy.waiver.stale.label} - {lastSyncAt.toLocaleString()}
                    </AlertDescription>
              </Alert>
            )}

            {/* Recommendations Table */}
            {!isEmpty && !isLoading && (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{copy.waiver.table.player}</TableHead>
                      <TableHead>{copy.waiver.table.action}</TableHead>
                      <TableHead>{copy.waiver.table.reason}</TableHead>
                      <TableHead>{copy.waiver.table.source}</TableHead>
                      <TableHead>{copy.waiver.table.confidence}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recommendations.map((rec) => (
                      <TableRow key={rec.id}>
                        <TableCell>{rec.playerName}</TableCell>
                        <TableCell>
                          <Badge className={getActionColor(rec.action)}>
                            {rec.action}
                          </Badge>
                        </TableCell>
                        <TableCell>{rec.reason}</TableCell>
                        <TableCell>
                          <Badge className={getSourceColor(rec.source)}>
                            {rec.source}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {rec.confidence ? `${Math.round(rec.confidence * 100)}%` : '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </div>
        </main>
      </div>
    </ContextGate>
  );
}
