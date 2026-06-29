import type { Card, GithubIssue, HealthSummary, Snapshot } from './types';
import type { Config } from './config';
import { daysBetween, normaliseIssue } from './normalise';
import {
  orderBacklog,
  orderConsidering,
  orderInProgress,
  orderParked,
  orderShipped,
} from './ordering';

const CONTENT_ERROR_FLAGS = ['multiple-status', 'parked-without-rationale', 'missing-english'];

/** Build the full ordered snapshot from raw issues, config and manifest. */
export function buildSnapshot(
  issues: GithubIssue[],
  config: Config,
  manifest: number[],
  now: Date = new Date(),
): Snapshot {
  const cards: Card[] = [];
  for (const issue of issues) {
    const card = normaliseIssue(issue, config, now);
    if (card) cards.push(card);
  }
  const byStatus = (s: Card['status']) => cards.filter((c) => c.status === s);

  const considering = orderConsidering(byStatus('considering'));
  const inProgress = orderInProgress(byStatus('in-progress'));
  const backlog = orderBacklog(byStatus('backlog'), manifest, config.backlog.sort);
  const parked = orderParked(byStatus('parked'));
  const shipped = config.shipped.enabled
    ? orderShipped(byStatus('shipped'), config.shipped.limit)
    : [];

  const untriagedIssues = issues.filter(
    (i) =>
      !i.pull_request &&
      i.state === 'open' &&
      i.labels.some((l) => l.name === config.labels.needsTriage),
  );
  let oldest: number | null = null;
  for (const i of untriagedIssues) {
    const age = daysBetween(i.created_at, now.toISOString());
    if (oldest === null || age > oldest) oldest = age;
  }
  const health: HealthSummary = {
    staleInProgress: inProgress.filter((c) => c.flags.includes('stale')).length,
    untriaged: untriagedIssues.length,
    oldestUntriagedAgeDays: oldest,
    contentErrors: cards.filter((c) => c.flags.some((f) => CONTENT_ERROR_FLAGS.includes(f))).length,
  };

  return {
    generatedAt: now.toISOString(),
    columns: { considering, 'in-progress': inProgress, backlog, parked, shipped },
    health,
  };
}
