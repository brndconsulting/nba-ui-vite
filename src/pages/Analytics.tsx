/**
 * Analytics Page - Placeholder
 * Shows league leaders and team stats analysis
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">League leaders and statistical analysis</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Coming Soon
          </CardTitle>
          <CardDescription>
            Analytics view is under development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This tab will show league leaders, category rankings, team strengths/weaknesses, and statistical trends.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
