export interface UrlConfig {
  owner: string;
  repo: string;
  featureTemplate: string;
}

/**
 * Build the "suggest a feature" new-issue URL from config (AC-REQ-03, AC-REQ-04).
 * When owner or repo are unset (a fresh fork) fall back to the generic
 * new-issue page so the control still works.
 */
export function newIssueUrl(cfg: UrlConfig): string {
  const owner = (cfg.owner || '').trim();
  const repo = (cfg.repo || '').trim();
  if (!owner || repo === '' || owner.toUpperCase() === 'ORG' || repo.toUpperCase() === 'REPO') {
    return 'https://github.com/issues/new';
  }
  const template = encodeURIComponent(cfg.featureTemplate || 'feature_request.yml');
  return `https://github.com/${owner}/${repo}/issues/new?template=${template}`;
}

export function isConfigured(cfg: UrlConfig): boolean {
  const owner = (cfg.owner || '').trim();
  const repo = (cfg.repo || '').trim();
  return Boolean(owner && repo) && owner.toUpperCase() !== 'ORG' && repo.toUpperCase() !== 'REPO';
}
