/**
 * App - Main application component
 * 
 * 3 SCREENS STRUCTURE:
 * 1. Landing (/) - Welcome page with CTA "Enter App"
 * 2. Select (/select) - League and team selection
 * 3. Dashboard Shell (/app/*) - Main app with Header + Tabs
 * 
 * The Dashboard Shell has selectors in header to change league/team.
 * If context is missing in /app/*, redirect to /select.
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider as NextThemesProvider } from "./contexts/ThemeContext";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { ContextProvider, useAppContext } from "./contexts/ContextProvider";
import { DashboardShell } from "./components/layout/DashboardShell";

// Pages
import Landing from '@/pages/Landing';
import SelectPage from '@/pages/Select';
import Matchup from '@/pages/Matchup';
import { Waiver } from '@/pages/Waiver';
import Schedule from '@/pages/Schedule';
import Analytics from '@/pages/Analytics';
import Managers from '@/pages/Managers';
import Settings from '@/pages/Settings';

/**
 * ContextGuard - Redirects to /select if context is missing in /app/* routes
 */
function ContextGuard({ children }: { children: React.ReactNode }) {
  const { activeLeague, activeTeam, loading } = useAppContext();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Only check after loading is complete
    if (loading) return;
    
    // If we're in /app/* and missing context, redirect to /select
    if (location.startsWith('/app') && (!activeLeague || !activeTeam)) {
      setLocation('/select');
    }
  }, [loading, activeLeague, activeTeam, location, setLocation]);

  // Show nothing while loading (prevents flash)
  if (loading && location.startsWith('/app')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * AppRouter - Routes for /app/* with Dashboard Shell
 */
function AppRouter() {
  return (
    <DashboardShell>
      <Switch>
        <Route path="/app/matchup" component={Matchup} />
        <Route path="/app/waiver" component={Waiver} />
        <Route path="/app/schedule" component={Schedule} />
        <Route path="/app/analytics" component={Analytics} />
        <Route path="/app/managers" component={Managers} />
        <Route path="/app/settings" component={Settings} />
        {/* Default /app -> /app/matchup */}
        <Route path="/app">
          <Redirect to="/app/matchup" />
        </Route>
        <Route component={NotFound} />
      </Switch>
    </DashboardShell>
  );
}

/**
 * MainRouter - Top level routing
 */
function MainRouter() {
  return (
    <ContextGuard>
      <Switch>
        {/* Landing page */}
        <Route path="/" component={Landing} />
        
        {/* Select league/team page */}
        <Route path="/select" component={SelectPage} />
        
        {/* Dashboard Shell (all /app/* routes) */}
        <Route path="/app/:rest*" component={AppRouter} />
        
        {/* Legacy routes - redirect to new structure */}
        <Route path="/matchup">
          <Redirect to="/app/matchup" />
        </Route>
        <Route path="/waiver">
          <Redirect to="/app/waiver" />
        </Route>
        <Route path="/schedule">
          <Redirect to="/app/schedule" />
        </Route>
        <Route path="/analytics">
          <Redirect to="/app/analytics" />
        </Route>
        <Route path="/managers">
          <Redirect to="/app/managers" />
        </Route>
        <Route path="/settings">
          <Redirect to="/app/settings" />
        </Route>
        
        {/* 404 */}
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </ContextGuard>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <NextThemesProvider defaultTheme="dark" switchable>
        <ThemeProvider>
          <ContextProvider>
            <TooltipProvider>
              <Toaster />
              <MainRouter />
            </TooltipProvider>
          </ContextProvider>
        </ThemeProvider>
      </NextThemesProvider>
    </ErrorBoundary>
  );
}

export default App;
// Build timestamp: 1767465711
