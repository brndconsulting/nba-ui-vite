/**
 * Settings Page - Placeholder
 * Shows league settings and capabilities
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">League settings and configuration</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Coming Soon
          </CardTitle>
          <CardDescription>
            Settings view is under development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This tab will show league settings, scoring categories, roster rules, and system capabilities.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
