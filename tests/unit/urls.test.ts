import { describe, it, expect } from 'vitest';
import { newIssueUrl } from '../../src/lib/urls';
import { loadConfig } from '../helpers';
import type { AppConfig } from '../../src/lib/types';

const config = loadConfig();

describe('AC-REQ-03 new-issue URL construction', () => {
  it('builds the URL from configured owner, repo and template', () => {
    const { url, configured } = newIssueUrl(config);
    expect(configured).toBe(true);
    expect(url).toBe(
      `https://github.com/${config.github.owner}/${config.github.repo}/issues/new?template=feature_request.yml`,
    );
  });

  it('changing owner, repo or template changes the URL', () => {
    const custom: AppConfig = {
      ...config,
      github: { owner: 'acme', repo: 'service', featureTemplate: 'idea.yml' },
    };
    expect(newIssueUrl(custom).url).toBe(
      'https://github.com/acme/service/issues/new?template=idea.yml',
    );
  });

  it('URL-encodes the template name', () => {
    const custom: AppConfig = {
      ...config,
      github: { ...config.github, featureTemplate: 'feature request.yml' },
    };
    expect(newIssueUrl(custom).url).toContain('template=feature%20request.yml');
  });
});

describe('AC-REQ-04 fresh-fork fallback', () => {
  it('falls back to the generic new-issue URL and reports not configured', () => {
    const fresh: AppConfig = {
      ...config,
      github: { owner: '', repo: '', featureTemplate: 'feature_request.yml' },
    };
    const { url, configured } = newIssueUrl(fresh);
    expect(configured).toBe(false);
    expect(url).toBe('https://github.com/issues/new');
  });
});
