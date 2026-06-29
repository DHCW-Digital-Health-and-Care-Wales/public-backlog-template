/**
 * Build-time data pipeline (specs/07). Turns GitHub issues into the static
 * snapshot the site renders. Runs offline against fixtures/issues.sample.json
 * (default and in CI tests) or against the live GitHub API when a token is
 * present. Never writes a partial snapshot over a good one.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { buildSnapshot } from '../src/lib/snapshot';
import type { AppConfig, RawIssue, Snapshot } from '../src/lib/types';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const OUTPUT = resolve(root, 'src/data/backlog.generated.json');

function loadConfig(): AppConfig {
  return JSON.parse(readFileSync(resolve(root, 'config.json'), 'utf8')) as AppConfig;
}

function loadManifest(config: AppConfig): number[] {
  try {
    const raw = readFileSync(resolve(root, config.backlog.manifest), 'utf8');
    const parsed = parseYaml(raw) as { order?: number[] } | null;
    return parsed?.order ?? [];
  } catch {
    return [];
  }
}

function loadFixtureIssues(): RawIssue[] {
  const raw = readFileSync(
    resolve(root, 'fixtures/issues.sample.json'),
    'utf8',
  );
  return JSON.parse(raw) as RawIssue[];
}

async function fetchIssuesFromApi(config: AppConfig): Promise<RawIssue[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GITHUB_TOKEN is required for live API mode');
  }
  const { owner, repo } = config.github;
  const issues: RawIssue[] = [];
  let page = 1;
  // Page through all results; exclude pull requests downstream.
  for (;;) {
    const url = `https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=100&page=${page}`;
    const authValue = 'Bearer ' + token;
    const res = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: authValue,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    if (!res.ok) {
      throw new Error(`GitHub API error ${res.status}: ${await res.text()}`);
    }
    const batch = (await res.json()) as RawIssue[];
    issues.push(...batch);
    if (batch.length < 100) break;
    page += 1;
  }
  return issues;
}

function referenceNow(): number {
  const override = process.env.BUILD_NOW;
  if (override) {
    const parsed = Date.parse(override);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return Date.now();
}

function writeSnapshot(snapshot: Snapshot): void {
  const json = JSON.stringify(snapshot, null, 2) + '\n';
  // Bundled copy (imported for SSR, pre-render and the no-JS baseline).
  mkdirSync(dirname(OUTPUT), { recursive: true });
  writeFileSync(OUTPUT, json, 'utf8');
  // Served copy: a same-origin static file the client can re-read for
  // freshness without any third-party request (specs/07).
  const served = resolve(root, 'public/backlog.json');
  mkdirSync(dirname(served), { recursive: true });
  writeFileSync(served, json, 'utf8');
}

export async function run(useFixture: boolean): Promise<Snapshot> {
  const config = loadConfig();
  const manifest = loadManifest(config);
  const now = referenceNow();

  const issues =
    useFixture || config.data.mode === 'client'
      ? loadFixtureIssues()
      : await fetchIssuesFromApi(config);

  if (!Array.isArray(issues) || issues.length === 0) {
    // Resilience: never overwrite the last good snapshot with empty data.
    throw new Error('No issues returned; refusing to overwrite snapshot');
  }

  const snapshot = buildSnapshot(issues, config, manifest, now);
  return snapshot;
}

const isFixture =
  process.argv.includes('--fixture') || !process.env.GITHUB_TOKEN;

run(isFixture)
  .then((snapshot) => {
    writeSnapshot(snapshot);
    const total = Object.values(snapshot.columns).reduce(
      (n, cards) => n + cards.length,
      0,
    );
    // eslint-disable-next-line no-console
    console.log(
      `Wrote snapshot with ${total} cards. Health: ` +
        `${snapshot.health.staleInProgress} stale in-progress, ` +
        `${snapshot.health.untriaged} untriaged ` +
        `(oldest ${snapshot.health.oldestUntriagedDays ?? 0} days), ` +
        `${snapshot.health.contentErrors} content errors.`,
    );
  })
  .catch((err) => {
    // Fail loudly so the Action fails and the previous snapshot stays live.
    // eslint-disable-next-line no-console
    console.error('Snapshot build failed:', err);
    process.exit(1);
  });
