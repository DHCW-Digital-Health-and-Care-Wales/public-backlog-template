import type {
  AppConfig,
  Card,
  ContentFlag,
  Localised,
  RawIssue,
  RawLabel,
  Status,
} from './types';

// Order in which a status label wins when more than one is present.
const STATUS_PRIORITY: Status[] = [
  'considering',
  'in-progress',
  'backlog',
  'parked',
  'shipped',
];

export function labelName(label: RawLabel): string {
  return typeof label === 'string' ? label : label.name;
}

export function labelNames(issue: RawIssue): string[] {
  return (issue.labels ?? []).map(labelName);
}

function statusLabelMap(config: AppConfig): Map<string, Status> {
  const s = config.labels.status;
  return new Map<string, Status>([
    [s.considering, 'considering'],
    [s.inProgress, 'in-progress'],
    [s.backlog, 'backlog'],
    [s.parked, 'parked'],
    [s.shipped, 'shipped'],
  ]);
}

export function isPullRequest(issue: RawIssue): boolean {
  return issue.pull_request != null;
}

/**
 * Determine the status of an issue from its labels. Returns null when the
 * issue carries no status label (the curation gate, ADR-006). When more than
 * one status label is present, the first by STATUS_PRIORITY wins and a
 * `multiple-status` flag is reported.
 */
export function resolveStatus(
  issue: RawIssue,
  config: AppConfig,
): { status: Status | null; flags: ContentFlag[] } {
  const map = statusLabelMap(config);
  const names = labelNames(issue);
  const matched = names
    .map((n) => map.get(n))
    .filter((s): s is Status => Boolean(s));
  const unique = STATUS_PRIORITY.filter((s) => matched.includes(s));
  if (unique.length === 0) return { status: null, flags: [] };
  const flags: ContentFlag[] = unique.length > 1 ? ['multiple-status'] : [];
  return { status: unique[0], flags };
}

/**
 * The curation gate: which issues are eligible for the public board.
 * Pull requests are excluded. Closed issues appear only when they are
 * `status: shipped` and completed.
 */
export function isEligible(issue: RawIssue, config: AppConfig): boolean {
  if (isPullRequest(issue)) return false;
  const { status } = resolveStatus(issue, config);
  if (!status) return false;
  if (issue.state === 'closed') {
    return status === 'shipped' && issue.state_reason === 'completed';
  }
  // Open issues: every status except shipped (shipped lives on closed issues).
  return status !== 'shipped';
}

const HEADINGS: Record<'en' | 'cy', RegExp> = {
  en: /^##\s+english\s*$/i,
  cy: /^##\s+cymraeg\s*$/i,
};

const DECISION_HEADINGS: Record<'en' | 'cy', RegExp> = {
  en: /^##\s+decision\s*$/i,
  cy: /^##\s+penderfyniad\s*$/i,
};

type Section = { heading: string; body: string };

function splitSections(body: string): Section[] {
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const sections: Section[] = [];
  let current: Section | null = null;
  for (const line of lines) {
    if (/^##\s+/.test(line)) {
      if (current) sections.push(current);
      current = { heading: line.trim(), body: '' };
    } else if (current) {
      current.body += line + '\n';
    }
  }
  if (current) sections.push(current);
  return sections;
}

function firstParagraph(text: string): string {
  const blocks = text
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);
  return blocks[0] ?? '';
}

function sectionParagraph(
  sections: Section[],
  matcher: RegExp,
): string | null {
  const found = sections.find((s) => matcher.test(s.heading));
  if (!found) return null;
  const para = firstParagraph(found.body);
  return para.length > 0 ? para : null;
}

/**
 * Extract a bilingual value from issue body sections, following the
 * convention in specs/03. Returns the localised value plus any
 * missing-language flags. When a language is missing the present language is
 * reused as a fallback (Welsh is never silently dropped).
 */
function extractBilingual(
  sections: Section[],
  headings: Record<'en' | 'cy', RegExp>,
): { value: Localised | null; flags: ContentFlag[] } {
  const en = sectionParagraph(sections, headings.en);
  const cy = sectionParagraph(sections, headings.cy);
  if (en == null && cy == null) {
    return { value: null, flags: [] };
  }
  const flags: ContentFlag[] = [];
  let enVal = en;
  let cyVal = cy;
  if (en == null) {
    flags.push('missing-english');
    // Leave English empty so the renderer falls back to Welsh and marks the
    // text with the language actually shown (specs/08 language-of-parts).
    enVal = '';
  }
  if (cy == null) {
    flags.push('missing-welsh');
    cyVal = '';
  }
  return { value: { en: enVal as string, cy: cyVal as string }, flags };
}

function deriveTags(issue: RawIssue, config: AppConfig): string[] {
  const statusValues = new Set(Object.values(config.labels.status));
  const workflow = new Set([config.labels.needsTriage, 'enhancement']);
  return labelNames(issue).filter(
    (n) => !statusValues.has(n) && !workflow.has(n),
  );
}

/**
 * Normalise a single eligible issue into the card model (specs/03).
 * Staleness is computed separately in the snapshot step.
 */
export function normaliseIssue(issue: RawIssue, config: AppConfig): Card {
  const { status, flags: statusFlags } = resolveStatus(issue, config);
  if (!status) {
    throw new Error(`Issue #${issue.number} has no status label`);
  }

  const body = issue.body ?? '';
  const sections = splitSections(body);

  // Title is single-line and typically authored in one language; store it
  // under both languages and reuse for the other (specs/03 known limitation).
  const title: Localised = { en: issue.title, cy: issue.title };

  const flags: ContentFlag[] = [...statusFlags];

  const summaryResult = extractBilingual(sections, HEADINGS);
  let summary: Localised;
  if (summaryResult.value) {
    summary = summaryResult.value;
    flags.push(...summaryResult.flags);
  } else {
    // No language headings at all: fall back to the first paragraph of the
    // raw body for English and flag the missing Welsh.
    const fallback = firstParagraph(body) || issue.title;
    summary = { en: fallback, cy: '' };
    flags.push('missing-welsh');
  }

  const card: Card = {
    number: issue.number,
    url: issue.html_url,
    status,
    title,
    summary,
    tags: deriveTags(issue, config),
    votes: issue.reactions?.['+1'] ?? 0,
    createdAt: issue.created_at,
    updatedAt: issue.updated_at,
    shippedAt: status === 'shipped' ? issue.closed_at : null,
    flags,
  };

  if (status === 'parked') {
    const rationale = extractBilingual(sections, DECISION_HEADINGS);
    if (rationale.value) {
      card.rationale = rationale.value;
      flags.push(...rationale.flags);
    } else {
      flags.push('parked-without-rationale');
    }
  }

  return card;
}
