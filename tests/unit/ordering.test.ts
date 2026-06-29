import { describe, it, expect } from 'vitest';
import {
  orderConsidering,
  orderInProgress,
  orderParked,
  orderShipped,
  orderBacklog,
} from '../../src/lib/ordering';
import { buildSnapshot } from '../../src/lib/snapshot';
import { loadConfig, loadIssues, loadManifest, REFERENCE_NOW } from '../helpers';
import type { Card } from '../../src/lib/types';

const config = loadConfig();
const issues = loadIssues();
const manifest = loadManifest();

function snap(sort: 'curated' | 'votes' = 'curated') {
  return buildSnapshot(
    issues,
    { ...config, backlog: { ...config.backlog, sort } },
    manifest,
    REFERENCE_NOW,
  );
}

function nums(cards: Card[]): number[] {
  return cards.map((c) => c.number);
}

describe('AC-BOARD-04 backlog ordering', () => {
  it('renders manifest order first, then remaining by votes descending', () => {
    expect(nums(snap('curated').columns.backlog)).toEqual([17, 14, 19]);
  });

  it('orders the whole column by votes descending when sort is "votes"', () => {
    expect(nums(snap('votes').columns.backlog)).toEqual([14, 17, 19]);
  });

  it('appends backlog items absent from the manifest by votes descending', () => {
    const cards: Card[] = [
      { number: 1, votes: 5 } as Card,
      { number: 2, votes: 50 } as Card,
      { number: 3, votes: 10 } as Card,
    ];
    // Manifest lists only #1; the rest append by votes: 2 (50) then 3 (10).
    expect(nums(orderBacklog(cards, [1], 'curated'))).toEqual([1, 2, 3]);
  });
});

describe('AC-BOARD-05 / AC-VOTE-06 column ordering', () => {
  it('new ideas: votes descending then newest first', () => {
    expect(nums(snap().columns.considering)).toEqual([21, 25]);
  });

  it('not being considered: votes descending', () => {
    expect(nums(snap().columns.parked)).toEqual([7, 8]);
  });

  it('in progress: most recently updated first', () => {
    expect(nums(snap().columns['in-progress'])).toEqual([12, 9]);
  });

  it('recently shipped: shipped date descending', () => {
    expect(nums(snap().columns.shipped)).toEqual([30, 28]);
  });

  it('new ideas tie-break uses newest first', () => {
    const cards: Card[] = [
      { number: 1, votes: 5, createdAt: '2026-01-01T00:00:00Z' } as Card,
      { number: 2, votes: 5, createdAt: '2026-02-01T00:00:00Z' } as Card,
    ];
    expect(nums(orderConsidering(cards))).toEqual([2, 1]);
  });

  it('shipped is capped at the configured limit', () => {
    const cards: Card[] = Array.from({ length: 20 }, (_, i) => ({
      number: i,
      shippedAt: `2026-01-${String((i % 28) + 1).padStart(2, '0')}T00:00:00Z`,
    })) as Card[];
    expect(orderShipped(cards, 12)).toHaveLength(12);
  });
});

describe('ordering helpers are pure', () => {
  it('do not mutate their input arrays', () => {
    const input: Card[] = [
      { number: 1, votes: 1, updatedAt: '2026-01-01T00:00:00Z' } as Card,
      { number: 2, votes: 2, updatedAt: '2026-02-01T00:00:00Z' } as Card,
    ];
    const copy = [...input];
    orderParked(input);
    orderInProgress(input);
    expect(input).toEqual(copy);
  });
});
