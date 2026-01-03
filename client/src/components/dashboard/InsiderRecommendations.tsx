/**
 * InsiderRecommendations Component
 * 
 * Shows 4 insight cards in 2x2 grid (stack on mobile)
 * Only shows real data - MissingState if insufficient inputs
 * 100% shadcn/ui components only
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, AlertCircle, TrendingUp, TrendingDown, Calendar, Users } from 'lucide-react';

interface InsiderTip {
  id: string;
  title: string;
  message: string;
  impact?: 'high' | 'medium' | 'low';
  type: 'strength' | 'weakness' | 'schedule' | 'matchup';
  timestamp?: string;
}

interface InsiderRecommendationsProps {
  tips: InsiderTip[];
  loading: boolean;
  error: string | null;
  hasRequiredInputs: boolean;
  missingInputs?: string[];
}

function getImpactVariant(impact?: string): 'default' | 'secondary' | 'outline' {
  switch (impact) {
    case 'high':
      return 'default';
    case 'medium':
      return 'secondary';
    default:
      return 'outline';
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'strength':
      return TrendingUp;
    case 'weakness':
      return TrendingDown;
    case 'schedule':
      return Calendar;
    case 'matchup':
      return Users;
    default:
      return Lightbulb;
  }
}

function InsiderCard({ tip, loading }: { tip?: InsiderTip; loading: boolean }) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-4 w-1/4 mt-2" />
        </CardContent>
      </Card>
    );
  }

  if (!tip) {
    return (
      <Card className="opacity-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            AI-powered insights coming soon
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  const Icon = getTypeIcon(tip.type);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {tip.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <CardDescription>{tip.message}</CardDescription>
        <div className="flex items-center gap-2">
          {tip.impact && (
            <Badge variant={getImpactVariant(tip.impact)} className="text-xs">
              {tip.impact} impact
            </Badge>
          )}
          {tip.timestamp && (
            <span className="text-xs text-muted-foreground">
              {new Date(tip.timestamp).toLocaleDateString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function InsiderRecommendations({
  tips,
  loading,
  error,
  hasRequiredInputs,
  missingInputs = [],
}: InsiderRecommendationsProps) {
  if (error) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Insider Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!hasRequiredInputs && !loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Insider Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Insider not available (insufficient inputs)
              {missingInputs.length > 0 && (
                <span className="block text-xs mt-1">
                  Missing: {missingInputs.join(', ')}
                </span>
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Create 4 slots - fill with tips or placeholders
  const slots = [0, 1, 2, 3].map(i => tips[i] || null);

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold flex items-center gap-2">
        <Lightbulb className="h-4 w-4" />
        Insider Tips
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {slots.map((tip, index) => (
          <InsiderCard key={tip?.id || index} tip={tip || undefined} loading={loading} />
        ))}
      </div>
    </div>
  );
}
