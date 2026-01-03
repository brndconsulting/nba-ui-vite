import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { InsiderCard } from '@/services/insiderService';
import { AlertCircle, TrendingUp, Zap, Target } from 'lucide-react';

interface InsiderTipsCardProps {
  cards: InsiderCard[];
}

const categoryIcons: Record<string, React.ReactNode> = {
  edge: <TrendingUp className="w-4 h-4" />,
  risk: <AlertCircle className="w-4 h-4" />,
  stream: <Zap className="w-4 h-4" />,
  swing: <Target className="w-4 h-4" />,
};

const impactColors: Record<string, string> = {
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
};

export function InsiderTipsCard({ cards }: InsiderTipsCardProps) {
  if (!cards || cards.length === 0) {
    return null;
  }

  return (
    <Card className="border-amber-200 dark:border-amber-900">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Insider Tips</CardTitle>
          <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950">
            {cards.length} insights
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="p-3 rounded-lg border border-amber-100 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400">
                {categoryIcons[card.category] || <Target className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm">{card.title}</h4>
                  <Badge
                    className={`text-xs ${impactColors[card.impact]}`}
                    variant="secondary"
                  >
                    {card.impact}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{card.description}</p>
                {card.action && (
                  <p className="text-xs mt-2 text-amber-700 dark:text-amber-300 font-medium">
                    → {card.action}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
