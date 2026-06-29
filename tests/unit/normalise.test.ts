import { describe, it, expect } from 'vitest';
import {
  normaliseIssue,
  resolveStatus,
  isEligible,
} from '../../src/lib/normalise';
import { getVoteCount } from '../../src/lib/votes';
import { loadConfig, loadIssues } from '../helpers';
import type { RawIssue } from '../../src/lib/types';

const config = loadConfig();
const issues = loadIssues();

function issue(n: number): RawIssue {
  return issues.find((i) => i.number === n)!;
}

describe('label to status mapping', () => {
  it('maps each status label to its status', () => {
    expect(resolveStatus(issue(21), config).status).toBe('considering');
    expect(resolveStatus(issue(12), config).status).toBe('in-progress');
    expect(resolveStatus(issue(14), config).status).toBe('backlog');
    expect(resolveStatus(issue(7), config).status).toBe('parked');
    expect(resolveStatus(issue(30), config).status).toBe('shipped');
  });

  it('returns null when there is no status label', () => {
    expect(resolveStatus(issue(33), config).status).toBeNull();
  });

  it('flags multiple status labels and picks the first by priority', () => {
    const variant: RawIssue = {
      ...issue(14),
      labels: [{ name: 'status: backlog' }, { name: 'status: considering' }],
    };
    const result = resolveStatus(variant, config);
    expect(result.status).toBe('considering');
    expect(result.flags).toContain('multiple-status');
  });
});

describe('AC-REQ-06 curation gate excludes untriaged', () => {
  it('an issue with needs-triage and no status is not eligible', () => {
    expect(isEligible(issue(33), config)).toBe(false);
  });
});

describe('summary and rationale extraction', () => {
  it('extracts the first paragraph under each language heading', () => {
    const card = normaliseIssue(issue(12), config);
    expect(card.summary.en).toBe(
      'Let clinic staff sign in once with their NHS Wales account, instead of a separate password for this service.',
    );
    expect(card.summary.cy.startsWith('Gadewch i staff clinig')).toBe(true);
  });

  it('extracts a parked decision into rationale', () => {
    const card = normaliseIssue(issue(7), config);
    expect(card.rationale?.en.startsWith('The website already works')).toBe(true);
  });

  it('derives tags excluding status and workflow labels', () => {
    const card = normaliseIssue(issue(14), config);
    expect(card.tags).toContain('type: reminders');
    expect(card.tags).toContain('cymraeg');
    expect(card.tags).not.toContain('status: backlog');
  });
});

describe('AC-VOTE-01 vote count read', () => {
  it('reads the +1 reaction count and ignores other reactions', () => {
    expect(normaliseIssue(issue(14), config).votes).toBe(41);
    expect(normaliseIssue(issue(21), config).votes).toBe(34);
    expect(normaliseIssue(issue(19), config).votes).toBe(8);
  });
});

describe('AC-VOTE-05 votes read through a single abstraction', () => {
  it('getVoteCount is the seam used for vote counts', () => {
    const card = normaliseIssue(issue(14), config);
    expect(getVoteCount(card)).toBe(card.votes);
    expect(getVoteCount({ votes: 7 })).toBe(7);
    expect(getVoteCount({ votes: undefined as unknown as number })).toBe(0);
  });
});
