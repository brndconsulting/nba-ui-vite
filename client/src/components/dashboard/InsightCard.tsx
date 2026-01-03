import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { AlertCircle, Info, Lock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export interface InsightEvidence {
  label: string;
  value: string | number;
  timestamp?: string;
}

export interface InsightCardProps {
  title: string;
  message: string;
  impact?: 'high' | 'medium' | 'low';
  confidence?: 'high' | 'medium' | 'low';
  evidence?: InsightEvidence[];
  limitations?: string;
  locked?: boolean;
  lockReason?: string;
  loading?: boolean;
}

const getImpactColor = (impact?: string) => {
  switch (impact) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-accent text-yellow-800';
    case 'low':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-background text-foreground';
  }
};

const getConfidenceColor = (confidence?: string) => {
  switch (confidence) {
    case 'high':
      return 'bg-accent text-accent-foreground';
    case 'medium':
      return 'bg-accent text-accent-foreground';
    case 'low':
      return 'bg-accent text-accent-foreground';
    default:
      return 'bg-background text-foreground';
  }
};

export function InsightCard({
  title,
  message,
  impact,
  confidence,
  evidence,
  limitations,
  locked = false,
  lockReason,
  loading = false,
}: InsightCardProps) {
  const [evidenceOpen, setEvidenceOpen] = useState(false);

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-sm">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-border rounded animate-pulse" />
            <div className="h-4 bg-border rounded animate-pulse w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (locked) {
    return (
      <Card className="h-full opacity-60">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Lock className="w-4 h-4" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{lockReason || 'Sync required to unlock'}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm flex-1">{title}</CardTitle>
          {evidence && evidence.length > 0 && (
            <Popover open={evidenceOpen} onOpenChange={setEvidenceOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  title="View evidence"
                >
                  <Info className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Evidence</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {evidence.map((item, idx) => (
                      <div key={idx} className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="font-medium">{item.label}</span>
                          <span className="text-muted-foreground">{item.value}</span>
                        </div>
                        {item.timestamp && (
                          <div className="text-muted-foreground text-xs">
                            {new Date(item.timestamp).toLocaleString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p className="text-sm text-foreground mb-3">{message}</p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {impact && (
            <Badge className={getImpactColor(impact)} variant="secondary">
              Impact: {impact}
            </Badge>
          )}
          {confidence && (
            <Badge className={getConfidenceColor(confidence)} variant="secondary">
              {confidence} confidence
            </Badge>
          )}
        </div>

        {/* Limitations */}
        {limitations && (
          <div className="mt-auto pt-3 border-t text-xs text-muted-foreground">
            <p className="font-medium mb-1">Limitations:</p>
            <p>{limitations}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
