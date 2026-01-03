import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info, AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Bullet {
  label?: string;
  text: string;
}

interface EvidenceInput {
  domain: string;
  last_sync_at?: string;
  snapshot_id?: string;
  status?: 'fresh' | 'stale' | 'missing';
}

interface Evidence {
  inputs: EvidenceInput[];
  reasoning?: string;
  notes: string[];
}

interface InsiderCardProps {
  id: string;
  title: string;
  status: 'ready' | 'missing_inputs' | 'empty' | 'coming_soon' | 'error' | 'stale';
  summary: string;
  bullets?: Bullet[];
  impact?: 'low' | 'medium' | 'high' | null;
  confidence?: 'low' | 'medium' | 'high' | null;
  evidence?: Evidence;
  limitations?: string[];
  error?: { error_id: string; message: string };
  generatedAt?: string;
}

const getImpactColor = (impact?: string | null): string => {
  switch (impact) {
    case 'high':
      return 'bg-destructive/10 text-destructive';
    case 'medium':
      return 'bg-yellow-100 text-yellow-900';
    case 'low':
      return 'bg-yellow-50 text-yellow-700';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getConfidenceColor = (confidence?: string | null): string => {
  switch (confidence) {
    case 'high':
      return 'bg-green-100 text-green-900';
    case 'medium':
      return 'bg-yellow-100 text-yellow-900';
    case 'low':
      return 'bg-yellow-50 text-yellow-700';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const formatDate = (isoString?: string) => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
};

export const InsiderCard: React.FC<InsiderCardProps> = ({
  title,
  status,
  summary,
  bullets = [],
  impact,
  confidence,
  evidence,
  limitations = [],
  error,
  generatedAt,
}) => {
  const isStale = status === 'stale';

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="mt-1">{summary}</CardDescription>
          </div>
          {evidence && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="p-1 hover:bg-accent rounded-md transition-colors">
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 text-sm">
                      <div className="space-y-4">
                        {/* Inputs used */}
                        <div>
                          <h4 className="font-semibold mb-2">Inputs used</h4>
                          <div className="space-y-2">
                            {evidence.inputs.map((input, idx) => (
                              <div
                                key={idx}
                                className="text-xs bg-muted p-2 rounded"
                              >
                                <div className="font-medium capitalize">
                                  {input.domain}
                                </div>
                                <div className="text-muted-foreground">
                                  Status:{' '}
                                  <span className="capitalize">
                                    {input.status || 'unknown'}
                                  </span>
                                </div>
                                {input.last_sync_at && (
                                  <div className="text-muted-foreground">
                                    Last sync: {formatDate(input.last_sync_at)}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {/* Why this insight */}
                        {evidence.reasoning && (
                          <>
                            <div>
                              <h4 className="font-semibold mb-1">
                                Why this insight
                              </h4>
                              <p className="text-muted-foreground">
                                {evidence.reasoning}
                              </p>
                            </div>
                            <Separator />
                          </>
                        )}

                        {/* Limitations */}
                        <div>
                          <h4 className="font-semibold mb-2">Limitations</h4>
                          {limitations.length > 0 ? (
                            <ul className="text-xs space-y-1 text-muted-foreground">
                              {limitations.map((lim, idx) => (
                                <li key={idx}>• {lim}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-muted-foreground">
                              No limitations provided.
                            </p>
                          )}
                        </div>

                        <Separator />

                        {/* Timestamp */}
                        {generatedAt && (
                          <div className="text-xs text-muted-foreground">
                            Generated: {formatDate(generatedAt)}
                          </div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </TooltipTrigger>
                <TooltipContent>Evidence</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 flex-1">
        {/* Bullets */}
        {bullets.length > 0 && (
          <div className="space-y-2">
            {bullets.map((bullet, idx) => (
              <div key={idx} className="flex gap-2 text-sm">
                {bullet.label && (
                  <span className="font-semibold text-foreground min-w-fit">
                    {bullet.label}:
                  </span>
                )}
                <span className="text-foreground">{bullet.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Badges */}
        {(impact || confidence) && (
          <div className="flex gap-2 flex-wrap">
            {impact && (
              <Badge variant="outline" className={getImpactColor(impact)}>
                Impact: {impact}
              </Badge>
            )}
            {confidence && (
              <Badge
                variant="outline"
                className={getConfidenceColor(confidence)}
              >
                Confidence: {confidence}
              </Badge>
            )}
          </div>
        )}

        {/* Stale badge */}
        {isStale && (
          <Badge variant="outline" className="mt-auto">
            Stale
          </Badge>
        )}

        {/* Error state */}
        {error && (
          <Alert variant="destructive" className="mt-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-semibold">{error.error_id}</div>
              <div className="text-sm">{error.message}</div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
