import type { AppConfig, Card } from './types';
import { getVoteCount } from './votes';

function byVotesDesc(a: Card, b: Card): number {
  return getVoteCount(b) - getVoteCount(a);
}

function byNewestFirst(a: Card, b: Card): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

function byUpdatedDesc(a: Card, b: Card): number {
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
}

function byShippedDesc(a: Card, b: Card): number {
  const at = a.shippedAt ? new Date(a.shippedAt).getTime() : 0;
  const bt = b.shippedAt ? new Date(b.shippedAt).getTime() : 0;
  return bt - at;
}

/** New ideas: upvotes descending, then newest first (specs/03). */
export function orderConsidering(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => byVotesDesc(a, b) || byNewestFirst(a, b));
}

/** In progress: most recently updated first (specs/03). */
export function orderInProgress(cards: Card[]): Card[] {
  return [...cards].sort(byUpdatedDesc);
}

/** Not being considered: upvotes descending (specs/03). */
export function orderParked(cards: Card[]): Card[] {
  return [...cards].sort(byVotesDesc);
}

/** Recently shipped: shipped date descending, capped at the configured limit. */
export function orderShipped(cards: Card[], limit: number): Card[] {
  return [...cards].sort(byShippedDesc).slice(0, limit);
}

/**
 * Backlog: curated manifest order first (in exact sequence), then any
 * remaining backlog items appended by upvotes descending, so nothing is
 * hidden by omission. When `sort` is "votes" the whole column is ordered by
 * upvotes descending instead (specs/03, ADR-002).
 */
export function orderBacklog(
  cards: Card[],
  manifest: number[],
  sort: 'curated' | 'votes',
): Card[] {
  if (sort === 'votes') {
    return [...cards].sort(byVotesDesc);
  }
  const byNumber = new Map(cards.map((c) => [c.number, c]));
  const used = new Set<number>();
  const ordered: Card[] = [];
  for (const num of manifest) {
    const card = byNumber.get(num);
    if (card) {
      ordered.push(card);
      used.add(num);
    }
  }
  const remainder = cards
    .filter((c) => !used.has(c.number))
    .sort(byVotesDesc);
  return [...ordered, ...remainder];
}

export function orderColumns(
  cardsByStatus: Record<string, Card[]>,
  manifest: number[],
  config: AppConfig,
): Record<string, Card[]> {
  return {
    considering: orderConsidering(cardsByStatus.considering ?? []),
    'in-progress': orderInProgress(cardsByStatus['in-progress'] ?? []),
    backlog: orderBacklog(
      cardsByStatus.backlog ?? [],
      manifest,
      config.backlog.sort,
    ),
    parked: orderParked(cardsByStatus.parked ?? []),
    shipped: orderShipped(cardsByStatus.shipped ?? [], config.shipped.limit),
  };
}
