import type { AppConfig } from './types';

/**
 * Build the "suggest a feature" new-issue URL from config (AC-REQ-03/04).
 * When owner or repo are unset (a fresh fork) it falls back to a generic
 * new-issue URL and callers should surface a configuration notice.
 */
export function newIssueUrl(config: AppConfig): {
  url: string;
  configured: boolean;
} {
  const { owner, repo, featureTemplate } = config.github;
  const configured = Boolean(owner) && Boolean(repo);
  if (!configured) {
    const base =
      owner && !repo
        ? `https://github.com/${owner}`
        : 'https://github.com';
    return { url: `${base}/issues/new`, configured: false };
  }
  const template = encodeURIComponent(featureTemplate || 'feature_request.yml');
  return {
    url: `https://github.com/${owner}/${repo}/issues/new?template=${template}`,
    configured: true,
  };
}

export function repoIssuesUrl(config: AppConfig): string {
  const { owner, repo } = config.github;
  if (!owner || !repo) return 'https://github.com';
  return `https://github.com/${owner}/${repo}/issues`;
}
