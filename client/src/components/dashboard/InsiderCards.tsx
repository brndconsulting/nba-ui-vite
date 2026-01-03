/**
 * Insider Section (B) - 4 Insight Cards
 * 
 * Cards:
 * 1. Matchup Edge
 * 2. Streaming Edge
 * 3. Risk (GTD/Injuries)
 * 4. Key Swing
 * 
 * Contrato obligatorio por card:
 * - title
 * - message (1-2 líneas)
 * - impact badge (si existe)
 * - confidence badge (si existe)
 * - Evidence popover (OBLIGATORIO): lista de inputs usados + timestamps
 * - limitations (OBLIGATORIO): qué falta para mejorar el insight
 * 
 * Gating por capabilities:
 * - Si capabilities.has_matchups = false → card gris + candado + "Sync Matchups to unlock"
 */
import { Zap, TrendingUp, AlertTriangle, Target, Lock, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GatedState } from "./states";

// Types
interface EvidenceItem {
  source: string;
  timestamp: string;
}

interface Insight {
  title: string;
  message: string;
  impact?: "high" | "medium" | "low";
  confidence?: "high" | "medium" | "low";
  evidence: EvidenceItem[];
  limitations: string[];
}

interface InsiderCardsProps {
  matchupEdge: Insight | null;
  streamingEdge: Insight | null;
  risk: Insight | null;
  keySwing: Insight | null;
  capabilities: {
    has_matchups: boolean;
    has_roster: boolean;
    has_schedule: boolean;
    has_team_stats: boolean;
  };
}

/**
 * Impact badge variant
 */
function getImpactVariant(impact?: string): "default" | "secondary" | "outline" {
  if (impact === "high") return "default";
  if (impact === "medium") return "secondary";
  return "outline";
}

/**
 * Confidence badge variant
 */
function getConfidenceVariant(confidence?: string): "default" | "secondary" | "outline" {
  if (confidence === "high") return "default";
  if (confidence === "medium") return "secondary";
  return "outline";
}

/**
 * Icon mapping for insight types
 */
const INSIGHT_ICONS = {
  matchupEdge: Zap,
  streamingEdge: TrendingUp,
  risk: AlertTriangle,
  keySwing: Target,
};

/**
 * Single Insight Card with Evidence Popover
 */
function InsightCard({ 
  insight, 
  icon: Icon,
  gated,
  gateMessage
}: { 
  insight: Insight | null;
  icon: React.ElementType;
  gated?: boolean;
  gateMessage?: string;
}) {
  // Gated state
  if (gated) {
    return (
      <Card className="bg-muted/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
            <Lock className="h-4 w-4" />
            Locked
          </CardTitle>
        </CardHeader>
        <CardContent>
          <GatedState
            title="Feature Locked"
            message={gateMessage || "Sync required to unlock this insight."}
            action="Sync Matchups to unlock"
          />
        </CardContent>
      </Card>
    );
  }

  // No data
  if (!insight) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Icon className="h-4 w-4" />
            Insight
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No insight available yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Icon className="h-4 w-4" />
            {insight.title}
          </CardTitle>
          
          {/* Evidence Popover (OBLIGATORIO) */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Info className="h-3 w-3" />
                <span className="sr-only">View evidence</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Evidence</h4>
                <div className="space-y-2">
                  {insight.evidence.length > 0 ? (
                    insight.evidence.map((e, i) => (
                      <div key={i} className="text-xs">
                        <p className="font-medium">{e.source}</p>
                        <p className="text-muted-foreground">{new Date(e.timestamp).toLocaleString()}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">No evidence sources available.</p>
                  )}
                </div>
                
                <Separator />
                
                <h4 className="font-medium text-sm">Limitations</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {insight.limitations.length > 0 ? (
                    insight.limitations.map((l, i) => (
                      <li key={i}>• {l}</li>
                    ))
                  ) : (
                    <li>• No known limitations</li>
                  )}
                </ul>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Message */}
        <p className="text-sm">{insight.message}</p>
        
        {/* Badges */}
        <div className="flex gap-2">
          {insight.impact && (
            <Badge variant={getImpactVariant(insight.impact)} className="text-xs">
              Impact: {insight.impact}
            </Badge>
          )}
          {insight.confidence && (
            <Badge variant={getConfidenceVariant(insight.confidence)} className="text-xs">
              Confidence: {insight.confidence}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Insider Cards Section - 4 cards in 2x2 grid
 */
export function InsiderCards({ 
  matchupEdge, 
  streamingEdge, 
  risk, 
  keySwing,
  capabilities 
}: InsiderCardsProps) {
  const isMatchupsGated = !capabilities.has_matchups;
  const isRosterGated = !capabilities.has_roster;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <InsightCard 
        insight={matchupEdge} 
        icon={INSIGHT_ICONS.matchupEdge}
        gated={isMatchupsGated}
        gateMessage="Matchup data not synced"
      />
      <InsightCard 
        insight={streamingEdge} 
        icon={INSIGHT_ICONS.streamingEdge}
        gated={isMatchupsGated}
        gateMessage="Matchup data not synced"
      />
      <InsightCard 
        insight={risk} 
        icon={INSIGHT_ICONS.risk}
        gated={isRosterGated}
        gateMessage="Roster data not synced"
      />
      <InsightCard 
        insight={keySwing} 
        icon={INSIGHT_ICONS.keySwing}
        gated={isMatchupsGated}
        gateMessage="Matchup data not synced"
      />
    </div>
  );
}
