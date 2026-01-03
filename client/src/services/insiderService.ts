/**
 * Local Insider Tips Service
 * Generates insights on the frontend while backend deployment catches up
 */

export interface InsiderCard {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  action?: string;
  category: 'edge' | 'risk' | 'stream' | 'swing';
}

export interface MatchupData {
  teams: Array<{
    team_key: string;
    stats: Array<{
      stat_id: number;
      value: string | number;
    }>;
  }>;
}

export class InsiderService {
  /**
   * Generate all 4 insider insights from matchup data
   */
  static generateInsights(
    matchupData: MatchupData,
    _leagueKey: string,
    youTeamKey: string,
    opponentTeamKey: string
  ): InsiderCard[] {
    const cards: InsiderCard[] = [];

    // 1. Matchup Edge
    const matchupEdge = this.calculateMatchupEdge(
      matchupData,
      youTeamKey,
      opponentTeamKey
    );
    if (matchupEdge) cards.push(matchupEdge);

    // 2. Streaming Edge
    const streamingEdge = this.calculateStreamingEdge(
      matchupData,
      youTeamKey,
      opponentTeamKey
    );
    if (streamingEdge) cards.push(streamingEdge);

    // 3. Risk Watch
    const riskWatch = this.calculateRiskWatch(matchupData, youTeamKey);
    if (riskWatch) cards.push(riskWatch);

    // 4. Category Swing
    const categorySwing = this.calculateCategorySwing(
      matchupData,
      youTeamKey,
      opponentTeamKey
    );
    if (categorySwing) cards.push(categorySwing);

    return cards;
  }

  private static calculateMatchupEdge(
    matchupData: MatchupData,
    youTeamKey: string,
    _opponentTeamKey: string
  ): InsiderCard | null {
    if (!matchupData.teams || matchupData.teams.length < 2) return null;

    const youStats: Record<number, number> = {};
    const oppStats: Record<number, number> = {};

    for (const team of matchupData.teams) {
      const stats: Record<number, number> = {};
      for (const stat of team.stats) {
        stats[stat.stat_id] = parseFloat(String(stat.value)) || 0;
      }

      if (team.team_key === youTeamKey) {
        Object.assign(youStats, stats);
      } else {
        Object.assign(oppStats, stats);
      }
    }

    if (Object.keys(youStats).length === 0 || Object.keys(oppStats).length === 0) {
      return null;
    }

    // Find categories where you win
    const winningCats = [];
    for (const [statId, yourValue] of Object.entries(youStats)) {
      const oppValue = oppStats[parseInt(statId)] || 0;
      if (yourValue > oppValue) {
        winningCats.push({
          statId: parseInt(statId),
          yourValue,
          oppValue,
          margin: yourValue - oppValue,
        });
      }
    }

    winningCats.sort((a, b) => b.margin - a.margin);
    const topCats = winningCats.slice(0, 3);

    if (topCats.length === 0) return null;

    const impact = topCats.length >= 3 ? 'high' : 'medium';
    const catNames = topCats.map((c) => `Cat ${c.statId}`).join(', ');

    return {
      title: 'Matchup Edge',
      description: `You have the advantage in ${catNames}. Focus on these categories to secure the win.`,
      impact,
      action: 'Stream players in these categories',
      category: 'edge',
    };
  }

  private static calculateStreamingEdge(
    matchupData: MatchupData,
    _youTeamKey: string,
    _opponentTeamKey: string
  ): InsiderCard | null {
    // Simplified: check if you have more games than opponent
    if (!matchupData.teams || matchupData.teams.length < 2) return null;

    // This would normally check schedule data
    // For now, return a generic streaming tip
    return {
      title: 'Streaming Edge',
      description:
        'Look for players with favorable schedules this week. Check back tomorrow for updated matchup data.',
      impact: 'medium',
      action: 'Check player schedules',
      category: 'stream',
    };
  }

  private static calculateRiskWatch(
    _matchupData: MatchupData,
    _youTeamKey: string
  ): InsiderCard | null {
    // Simplified: generic risk watch
    return {
      title: 'Risk Watch',
      description:
        'Monitor your star players for injury updates. Check official team reports before game time.',
      impact: 'high',
      action: 'Review injury reports',
      category: 'risk',
    };
  }

  private static calculateCategorySwing(
    matchupData: MatchupData,
    youTeamKey: string,
    _opponentTeamKey: string
  ): InsiderCard | null {
    if (!matchupData.teams || matchupData.teams.length < 2) return null;

    // Find close categories
    const youStats: Record<number, number> = {};
    const oppStats: Record<number, number> = {};

    for (const team of matchupData.teams) {
      const stats: Record<number, number> = {};
      for (const stat of team.stats) {
        stats[stat.stat_id] = parseFloat(String(stat.value)) || 0;
      }

      if (team.team_key === youTeamKey) {
        Object.assign(youStats, stats);
      } else {
        Object.assign(oppStats, stats);
      }
    }

    // Find close categories (margin < 10%)
    const closeCats = [];
    for (const [statId, yourValue] of Object.entries(youStats)) {
      const oppValue = oppStats[parseInt(statId)] || 0;
      const margin = Math.abs(yourValue - oppValue);
      const pct = oppValue > 0 ? (margin / oppValue) * 100 : 0;

      if (pct < 10 && pct > 0) {
        closeCats.push({
          statId: parseInt(statId),
          margin,
          pct,
          yourValue,
          oppValue,
        });
      }
    }

    if (closeCats.length === 0) return null;

    closeCats.sort((a, b) => a.pct - b.pct);
    const topCat = closeCats[0];

    return {
      title: 'Category Swing',
      description: `Category ${topCat.statId} is very close (${topCat.margin.toFixed(1)} point margin). One key pickup could swing this category.`,
      impact: 'high',
      action: 'Target pickups in this category',
      category: 'swing',
    };
  }
}
