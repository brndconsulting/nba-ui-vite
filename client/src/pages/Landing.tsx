/**
 * Landing Page - "/"
 * 
 * Layout (no scroll needed - everything fits in viewport):
 * - MinimalHeader (sticky top)
 * - Hero section (title + description + Enter App button)
 * - 4 feature cards in 2x2 grid (stack on mobile)
 * - Footer (Powered by BRND® Consulting | All rights reserved 2026)
 * 
 * 100% shadcn/ui components only
 */
import { useLocation } from "wouter";
import { BarChart3, Users, Calendar, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MinimalHeader } from "@/components/layout/MinimalHeader";
import { Footer } from "@/components/layout/Footer";

const FEATURES = [
  {
    icon: BarChart3,
    title: "Matchup Analysis",
    description: "Track your weekly matchups with detailed category breakdowns",
  },
  {
    icon: Users,
    title: "League Insights",
    description: "Compare teams and managers across your fantasy league",
  },
  {
    icon: Calendar,
    title: "Schedule Tracking",
    description: "Plan ahead with game schedules for your roster",
  },
  {
    icon: Zap,
    title: "Real-time Sync",
    description: "Data synced from Yahoo Fantasy for accurate stats",
  },
];

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <MinimalHeader />

      {/* Main Content - fills remaining space, centered */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Your Fantasy Sports Companion
          </h1>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl max-w-2xl">
            Analyze matchups, track stats, and dominate your league.
          </p>
          <Button 
            size="lg" 
            className="mt-8"
            onClick={() => setLocation("/select")}
          >
            Enter App
          </Button>
        </div>

        {/* Features Grid - 2x2 on desktop, 2x2 on mobile too */}
        <div className="grid w-full max-w-4xl gap-6 grid-cols-1 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                  <CardTitle>{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Footer - always at bottom */}
      <Footer />
    </div>
  );
}
