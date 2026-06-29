import type { Card } from './types';

/**
 * The single seam through which vote counts are read (ADR-003, AC-VOTE-05).
 * Today votes come from the GitHub thumbs-up reaction captured in the build
 * snapshot. A different source could be substituted here without touching the
 * renderer or the ordering logic.
 */
export function getVoteCount(card: Pick<Card, 'votes'>): number {
  return card.votes ?? 0;
}
