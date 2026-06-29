/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import { parse as parseYaml } from 'yaml';
import { buildSnapshot } from '../src/lib/snapshot';
import type { Config } from '../src/lib/config';
import type { GithubIssue } from '../src/lib/types';

const root = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');

function loadConfig(): Config {
  return JSON.parse(fs.readFileSync(path.join(root, 'config.json'), 'utf8')) as Config;
}

function loadManifest(config: Config): number[] {
  const file = path.join(root, config.backlog.manifest);
  if (!fs.existsSync(file)) return [];
  const doc = parseYaml(fs.readFileSync(file, 'utf8')) as { order?: number[] };
  return Array.isArray(doc?.order) ? doc.order : [];
}

async function fetchIssues(config: Config, token: string): Promise<GithubIssue[]> {
  const { owner, repo } = config.github;
  const all: GithubIssue[] = [];
  for (let page = 1; page <= 20; page++) {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=100&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
    if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
    const batch = (await res.json()) as GithubIssue[];
    if (batch.length === 0) break;
    all.push(...batch);
  }
  return all.filter((i) => !i.pull_request);
}

async function main() {
  const useFixture = process.argv.includes('--fixture');
  const config = loadConfig();
  const manifest = loadManifest(config);
  let issues: GithubIssue[];
  if (useFixture) {
    issues = JSON.parse(fs.readFileSync(path.join(root, 'fixtures/issues.sample.json'), 'utf8'));
  } else {
    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error('GITHUB_TOKEN required for live build');
    issues = await fetchIssues(config, token);
  }
  const snapshot = buildSnapshot(issues, config, manifest);
  const outDir = path.join(root, 'public/data');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'backlog.json'), JSON.stringify(snapshot, null, 2));
  console.log(
    `Wrote backlog.json: ${Object.values(snapshot.columns).reduce((n, c) => n + c.length, 0)} cards, ` +
      `${snapshot.health.untriaged} untriaged, ${snapshot.health.staleInProgress} stale.`,
  );
}

main().catch((err) => {
  console.error('Build failed; last good snapshot left untouched.', err);
  process.exit(1);
});
