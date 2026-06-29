export type Lang = 'en' | 'cy';

export type Status = 'considering' | 'in-progress' | 'backlog' | 'parked' | 'shipped';

export interface Localised {
  en: string;
  cy: string;
}

export interface Card {
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
  flags: string[];
}

export interface HealthSummary {
  staleInProgress: number;
  untriaged: number;
  oldestUntriagedAgeDays: number | null;
  contentErrors: number;
}

export interface Snapshot {
  generatedAt: string;
  columns: {
    considering: Card[];
    'in-progress': Card[];
    backlog: Card[];
    parked: Card[];
    shipped: Card[];
  };
  health: HealthSummary;
}

export interface GithubIssue {
  number: number;
  html_url: string;
  title: string;
  state: 'open' | 'closed';
  state_reason: string | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  pull_request?: unknown;
  labels: Array<{ name: string }>;
  reactions?: Record<string, number>;
  body: string;
}
