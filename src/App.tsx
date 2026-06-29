import { useEffect, useMemo, useState } from 'react';
import type { Snapshot } from './lib/types';
import config from './lib/config';
import baselineSnapshot from './data/backlog.generated.json';
import { SkipLink } from './components/SkipLink';
import { Header } from './components/Header';
import { Intro, AboutBoard } from './components/Intro';
import { StalenessNotice } from './components/StalenessNotice';
import { TagFilter } from './components/TagFilter';
import { Board } from './components/Board';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';

const baseline = baselineSnapshot as Snapshot;

function isSnapshotStale(generatedAt: string, now: number): boolean {
  const windowMs = config.health.freshnessWindowHours * 60 * 60 * 1000;
  return now - new Date(generatedAt).getTime() > windowMs;
}

function collectTags(snapshot: Snapshot): string[] {
  const set = new Set<string>();
  for (const cards of Object.values(snapshot.columns)) {
    for (const card of cards) {
      for (const tag of card.tags) set.add(tag);
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

export function App() {
  const [snapshot, setSnapshot] = useState<Snapshot>(baseline);
  const [isStale, setIsStale] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Progressive enhancement: re-read the same-origin static snapshot for
  // freshness. If it is missing or older than the freshness window, keep the
  // last content and show a staleness notice (AC-BOARD-15). No third-party
  // request and no token (specs/07, specs/08).
  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      try {
        const res = await fetch(new URL('backlog.json', document.baseURI), {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = (await res.json()) as Snapshot;
        if (cancelled) return;
        setSnapshot(data);
        setIsStale(isSnapshotStale(data.generatedAt, Date.now()));
      } catch {
        if (cancelled) return;
        // Missing or unreadable snapshot: keep baseline, flag staleness.
        setIsStale(isSnapshotStale(baseline.generatedAt, Date.now()));
      }
    }
    void refresh();
    return () => {
      cancelled = true;
    };
  }, []);

  const tags = useMemo(() => collectTags(snapshot), [snapshot]);

  return (
    <>
      <SkipLink />
      <Header />
      <main id="main" className="mx-auto max-w-content px-4 py-6">
        <Intro />
        <StalenessNotice generatedAt={snapshot.generatedAt} isStale={isStale} />
        <AboutBoard />
        <TagFilter tags={tags} selected={selectedTag} onSelect={setSelectedTag} />
        <Board snapshot={snapshot} selectedTag={selectedTag} />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

export default App;
