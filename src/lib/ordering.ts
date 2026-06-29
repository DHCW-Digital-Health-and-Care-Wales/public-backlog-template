import type { Card } from './types';

function byVotesDesc(a: Card, b: Card): number {
  return b.votes - a.votes;
}
function byNewestFirst(a: Card, b: Card): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}
function byUpdatedDesc(a: Card, b: Card): number {
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
}
function byShippedDesc(a: Card, b: Card): number {
  return new Date(b.shippedAt || 0).getTime() - new Date(a.shippedAt || 0).getTime();
}

/** New ideas: votes descending, then newest first. */
export function orderConsidering(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => byVotesDesc(a, b) || byNewestFirst(a, b));
}

/** In progress: most recently updated first. */
export function orderInProgress(cards: Card[]): Card[] {
  return [...cards].sort(byUpdatedDesc);
}

/** Parked: votes descending. */
export function orderParked(cards: Card[]): Card[] {
  return [...cards].sort(byVotesDesc);
}

/** Shipped: shipped date descending, capped at limit. */
export function orderShipped(cards: Card[], limit: number): Card[] {
  return [...cards].sort(byShippedDesc).slice(0, limit);
}

/**
 * Backlog: manifest order first, then remaining by votes descending.
 * sort=votes orders the whole column by votes descending.
 */
export function orderBacklog(
  cards: Card[],
  manifest: number[],
  sort: 'curated' | 'votes',
): Card[] {
  if (sort === 'votes') return [...cards].sort(byVotesDesc);
  const byNumber = new Map(cards.map((c) => [c.number, c]));
  const listed: Card[] = [];
  const used = new Set<number>();
  for (const n of manifest) {
    const c = byNumber.get(n);
    if (c) {
      listed.push(c);
      used.add(n);
    }
  }
  const rest = cards.filter((c) => !used.has(c.number)).sort(byVotesDesc);
  return [...listed, ...rest];
}
