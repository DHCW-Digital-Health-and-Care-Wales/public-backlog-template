import type { Lang } from './types';

export interface Config {
  team: { name: string; organisation: { en: string; cy: string } };
  github: { owner: string; repo: string; featureTemplate: string };
  branding: { primary: string; primaryDark: string };
  language: { default: Lang; available: Lang[] };
  labels: {
    status: {
      considering: string;
      inProgress: string;
      backlog: string;
      parked: string;
      shipped: string;
    };
    needsTriage: string;
  };
  backlog: { sort: 'curated' | 'votes'; manifest: string };
  shipped: { enabled: boolean; limit: number };
  health: { inProgressStaleDays: number; snapshotStaleHours: number };
  data: { mode: 'snapshot' | 'client'; snapshotPath: string };
}
