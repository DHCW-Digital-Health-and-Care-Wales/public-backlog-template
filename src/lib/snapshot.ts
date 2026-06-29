import type { AppConfig, Card, RawIssue, Snapshot, Status } from './types';
import { isEligible, normaliseIssue } from './normalise';
import { applyStaleness, buildHealthSummary } from './health';
import { orderColumns } from './ordering';

/**
 * Turn a set of raw GitHub issues into the ordered, normalised snapshot the
 * renderer consumes (specs/07). Pure and deterministic: callers pass `now`
 * so tests are stable.
 */
export function buildSnapshot(
  rawIssues: RawIssue[],
  config: AppConfig,
  manifest: number[],
  now: number,
): Snapshot {
  const eligible = rawIssues.filter((issue) => isEligible(issue, config));
  const cards: Card[] = applyStaleness(
    eligible.map((issue) => normaliseIssue(issue, config)),
    config,
    now,
  );

  const byStatus: Record<string, Card[]> = {};
  for (const card of cards) {
    (byStatus[card.status] ??= []).push(card);
  }

  const ordered = orderColumns(byStatus, manifest, config);

  const columns = {
    considering: ordered.considering,
    'in-progress': ordered['in-progress'],
    backlog: ordered.backlog,
    parked: ordered.parked,
    shipped: config.shipped.enabled ? ordered.shipped : [],
  } as Record<Status, Card[]>;

  const health = buildHealthSummary(cards, rawIssues, config, now);

  return {
    generatedAt: new Date(now).toISOString(),
    columns,
    health,
  };
}
