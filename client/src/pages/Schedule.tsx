/**
 * Schedule Page - Placeholder
 * Shows team schedule and upcoming games
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export default function Schedule() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Schedule</h1>
        <p className="text-muted-foreground">View your team upcoming games and schedule</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Coming Soon
          </CardTitle>
          <CardDescription>
            Schedule view is under development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This tab will show your team game schedule, streaming opportunities, and weekly planning tools.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
