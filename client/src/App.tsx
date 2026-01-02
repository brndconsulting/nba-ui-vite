import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider as NextThemesProvider } from "./contexts/ThemeContext";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { ContextProvider } from "./contexts/ContextProvider";
import { ContextGate } from "./components/ContextGate";
import Home from '@/pages/Home';
import Matchup from '@/pages/Matchup';
import { Waiver } from '@/pages/Waiver';
import ThemeMatrix from '@/pages/ThemeMatrix';
import Settings from '@/pages/Settings';
import { Header } from '@/components/Header';

function Router() {
  return (
    <>
      <Header />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/matchup" component={Matchup} />
        <Route path="/waiver" component={Waiver} />
        <Route path="/settings" component={Settings} />
        <Route path="/__theme-matrix" component={ThemeMatrix} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  // Get owner ID from localStorage or environment
  const ownerId = localStorage.getItem('owner_id') || 'default_owner';

  return (
    <ErrorBoundary>
      <NextThemesProvider defaultTheme="light" switchable>
        <ThemeProvider>
          <ContextProvider ownerId={ownerId}>
            <TooltipProvider>
              <Toaster />
              <ContextGate>
                <Router />
              </ContextGate>
            </TooltipProvider>
          </ContextProvider>
        </ThemeProvider>
      </NextThemesProvider>
    </ErrorBoundary>
  );
}

export default App;
