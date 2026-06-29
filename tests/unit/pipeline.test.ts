import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { buildSnapshot } from '../../src/lib/snapshot';
import { normaliseIssue, extractBody } from '../../src/lib/normalise';
import type { GithubIssue } from '../../src/lib/types';
import type { Config } from '../../src/lib/config';

const root = path.resolve(__dirname, '../..');
const config: Config = JSON.parse(fs.readFileSync(path.join(root, 'config.json'), 'utf8'));
const issues: GithubIssue[] = JSON.parse(
  fs.readFileSync(path.join(root, 'fixtures/issues.sample.json'), 'utf8'),
);
const manifest: number[] = (
  parseYaml(fs.readFileSync(path.join(root, 'data/backlog-order.yml'), 'utf8')) as { order: number[] }
).order;
const NOW = new Date('2026-06-29T00:00:00Z');

function snap(cfg = config) {
  return buildSnapshot(issues, cfg, manifest, NOW);
}

describe('AC-PIPE-01 curation gate', () => {
  it('excludes no-status and not-planned and pull requests', () => {
    const s = snap();
    const all = Object.values(s.columns).flat().map((c) => c.number);
    expect(all).not.toContain(33);
    expect(all).not.toContain(5);
    expect(all).not.toContain(88);
  });
});

describe('AC-PIPE-02 shipped only when completed', () => {
  it('#30 appears in shipped with shippedAt set', () => {
    const s = snap();
    const c = s.columns.shipped.find((x) => x.number === 30)!;
    expect(c.shippedAt).toBe('2026-05-30T09:00:00Z');
  });
});

describe('AC-PIPE-03 card schema', () => {
  it('#14 has bilingual title/summary, votes, timestamps', () => {
    const c = snap().columns.backlog.find((x) => x.number === 14)!;
    expect(c.title.en).toMatch(/Welsh-language/);
    expect(c.summary.cy).toMatch(/Anfon/);
    expect(c.votes).toBe(41);
    expect(c.createdAt).toBe('2026-04-15T10:00:00Z');
  });
});

describe('AC-PIPE-04 parked rationale', () => {
  it('#7 has rationale; missing decision flags it', () => {
    const c = snap().columns.parked.find((x) => x.number === 7)!;
    expect(c.rationale?.en).toMatch(/not building a native app/);
    const noDecision = { ...issues.find((i) => i.number === 7)!, body: '## English\nx\n## Cymraeg\ny' };
    const card = normaliseIssue(noDecision, config, NOW)!;
    expect(card.flags).toContain('parked-without-rationale');
  });
});

describe('AC-PIPE-05 missing language flags', () => {
  it('missing welsh / english', () => {
    expect(extractBody('## English\nonly english', false).flags).toContain('missing-welsh');
    expect(extractBody('## Cymraeg\ndim ond cymraeg', false).flags).toContain('missing-english');
  });
});

describe('AC-PIPE-06 ordering', () => {
  it('backlog curated then votes', () => {
    expect(snap().columns.backlog.map((c) => c.number)).toEqual([17, 14, 19]);
    expect(snap({ ...config, backlog: { ...config.backlog, sort: 'votes' } }).columns.backlog.map((c) => c.number)).toEqual([14, 17, 19]);
  });
});

describe('AC-PIPE-07 health summary', () => {
  it('generatedAt and counts present', () => {
    const s = snap();
    expect(s.generatedAt).toBeTruthy();
    expect(s.health.untriaged).toBe(1);
    expect(s.health.staleInProgress).toBe(1);
  });
});

describe('AC-PIPE-08 stale in-progress', () => {
  it('#9 is stale, #12 is not', () => {
    const s = snap();
    expect(s.columns['in-progress'].find((c) => c.number === 9)!.flags).toContain('stale');
    expect(s.columns['in-progress'].find((c) => c.number === 12)!.flags).not.toContain('stale');
  });
});
