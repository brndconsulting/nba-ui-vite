/**
 * Select Page - "/select"
 * 
 * Layout:
 * - MinimalHeader (sticky top)
 * - Selection form (league + team)
 * - Footer
 * 
 * 100% shadcn/ui components only
 */
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useSearchParams } from "wouter";
import { ChevronRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { MinimalHeader } from "@/components/layout/MinimalHeader";
import { Footer } from "@/components/layout/Footer";
import { useAppContext } from "@/contexts/ContextProvider";
import { useLeagueTeams } from "@/hooks/useLeagueTeams";
import { filterActiveLeagues } from "@/lib/league";

export default function SelectPage() {
  const [, setLocation] = useLocation();
  const [searchParams] = useSearchParams();
  const { context, loading: contextLoading, error: contextError, setActiveContext } = useAppContext();
  
  const [selectedLeagueKey, setSelectedLeagueKey] = useState<string>("");
  const [selectedTeamKey, setSelectedTeamKey] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const urlTeam1 = searchParams.get('team1');
  const urlTeam2 = searchParams.get('team2');

  const { teams, loading: teamsLoading, error: teamsError } = useLeagueTeams(selectedLeagueKey || null);
  
  // Filter to show only active leagues (is_finished === false)
  const leagues = filterActiveLeagues(context?.leagues || []);

  useEffect(() => {
    setSelectedTeamKey("");
  }, [selectedLeagueKey]);

  useEffect(() => {
    if (context?.active_league_key && !selectedLeagueKey) {
      setSelectedLeagueKey(context.active_league_key);
    }
  }, [context, selectedLeagueKey]);

  useEffect(() => {
    if (context?.active_team_key && !selectedTeamKey && teams.length > 0) {
      const teamExists = teams.some(t => t.team_key === context.active_team_key);
      if (teamExists) {
        setSelectedTeamKey(context.active_team_key);
      }
    }
  }, [context, selectedTeamKey, teams]);

  const handleContinue = async () => {
    if (!selectedLeagueKey || !selectedTeamKey) return;

    setIsSubmitting(true);
    try {
      await setActiveContext(selectedLeagueKey, selectedTeamKey);
      const matchupUrl = `/app/matchup?team1=${selectedTeamKey}${urlTeam2 ? `&team2=${urlTeam2}` : ''}`;
      setLocation(matchupUrl);
    } catch (err) {
      console.error("Error setting context:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canContinue = selectedLeagueKey && selectedTeamKey && !isSubmitting;
  const selectedLeague = leagues.find(l => l.league_key === selectedLeagueKey);
  const selectedTeam = teams.find(t => t.team_key === selectedTeamKey);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <MinimalHeader />

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-6">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold">Select Your League</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Choose a league and team to analyze
          </p>
        </div>

        {/* Selection Card */}
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-base">League & Team</CardTitle>
            <CardDescription>
              Select from your Yahoo Fantasy leagues
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: League Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Badge variant="default" className="h-5 w-5 rounded-full p-0 justify-center text-xs">
                  1
                </Badge>
                Select League
              </Label>
              
              {contextLoading ? (
                <Skeleton className="h-9 w-full" />
              ) : contextError ? (
                <Alert variant="destructive">
                  <AlertDescription>{contextError}</AlertDescription>
                </Alert>
              ) : leagues.length === 0 ? (
                <Alert>
                  <AlertDescription>No leagues found.</AlertDescription>
                </Alert>
              ) : (
                <Select
                  value={selectedLeagueKey}
                  onValueChange={setSelectedLeagueKey}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a league...">
                      <span className="truncate">
                        {selectedLeague ? `${selectedLeague.name} (${selectedLeague.season})` : "Choose a league..."}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {leagues.map((league) => (
                      <SelectItem key={league.league_key} value={league.league_key}>
                        <span className="flex items-center gap-2">
                          {league.name} ({league.season})
                          {context?.active_league_key === league.league_key && (
                            <Check className="h-3 w-3 text-primary" />
                          )}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Step 2: Team Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Badge 
                  variant={selectedLeagueKey ? "default" : "secondary"} 
                  className="h-5 w-5 rounded-full p-0 justify-center text-xs"
                >
                  2
                </Badge>
                Select Team
              </Label>
              
              {!selectedLeagueKey ? (
                <p className="text-sm text-muted-foreground py-2">
                  Select a league first
                </p>
              ) : teamsLoading ? (
                <Skeleton className="h-9 w-full" />
              ) : teamsError ? (
                <Alert variant="destructive">
                  <AlertDescription>{teamsError}</AlertDescription>
                </Alert>
              ) : teams.length === 0 ? (
                <Alert>
                  <AlertDescription>No teams found.</AlertDescription>
                </Alert>
              ) : (
                <Select
                  value={selectedTeamKey}
                  onValueChange={setSelectedTeamKey}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a team...">
                      <span className="truncate">
                        {selectedTeam ? selectedTeam.name : "Choose a team..."}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.team_key} value={team.team_key}>
                        <span className="flex items-center gap-2">
                          {team.name}
                          {team.manager_name && (
                            <span className="text-muted-foreground">
                              ({team.manager_name})
                            </span>
                          )}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Continue Button */}
            <Button 
              className="w-full" 
              disabled={!canContinue}
              onClick={handleContinue}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Back to Landing */}
        <Button 
          variant="ghost" 
          size="sm"
          className="mt-4"
          onClick={() => setLocation("/")}
        >
          Back to Home
        </Button>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
