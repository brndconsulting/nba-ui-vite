/**
 * ContextGate - Guards access without active context
 * 
 * States (per spec v1.2):
 * - Loading: Fetching context from API
 * - Empty: No leagues found for owner
 * - Missing: Context exists but no active selection
 * - Error: API error or token invalid (401 = Reconnect CTA)
 * - Ready: Has active league and team → render children
 * 
 * Design: 100% shadcn/ui, no CSS ad-hoc, no hardcode estético
 * 
 * Data flow:
 * - Leagues come from /v1/context
 * - Teams come from /v1/league-teams (loaded when league is selected)
 * 
 * Gating Rule:
 * - Si active_league_key == null o active_team_key == null:
 *   - NO romper la app
 *   - Mostrar Empty State en el contenido con CTA para seleccionar
 *   - El header igual se muestra para poder seleccionar
 */
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/ContextProvider';
import { useLeagueTeams, type LeagueTeam } from '@/hooks/useLeagueTeams';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Trophy, RefreshCw } from 'lucide-react';

export function ContextGate({ children }: { children: React.ReactNode }) {
  const { context, loading, error, setActiveContext } = useAppContext();
  const [selectedLeagueKey, setSelectedLeagueKey] = useState<string>('');
  const [selectedTeamKey, setSelectedTeamKey] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load teams when league is selected
  const { teams, loading: teamsLoading, error: teamsError } = useLeagueTeams(selectedLeagueKey || null);

  // Reset team selection when league changes
  useEffect(() => {
    setSelectedTeamKey('');
  }, [selectedLeagueKey]);

  // === LOADING STATE ===
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
            <CardTitle>Loading...</CardTitle>
            <CardDescription>Fetching your fantasy leagues</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // === ERROR STATE (including 401) ===
  if (error) {
    const is401 = error.includes('401') || error.toLowerCase().includes('unauthorized');
    
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              {is401 ? 'Session Expired' : 'Error'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{is401 ? 'Token Invalid' : 'Connection Error'}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            {is401 ? (
              <Button 
                className="w-full" 
                onClick={() => window.location.href = '/auth'}
              >
                Reconnect
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // === EMPTY STATE (no leagues) ===
  if (!context || context.leagues.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Trophy className="h-12 w-12 text-muted-foreground" />
            </div>
            <CardTitle>No Leagues Found</CardTitle>
            <CardDescription>
              No fantasy leagues found for your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Please verify your Yahoo Fantasy account is connected and has active leagues.
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // === READY STATE (has active context) ===
  if (context.active_league_key && context.active_team_key) {
    return <>{children}</>;
  }

  // === MISSING STATE (needs selection) ===
  const leagues = context.leagues;

  const handleSubmit = async () => {
    if (!selectedLeagueKey || !selectedTeamKey) return;

    setIsSubmitting(true);
    try {
      const success = await setActiveContext(selectedLeagueKey, selectedTeamKey);
      if (!success) {
        // Error will be shown via context error state
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Trophy className="h-12 w-12 text-primary" />
          </div>
          <CardTitle>Welcome to Sport Insider</CardTitle>
          <CardDescription>
            Select your league and team to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* League Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">League</label>
            <Select value={selectedLeagueKey} onValueChange={setSelectedLeagueKey}>
              <SelectTrigger>
                <SelectValue placeholder="Select a league" />
              </SelectTrigger>
              <SelectContent>
                {leagues.map((league) => (
                  <SelectItem key={league.league_key} value={league.league_key}>
                    <div className="flex items-center gap-2">
                      <span>{league.name}</span>
                      <span className="text-muted-foreground">({league.season})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Team Selector - loaded from /v1/league-teams */}
          {selectedLeagueKey && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Team</label>
              {teamsLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : teamsError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{teamsError}</AlertDescription>
                </Alert>
              ) : teams.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>No teams found for this league</AlertDescription>
                </Alert>
              ) : (
                <Select value={selectedTeamKey} onValueChange={setSelectedTeamKey}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team: LeagueTeam) => (
                      <SelectItem key={team.team_key} value={team.team_key}>
                        <div className="flex items-center gap-2">
                          {team.logo_url && (
                            <img 
                              src={team.logo_url} 
                              alt="" 
                              className="h-4 w-4 rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          )}
                          <span>{team.name}</span>
                          {team.manager_name && (
                            <span className="text-muted-foreground">({team.manager_name})</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!selectedLeagueKey || !selectedTeamKey || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
