import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LanguageProvider } from '../../src/components/LanguageProvider';
import { BacklogCard } from '../../src/components/BacklogCard';
import { Column } from '../../src/components/Column';
import type { Card } from '../../src/lib/types';

function make(over: Partial<Card>): Card {
  return {
    number: 1,
    url: 'https://github.com/o/r/issues/1',
    status: 'considering',
    title: { en: 'A title', cy: 'Teitl' },
    summary: { en: 'An English summary', cy: 'Crynodeb Cymraeg' },
    tags: ['type: reminders'],
    votes: 41,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    shippedAt: null,
    flags: [],
    ...over,
  };
}
const wrap = (c: Card) => render(<LanguageProvider initial="en"><BacklogCard card={c} /></LanguageProvider>);

describe('AC-BOARD-06 card content', () => {
  it('shows title, summary, tag pill, vote count', () => {
    wrap(make({}));
    expect(screen.getByText('A title')).toBeInTheDocument();
    expect(screen.getByText('An English summary')).toBeInTheDocument();
    expect(screen.getByText('type: reminders')).toBeInTheDocument();
    expect(screen.getByText(/41/)).toBeInTheDocument();
  });
  it('parked without rationale shows content-error state', () => {
    wrap(make({ status: 'parked', flags: ['parked-without-rationale'] }));
    expect(screen.getByText(/No rationale recorded/)).toBeInTheDocument();
  });
});

describe('AC-VOTE-02/04 vote control', () => {
  it('interactive on considering, read-only on in-progress', () => {
    const { unmount } = wrap(make({ status: 'considering' }));
    expect(screen.getByRole('link', { name: /Upvote on GitHub/ })).toHaveAttribute('href', 'https://github.com/o/r/issues/1');
    unmount();
    wrap(make({ status: 'in-progress' }));
    expect(screen.queryByRole('link', { name: /Upvote on GitHub/ })).toBeNull();
  });
});

describe('AC-BOARD-11/13 empty + stale', () => {
  it('empty column renders empty state', () => {
    render(<LanguageProvider initial="en"><Column status="backlog" cards={[]} /></LanguageProvider>);
    expect(screen.getByText(/Nothing here/)).toBeInTheDocument();
  });
  it('stale shows last updated', () => {
    wrap(make({ status: 'in-progress', flags: ['stale'] }));
    expect(screen.getByText(/Last updated/)).toBeInTheDocument();
  });
});

describe('AC-NFR-03 lang of parts', () => {
  it('available language shown with lang attr and translation note when missing', () => {
    render(<LanguageProvider initial="en"><BacklogCard card={make({ summary: { en: '', cy: 'Crynodeb Cymraeg' }, flags: ['missing-english'] })} /></LanguageProvider>);
    expect(screen.getByText('Crynodeb Cymraeg')).toHaveAttribute('lang', 'cy');
    expect(screen.getByText(/Welsh translation pending/)).toBeInTheDocument();
  });
});
