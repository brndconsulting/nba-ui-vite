/**
 * Header Component - Global fixed header for Dashboard Shell (/app/*)
 * 
 * 100% shadcn/ui components:
 * - Select, SelectContent, SelectItem, SelectTrigger, SelectValue
 * - Button
 * - Skeleton
 * - Tabs, TabsList, TabsTrigger (for module navigation)
 * 
 * Only Tailwind tokens - no custom CSS
 */
import { Trophy } from "lucide-react";
import { Link, useLocation } from "wouter";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppContext } from "@/contexts/ContextProvider";
import { useLeagueTeams } from "@/hooks/useLeagueTeams";
import { SyncStatusIndicator } from "../SyncStatusIndicator";
import { ThemeSelector } from "../ThemeSelector";
import { ThemeToggle } from "../ThemeToggle";
import { filterActiveLeagues } from "@/lib/league";
import type { League } from "@/hooks/useContext";

// 6 module tabs for /app/*
const MODULE_TABS = [
  { id: "dashboard", label: "Dashboard", path: "/app/matchup" },
  { id: "waiver", label: "Waiver Wire", path: "/app/waiver" },
  { id: "schedule", label: "Schedule", path: "/app/schedule" },
  { id: "analytics", label: "Analytics", path: "/app/analytics" },
  { id: "managers", label: "Managers", path: "/app/managers" },
  { id: "settings", label: "Settings", path: "/app/settings" },
] as const;

export function Header() {
  const [location, setLocation] = useLocation();
  const { context, activeLeague, activeTeam, setActiveContext, loading } = useAppContext();
  
  // Filter to show only active leagues (is_finished === false)
  const leagues = filterActiveLeagues(context?.leagues || []);
  const { teams, loading: teamsLoading } = useLeagueTeams(activeLeague?.league_key || null);
  
  const handleLeagueChange = async (leagueKey: string) => {
    if (leagueKey !== activeLeague?.league_key) {
      await setActiveContext(leagueKey, undefined);
      setLocation('/select');
    }
  };
  
  const handleTeamChange = async (teamKey: string) => {
    if (activeLeague?.league_key) {
      await setActiveContext(activeLeague.league_key, teamKey);
    }
  };
  
  const currentTeam = teams.find(t => t.team_key === activeTeam?.team_key) || activeTeam;
  const currentTab = MODULE_TABS.find(tab => location.startsWith(tab.path))?.id || "dashboard";
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      {/* Main Header Row */}
      <div className="container flex h-14 items-center gap-4">
        {/* Brand */}
        <Link 
          href={activeLeague && activeTeam ? "/app/matchup" : "/select"} 
          className="flex items-center gap-2 font-semibold"
        >
          <Trophy className="h-5 w-5 text-primary" />
          <span className="hidden sm:inline text-sm">Sport Insider</span>
        </Link>
        
        {/* Context Selectors */}
        <div className="flex items-center gap-2 flex-1">
          {/* League Selector */}
          {loading ? (
            <Skeleton className="h-9 w-40" />
          ) : (
            <Select
              value={activeLeague?.league_key || ""}
              onValueChange={handleLeagueChange}
              disabled={leagues.length === 0}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select League">
                  {activeLeague?.name || "Select League"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {leagues.map((league: League) => (
                  <SelectItem key={league.league_key} value={league.league_key}>
                    {league.name} ({league.season})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {/* Team Selector */}
          {loading || teamsLoading ? (
            <Skeleton className="h-9 w-32" />
          ) : (
            <Select
              value={currentTeam?.team_key || ""}
              onValueChange={handleTeamChange}
              disabled={!activeLeague || teams.length === 0}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select Team">
                  {currentTeam?.name || "Select Team"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.team_key} value={team.team_key}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        
        {/* Right Controls */}
        <div className="flex items-center gap-1">
          <SyncStatusIndicator />
          <ThemeSelector />
          <ThemeToggle />
        </div>
      </div>
      
      {/* Module Tabs Row */}
      <div className="border-t bg-muted/50">
        <div className="container">
          <nav className="flex items-center gap-1 overflow-x-auto py-2">
            {MODULE_TABS.map((tab) => {
              const isActive = currentTab === tab.id;
              
              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setLocation(tab.path)}
                >
                  {tab.label}
                </Button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
