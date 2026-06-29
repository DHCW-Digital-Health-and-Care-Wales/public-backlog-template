import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';
import type { AppConfig, RawIssue } from '../src/lib/types';

const root = resolve(__dirname, '..');

export const REFERENCE_NOW = Date.parse('2026-06-29T12:00:00Z');

export function loadConfig(): AppConfig {
  return JSON.parse(
    readFileSync(resolve(root, 'config.json'), 'utf8'),
  ) as AppConfig;
}

export function loadIssues(): RawIssue[] {
  return JSON.parse(
    readFileSync(resolve(root, 'fixtures/issues.sample.json'), 'utf8'),
  ) as RawIssue[];
}

export function loadManifest(): number[] {
  const raw = readFileSync(resolve(root, 'data/backlog-order.yml'), 'utf8');
  const parsed = parseYaml(raw) as { order?: number[] };
  return parsed.order ?? [];
}
