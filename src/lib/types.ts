// Shared domain types for the public backlog.
// The card model is the contract between the build pipeline (specs/07)
// and the renderer (specs/04); see specs/03 for the authoritative shape.

export type Language = 'en' | 'cy';

export type Localised = {
  en: string;
  cy: string;
};

export type Status =
  | 'considering'
  | 'in-progress'
  | 'backlog'
  | 'parked'
  | 'shipped';

export type ContentFlag =
  | 'multiple-status'
  | 'parked-without-rationale'
  | 'missing-welsh'
  | 'missing-english'
  | 'stale-in-progress';

export type Card = {
  number: number;
  url: string;
  status: Status;
  title: Localised;
  summary: Localised;
  rationale?: Localised;
  tags: string[];
  votes: number;
  createdAt: string;
  updatedAt: string;
  shippedAt: string | null;
  flags: ContentFlag[];
};

export type ColumnId = Status;

export type HealthSummary = {
  staleInProgress: number;
  untriaged: number;
  oldestUntriagedDays: number | null;
  contentErrors: number;
  flags: { number: number; flags: ContentFlag[] }[];
};

export type Snapshot = {
  generatedAt: string;
  columns: Record<ColumnId, Card[]>;
  health: HealthSummary;
};

// A subset of the GitHub Issues REST payload that the pipeline relies on.
export type RawLabel = { name: string } | string;

export type RawIssue = {
  number: number;
  title: string;
  html_url: string;
  state: 'open' | 'closed';
  state_reason: 'completed' | 'not_planned' | 'reopened' | null;
  labels: RawLabel[];
  reactions?: Record<string, number> & { '+1'?: number };
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  body: string | null;
  pull_request?: unknown;
};

export type AppConfig = {
  team: {
    name: string;
    organisation: Localised;
  };
  github: {
    owner: string;
    repo: string;
    featureTemplate: string;
  };
  branding: {
    primary: string;
    primaryDark: string;
  };
  language: {
    default: Language;
    available: Language[];
  };
  labels: {
    status: Record<
      'considering' | 'inProgress' | 'backlog' | 'parked' | 'shipped',
      string
    >;
    needsTriage: string;
  };
  backlog: {
    sort: 'curated' | 'votes';
    manifest: string;
  };
  shipped: {
    enabled: boolean;
    limit: number;
  };
  health: {
    inProgressStaleDays: number;
    freshnessWindowHours: number;
  };
  data: {
    mode: 'snapshot' | 'client';
    snapshotPath: string;
  };
};
