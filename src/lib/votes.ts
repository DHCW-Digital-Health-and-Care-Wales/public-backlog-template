import type { GithubIssue } from './types';

/**
 * Single abstraction for reading a vote count (ADR-003 seam, AC-VOTE-05).
 * Today the source is the GitHub +1 reaction; a different source could be
 * substituted here without touching the renderer.
 */
export function readVotes(issue: Pick<GithubIssue, 'reactions'>): number {
  const count = issue.reactions?.['+1'];
  return typeof count === 'number' && count > 0 ? count : 0;
}
