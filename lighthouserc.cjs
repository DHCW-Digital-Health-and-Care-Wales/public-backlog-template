/**
 * Lighthouse CI budgets (specs/08). Performance at least 95, accessibility 100
 * on the built, pre-rendered page. Runs against the static preview server.
 */
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      numberOfRuns: 3,
      settings: {
        // Desktop preset: stable, representative scoring for a static page,
        // without the noisy mobile CPU throttling of a shared CI container.
        preset: 'desktop',
        onlyCategories: ['performance', 'accessibility', 'best-practices'],
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['warn', { minScore: 0.95 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
