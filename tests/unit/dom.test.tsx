import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import { LanguageProvider } from '../../src/lib/i18n';
import { BacklogCard } from '../../src/components/BacklogCard';
import { Column } from '../../src/components/Column';
import { LanguageToggle } from '../../src/components/LanguageToggle';
import { buildSnapshot } from '../../src/lib/snapshot';
import { normaliseIssue } from '../../src/lib/normalise';
import { loadConfig, loadIssues, loadManifest, REFERENCE_NOW } from '../helpers';
import type { Card, Language } from '../../src/lib/types';

const config = loadConfig();
const issues = loadIssues();
const manifest = loadManifest();
const snap = buildSnapshot(issues, config, manifest, REFERENCE_NOW);

function card(status: keyof typeof snap.columns, number: number): Card {
  return snap.columns[status].find((c) => c.number === number)!;
}

function renderWith(node: ReactNode, lang: Language = 'en') {
  return render(
    <LanguageProvider initialLanguage={lang}>{node}</LanguageProvider>,
  );
}

afterEach(() => {
  cleanup();
  window.history.replaceState({}, '', '/');
});

describe('AC-BOARD-06 card contents', () => {
  it('shows title, summary, tags and a vote count', () => {
    renderWith(<BacklogCard card={card('backlog', 14)} />);
    expect(
      screen.getByText('Welsh-language SMS reminders by default'),
    ).toBeInTheDocument();
    expect(screen.getByText(/Send reminders in a person/)).toBeInTheDocument();
    expect(screen.getByText('type: reminders')).toBeInTheDocument();
    expect(screen.getByText('41')).toBeInTheDocument();
  });

  it('shows a rationale for parked cards', () => {
    renderWith(<BacklogCard card={card('parked', 7)} />);
    expect(screen.getByText(/website already works well/)).toBeInTheDocument();
  });

  it('renders a content-error state for a parked card without a rationale', () => {
    const variant = normaliseIssue(
      {
        ...issues.find((i) => i.number === 7)!,
        number: 91,
        body: '## English\n\nNo decision here.\n\n## Cymraeg\n\nDim penderfyniad.',
      },
      config,
    );
    renderWith(<BacklogCard card={variant} />);
    expect(screen.getByTestId('rationale-missing')).toBeInTheDocument();
  });
});

describe('AC-BOARD-11 empty column', () => {
  it('renders a plain-language empty state', () => {
    renderWith(
      <Column
        status="backlog"
        titleKey="col_backlog_title"
        descKey="col_backlog_desc"
        cards={[]}
        headingId="c"
      />,
    );
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });
});

describe('AC-BOARD-13 stale indicator', () => {
  it('shows a last-updated indicator for a stale in-progress item', () => {
    renderWith(<BacklogCard card={card('in-progress', 9)} />);
    expect(screen.getByTestId('stale-indicator')).toBeInTheDocument();
  });

  it('does not show the indicator for a fresh in-progress item', () => {
    renderWith(<BacklogCard card={card('in-progress', 12)} />);
    expect(screen.queryByTestId('stale-indicator')).not.toBeInTheDocument();
  });
});

describe('AC-VOTE-02 interactive vs read-only controls', () => {
  it('renders an interactive control for backlog cards', () => {
    renderWith(<BacklogCard card={card('backlog', 14)} />);
    expect(screen.getByTestId('vote-control')).toBeInTheDocument();
    expect(screen.queryByTestId('vote-readonly')).not.toBeInTheDocument();
  });

  it('renders a read-only count for in-progress cards', () => {
    renderWith(<BacklogCard card={card('in-progress', 12)} />);
    expect(screen.getByTestId('vote-readonly')).toBeInTheDocument();
    expect(screen.queryByTestId('vote-control')).not.toBeInTheDocument();
  });

  it('renders a read-only count for shipped cards', () => {
    renderWith(<BacklogCard card={card('shipped', 30)} />);
    expect(screen.getByTestId('vote-readonly')).toBeInTheDocument();
  });
});

describe('AC-VOTE-04 accessible upvote name and helper', () => {
  it('has an accessible name conveying the action and that it opens GitHub', () => {
    renderWith(<BacklogCard card={card('backlog', 14)} />);
    const link = screen.getByTestId('vote-control');
    expect(link.getAttribute('aria-label')).toMatch(/GitHub/);
    expect(link.getAttribute('aria-label')).toMatch(/support/i);
    const describedBy = link.getAttribute('aria-describedby')!;
    expect(document.getElementById(describedBy)?.textContent).toMatch(
      /GitHub account/,
    );
  });

  it('announces the count meaningfully for read-only cards', () => {
    renderWith(<BacklogCard card={card('in-progress', 12)} />);
    expect(screen.getByText('12 people support this')).toBeInTheDocument();
  });
});

describe('AC-NFR-03 language of parts and toggle', () => {
  it('marks Welsh and English content with the correct lang attribute', () => {
    const { container } = renderWith(
      <BacklogCard card={card('backlog', 14)} />,
      'cy',
    );
    const summary = container.querySelector('p[lang="cy"]');
    expect(summary).not.toBeNull();
  });

  it('falls back and marks the actual language when a translation is missing', () => {
    // #25 is missing Welsh; in Welsh mode the English text is shown with lang="en".
    const { container } = renderWith(
      <BacklogCard card={card('considering', 25)} />,
      'cy',
    );
    expect(screen.getByTestId('translation-pending')).toBeInTheDocument();
    expect(container.querySelector('p[lang="en"]')).not.toBeNull();
  });

  it('the language toggle updates interface strings and the URL', () => {
    renderWith(<LanguageToggle />);
    const cy = screen.getByRole('button', { name: 'Cymraeg' });
    fireEvent.click(cy);
    expect(cy).toHaveAttribute('aria-pressed', 'true');
    expect(window.location.search).toContain('lang=cy');
  });
});

describe('AC-NFR-04 status and column identity in text', () => {
  it('column identity is conveyed by a text heading', () => {
    renderWith(
      <Column
        status="parked"
        titleKey="col_parked_title"
        descKey="col_parked_desc"
        cards={[card('parked', 7)]}
        headingId="c"
      />,
    );
    const region = screen.getByTestId('column');
    expect(
      within(region).getByText('Not being considered right now'),
    ).toBeInTheDocument();
  });
});
