import { describe, it, expect } from 'vitest';
import { buildSnapshot } from '../../src/lib/snapshot';
import { normaliseIssue, isEligible } from '../../src/lib/normalise';
import { localise } from '../../src/lib/strings';
import { loadConfig, loadIssues, loadManifest, REFERENCE_NOW } from '../helpers';
import type { RawIssue } from '../../src/lib/types';

const config = loadConfig();
const issues = loadIssues();
const manifest = loadManifest();

function snapshot() {
  return buildSnapshot(issues, config, manifest, REFERENCE_NOW);
}

function allCards() {
  return Object.values(snapshot().columns).flat();
}

describe('AC-PIPE-01 curation gate', () => {
  it('outputs cards only for issues carrying a status label', () => {
    const numbers = allCards().map((c) => c.number);
    // #33 (needs-triage, no status) and #5 (closed, not planned) excluded.
    expect(numbers).not.toContain(33);
    expect(numbers).not.toContain(5);
  });

  it('excludes pull requests even when they carry a status label', () => {
    expect(allCards().map((c) => c.number)).not.toContain(40);
  });
});

describe('AC-PIPE-02 shipped closed issue', () => {
  it('#30 appears only in the shipped set with shippedAt from closed date', () => {
    const snap = snapshot();
    const shipped = snap.columns.shipped.map((c) => c.number);
    expect(shipped).toContain(30);
    const inOthers = [
      ...snap.columns.considering,
      ...snap.columns['in-progress'],
      ...snap.columns.backlog,
      ...snap.columns.parked,
    ].map((c) => c.number);
    expect(inOthers).not.toContain(30);
    const card = snap.columns.shipped.find((c) => c.number === 30)!;
    expect(card.shippedAt).toBe('2026-05-15T10:00:00Z');
  });
});

describe('AC-PIPE-03 card model schema', () => {
  it('each card matches the card model with bilingual fields and timestamps', () => {
    for (const card of allCards()) {
      expect(typeof card.number).toBe('number');
      expect(card.url).toMatch(/github\.com/);
      expect(['considering', 'in-progress', 'backlog', 'parked', 'shipped']).toContain(
        card.status,
      );
      expect(typeof card.title.en).toBe('string');
      expect(typeof card.title.cy).toBe('string');
      expect(typeof card.summary.en).toBe('string');
      expect(typeof card.summary.cy).toBe('string');
      expect(typeof card.votes).toBe('number');
      expect(card.createdAt).toBeTruthy();
      expect(card.updatedAt).toBeTruthy();
      expect(Array.isArray(card.tags)).toBe(true);
      expect(Array.isArray(card.flags)).toBe(true);
    }
  });
});

describe('AC-PIPE-04 parked rationale', () => {
  it('#7 produces a populated bilingual rationale', () => {
    const card = snapshot().columns.parked.find((c) => c.number === 7)!;
    expect(card.rationale?.en).toContain('website already works well');
    expect(card.rationale?.cy).toContain('wefan eisoes');
    expect(card.flags).not.toContain('parked-without-rationale');
  });

  it('a parked issue with no decision section is flagged', () => {
    const variant: RawIssue = {
      ...issues.find((i) => i.number === 7)!,
      number: 99,
      body: '## English\n\nNo decision section here.\n\n## Cymraeg\n\nDim adran benderfyniad yma.',
    };
    const card = normaliseIssue(variant, config);
    expect(card.rationale).toBeUndefined();
    expect(card.flags).toContain('parked-without-rationale');
  });
});

describe('AC-PIPE-05 missing language flags and fallback', () => {
  it('missing Cymraeg falls back to English and flags missing-welsh', () => {
    const variant: RawIssue = {
      ...issues.find((i) => i.number === 21)!,
      number: 101,
      body: '## English\n\nEnglish only summary.',
    };
    const card = normaliseIssue(variant, config);
    expect(card.flags).toContain('missing-welsh');
    // Welsh is left empty; the renderer falls back to English via localise.
    expect(card.summary.cy).toBe('');
    expect(card.summary.en).toBe('English only summary.');
    expect(localise(card.summary, 'cy')).toBe('English only summary.');
  });

  it('missing English falls back to Welsh and flags missing-english', () => {
    const variant: RawIssue = {
      ...issues.find((i) => i.number === 21)!,
      number: 102,
      body: '## Cymraeg\n\nCrynodeb Cymraeg yn unig.',
    };
    const card = normaliseIssue(variant, config);
    expect(card.flags).toContain('missing-english');
    expect(card.summary.en).toBe('');
    expect(localise(card.summary, 'en')).toBe('Crynodeb Cymraeg yn unig.');
  });
});

describe('AC-PIPE-07 generatedAt and health summary', () => {
  it('includes a generatedAt timestamp and a health summary', () => {
    const snap = snapshot();
    expect(snap.generatedAt).toBe(new Date(REFERENCE_NOW).toISOString());
    expect(snap.health.staleInProgress).toBe(1);
    expect(snap.health.untriaged).toBe(1);
    expect(snap.health.oldestUntriagedDays).toBeGreaterThanOrEqual(0);
    expect(snap.health.contentErrors).toBeGreaterThanOrEqual(1);
  });
});

describe('AC-PIPE-08 in-progress staleness', () => {
  it('#9 (not updated for months) is marked stale, #12 is not', () => {
    const snap = snapshot();
    const nine = snap.columns['in-progress'].find((c) => c.number === 9)!;
    const twelve = snap.columns['in-progress'].find((c) => c.number === 12)!;
    expect(nine.flags).toContain('stale-in-progress');
    expect(twelve.flags).not.toContain('stale-in-progress');
  });
});

describe('AC-PIPE-10 no secret material in snapshot', () => {
  it('the serialised snapshot contains no token-like material', () => {
    const serialised = JSON.stringify(snapshot()).toLowerCase();
    expect(serialised).not.toContain('ghp_');
    expect(serialised).not.toContain('github_token');
    expect(serialised).not.toContain('authorization');
  });
});

describe('AC-PIPE-11 offline build', () => {
  it('builds successfully from the fixture with no network access', () => {
    // buildSnapshot is pure and performs no IO; the fixture is the only input.
    expect(issues.filter((i) => isEligible(i, config)).length).toBeGreaterThan(0);
    expect(() => snapshot()).not.toThrow();
  });
});
