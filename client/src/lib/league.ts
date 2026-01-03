/**
 * League utility functions
 * 
 * Centralized logic for league status and filtering.
 * Based on Yahoo's is_finished flag - the canonical source of truth.
 */

import type { League } from '@/hooks/useContext';

/**
 * Check if a league is currently active.
 * 
 * A league is considered active ONLY if Yahoo explicitly says it's not finished.
 * - is_finished === false → Active (show)
 * - is_finished === true → Finished (hide)
 * - is_finished === null/undefined → Unknown status (hide)
 * 
 * @param league - The league to check
 * @returns true if the league is active, false otherwise
 */
export function isLeagueActive(league: League): boolean {
  return league.is_finished === false;
}

/**
 * Check if a league is finished.
 * 
 * @param league - The league to check
 * @returns true if the league is explicitly marked as finished
 */
export function isLeagueFinished(league: League): boolean {
  return league.is_finished === true;
}

/**
 * Check if a league has unknown status.
 * 
 * This happens when the backend hasn't synced is_finished from Yahoo yet.
 * 
 * @param league - The league to check
 * @returns true if the league status is unknown
 */
export function isLeagueStatusUnknown(league: League): boolean {
  return league.is_finished === null || league.is_finished === undefined;
}

/**
 * Filter an array of leagues to only include active ones.
 * 
 * @param leagues - Array of leagues to filter
 * @returns Array of active leagues only
 */
export function filterActiveLeagues(leagues: League[]): League[] {
  return leagues.filter(isLeagueActive);
}

/**
 * Get league status as a human-readable string.
 * 
 * @param league - The league to check
 * @returns Status string: "active", "finished", or "unknown"
 */
export function getLeagueStatus(league: League): 'active' | 'finished' | 'unknown' {
  if (league.is_finished === false) return 'active';
  if (league.is_finished === true) return 'finished';
  return 'unknown';
}
