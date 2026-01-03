import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AlertCircle, HelpCircle } from 'lucide-react';

interface ProjectionCardProps {
  week: number;
  lastCheckedAt?: string;
}

export function ProjectionCard({ week, lastCheckedAt }: ProjectionCardProps) {
  return (
    <Card className="h-full border-yellow-200 bg-yellow-50/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Projection</CardTitle>
            <CardDescription>Week {week} forecast</CardDescription>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground">
                <HelpCircle className="h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Projection Not Available</h4>
                <p className="text-sm text-muted-foreground">
                  The projection engine has not been implemented by the backend yet.
                </p>
                <div className="mt-3 p-2 bg-muted rounded text-xs">
                  <p className="font-medium mb-1">Missing Domain:</p>
                  <p className="text-muted-foreground">projections</p>
                </div>
                {lastCheckedAt && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Last checked: {new Date(lastCheckedAt).toLocaleString()}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className="flex items-center gap-3">
        <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-yellow-900">Projection not implemented by backend</p>
          <p className="text-xs text-yellow-800 mt-1">
            This feature requires the backend to implement the projection engine.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
