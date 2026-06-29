import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { buildSnapshot } from '../../src/lib/snapshot';
import { readVotes } from '../../src/lib/votes';
import { newIssueUrl, isConfigured } from '../../src/lib/urls';
import type { GithubIssue } from '../../src/lib/types';
import type { Config } from '../../src/lib/config';

const root = path.resolve(__dirname, '../..');
const config: Config = JSON.parse(fs.readFileSync(path.join(root, 'config.json'), 'utf8'));
const issues: GithubIssue[] = JSON.parse(fs.readFileSync(path.join(root, 'fixtures/issues.sample.json'), 'utf8'));
const manifest: number[] = (parseYaml(fs.readFileSync(path.join(root, 'data/backlog-order.yml'), 'utf8')) as { order: number[] }).order;
const s = buildSnapshot(issues, config, manifest, new Date('2026-06-29T00:00:00Z'));

describe('AC-BOARD-05/AC-VOTE-06 ordering', () => {
  it('considering by votes desc, parked by votes desc, in-progress by updated', () => {
    expect(s.columns.considering.map((c) => c.number)).toEqual([21, 25]);
    expect(s.columns.parked.map((c) => c.number)).toEqual([7]);
    expect(s.columns['in-progress'].map((c) => c.number)).toEqual([12, 9]);
  });
});

describe('AC-VOTE-01/05 vote read', () => {
  it('reads +1 only', () => {
    expect(readVotes({ reactions: { '+1': 41, heart: 9 } })).toBe(41);
    expect(readVotes({ reactions: {} })).toBe(0);
    expect(s.columns.shipped[0].votes).toBe(19);
  });
});

describe('AC-REQ-03/04 url construction', () => {
  it('builds and falls back', () => {
    expect(newIssueUrl({ owner: 'a', repo: 'b', featureTemplate: 'feature_request.yml' })).toBe('https://github.com/a/b/issues/new?template=feature_request.yml');
    expect(newIssueUrl({ owner: 'ORG', repo: 'REPO', featureTemplate: 'feature_request.yml' })).toBe('https://github.com/issues/new');
    expect(isConfigured({ owner: '', repo: '', featureTemplate: 'x' })).toBe(false);
  });
});
