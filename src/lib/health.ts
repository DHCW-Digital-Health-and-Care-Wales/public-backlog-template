import type { AppConfig, Card, HealthSummary, RawIssue } from './types';
import { isPullRequest, labelNames, resolveStatus } from './normalise';

const DAY_MS = 24 * 60 * 60 * 1000;

export function daysBetween(fromIso: string, now: number): number {
  return Math.floor((now - new Date(fromIso).getTime()) / DAY_MS);
}

/** An in-progress item not updated within the configured window is stale. */
export function isStaleInProgress(
  card: Card,
  config: AppConfig,
  now: number,
): boolean {
  if (card.status !== 'in-progress') return false;
  return daysBetween(card.updatedAt, now) > config.health.inProgressStaleDays;
}

/**
 * Mark stale in-progress cards in place, returning the cards with the
 * `stale-in-progress` flag added where applicable.
 */
export function applyStaleness(
  cards: Card[],
  config: AppConfig,
  now: number,
): Card[] {
  return cards.map((card) => {
    if (isStaleInProgress(card, config, now) && !card.flags.includes('stale-in-progress')) {
      return { ...card, flags: [...card.flags, 'stale-in-progress'] };
    }
    return card;
  });
}

/**
 * Compute the health summary for maintainers: stale in-progress count,
 * untriaged queue size and oldest age, and a roll-up of content errors.
 */
export function buildHealthSummary(
  cards: Card[],
  rawIssues: RawIssue[],
  config: AppConfig,
  now: number,
): HealthSummary {
  const staleInProgress = cards.filter((c) =>
    c.flags.includes('stale-in-progress'),
  ).length;

  const untriagedIssues = rawIssues.filter((issue) => {
    if (isPullRequest(issue)) return false;
    if (issue.state !== 'open') return false;
    const names = labelNames(issue);
    const hasTriage = names.includes(config.labels.needsTriage);
    const { status } = resolveStatus(issue, config);
    return hasTriage && !status;
  });

  const oldestUntriagedDays =
    untriagedIssues.length === 0
      ? null
      : Math.max(...untriagedIssues.map((i) => daysBetween(i.created_at, now)));

  const flagged = cards
    .filter((c) => c.flags.length > 0)
    .map((c) => ({ number: c.number, flags: c.flags }));

  const contentErrorTypes = new Set([
    'multiple-status',
    'parked-without-rationale',
    'missing-welsh',
    'missing-english',
  ]);
  const contentErrors = cards.filter((c) =>
    c.flags.some((f) => contentErrorTypes.has(f)),
  ).length;

  return {
    staleInProgress,
    untriaged: untriagedIssues.length,
    oldestUntriagedDays,
    contentErrors,
    flags: flagged,
  };
}
