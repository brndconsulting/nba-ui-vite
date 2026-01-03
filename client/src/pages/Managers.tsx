/**
 * Managers Page - Placeholder
 * Shows league managers and profiles
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function Managers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Managers</h1>
        <p className="text-muted-foreground">League managers and profiles</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Coming Soon
          </CardTitle>
          <CardDescription>
            Managers view is under development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This tab will show league managers, their profiles, team comparisons, and head-to-head history.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
