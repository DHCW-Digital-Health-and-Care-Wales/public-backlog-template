import type { Card, GithubIssue, Localised, Status } from './types';
import type { Config } from './config';
import { readVotes } from './votes';

const STATUS_ORDER: Status[] = ['considering', 'in-progress', 'backlog', 'parked', 'shipped'];

function statusLabelMap(config: Config): Record<string, Status> {
  const s = config.labels.status;
  return {
    [s.considering]: 'considering',
    [s.inProgress]: 'in-progress',
    [s.backlog]: 'backlog',
    [s.parked]: 'parked',
    [s.shipped]: 'shipped',
  };
}

const STATUS_PREFIX = 'status:';

/**
 * Determine the public status from an issue's labels. Returns the first match
 * in canonical order and flags a conflict if more than one is present.
 */
export function statusFromLabels(
  labelNames: string[],
  config: Config,
): { status: Status | null; flags: string[] } {
  const map = statusLabelMap(config);
  const matched = labelNames.filter((n) => n in map).map((n) => map[n]);
  const unique = STATUS_ORDER.filter((s) => matched.includes(s));
  if (unique.length === 0) return { status: null, flags: [] };
  const flags = unique.length > 1 ? ['multiple-status'] : [];
  return { status: unique[0], flags };
}

/** A tag is any label that is not a status: label, needs-triage, or enhancement. */
export function extractTags(labelNames: string[], config: Config): string[] {
  const ignore = new Set([config.labels.needsTriage, 'enhancement']);
  return labelNames.filter(
    (n) => !ignore.has(n) && !n.toLowerCase().startsWith(STATUS_PREFIX),
  );
}

/** Extract the first paragraph beneath a given H2 heading. */
function firstParagraphUnder(body: string, headings: string[]): string | null {
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const wanted = headings.map((h) => h.toLowerCase());
  let i = 0;
  while (i < lines.length) {
    const m = /^##\s+(.+?)\s*$/.exec(lines[i]);
    if (m && wanted.includes(m[1].trim().toLowerCase())) {
      const para: string[] = [];
      i++;
      while (i < lines.length && !/^##\s+/.test(lines[i])) {
        if (lines[i].trim() === '') {
          if (para.length) break;
        } else {
          para.push(lines[i].trim());
        }
        i++;
      }
      const text = para.join(' ').trim();
      return text || null;
    }
    i++;
  }
  return null;
}

export interface ExtractedBody {
  summary: Localised;
  rationale: Localised | null;
  flags: string[];
}

export function extractBody(body: string, isParked: boolean): ExtractedBody {
  const en = firstParagraphUnder(body, ['English']);
  const cy = firstParagraphUnder(body, ['Cymraeg']);
  const flags: string[] = [];
  let summaryEn = en;
  let summaryCy = cy;
  if (!en && !cy) {
    summaryEn = body.trim().split('\n')[0] || '';
    summaryCy = summaryEn;
  } else if (!cy) {
    flags.push('missing-welsh');
    summaryCy = en;
  } else if (!en) {
    flags.push('missing-english');
    summaryEn = cy;
  }
  let rationale: Localised | null = null;
  if (isParked) {
    const dEn = firstParagraphUnder(body, ['Decision']);
    const dCy = firstParagraphUnder(body, ['Penderfyniad']);
    if (!dEn && !dCy) {
      flags.push('parked-without-rationale');
    } else {
      rationale = { en: dEn || dCy || '', cy: dCy || dEn || '' };
    }
  }
  return { summary: { en: summaryEn || '', cy: summaryCy || '' }, rationale, flags };
}

export function daysBetween(a: string, b: string): number {
  return Math.floor((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);
}

/**
 * Normalise a kept issue into a Card. Returns null for issues that must not
 * appear (no status label, or closed-not-completed without shipped status).
 */
export function normaliseIssue(
  issue: GithubIssue,
  config: Config,
  now: Date = new Date(),
): Card | null {
  if (issue.pull_request) return null;
  const labelNames = issue.labels.map((l) => l.name);
  const { status, flags: statusFlags } = statusFromLabels(labelNames, config);
  if (!status) return null;
  if (status === 'shipped') {
    if (issue.state !== 'closed' || issue.state_reason !== 'completed') return null;
  } else if (issue.state === 'closed') {
    return null;
  }
  const isParked = status === 'parked';
  const { summary, rationale, flags: bodyFlags } = extractBody(issue.body || '', isParked);
  const flags = [...statusFlags, ...bodyFlags];
  if (status === 'in-progress' && daysBetween(issue.updated_at, now.toISOString()) > config.health.inProgressStaleDays) {
    flags.push('stale');
  }
  const title: Localised = { en: issue.title, cy: issue.title };
  return {
    number: issue.number,
    url: issue.html_url,
    status,
    title,
    summary,
    ...(rationale ? { rationale } : {}),
    tags: extractTags(labelNames, config),
    votes: readVotes(issue),
    createdAt: issue.created_at,
    updatedAt: issue.updated_at,
    shippedAt: status === 'shipped' ? issue.closed_at : null,
    flags,
  };
}
