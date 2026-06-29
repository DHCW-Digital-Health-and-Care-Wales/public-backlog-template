import { useMemo, useState } from 'react';
import type { Snapshot, Status } from './lib/types';
import { useLanguage } from './components/LanguageProvider';
import { STRINGS } from './lib/i18n';
import { Header, SuggestButton } from './components/Header';
import { Footer } from './components/Footer';
import { Column } from './components/Column';
import config from '../config.json';

const ORDER: Status[] = ['considering', 'in-progress', 'backlog', 'parked'];

function snapshotIsStale(generatedAt: string): boolean {
  const ageHours = (Date.now() - new Date(generatedAt).getTime()) / 3_600_000;
  return ageHours > config.health.snapshotStaleHours;
}

export default function App({ snapshot }: { snapshot: Snapshot }) {
  const { lang } = useLanguage();
  const [filter, setFilter] = useState<string>('');

  const allTags = useMemo(() => {
    const set = new Set<string>();
    Object.values(snapshot.columns).flat().forEach((c) => c.tags.forEach((t) => set.add(t)));
    return [...set].sort();
  }, [snapshot]);

  const filtered = (cards: typeof snapshot.columns.backlog) =>
    filter ? cards.filter((c) => c.tags.includes(filter)) : cards;

  return (
    <div id="top">
      <a href="#main" className="skip-link">{STRINGS.skipToContent[lang]}</a>
      <Header />
      <main id="main" className="mx-auto max-w-content px-4 py-6">
        <h1 className="text-2xl font-bold text-heading">{config.team.name}</h1>
        <section aria-labelledby="about" className="mt-4 rounded-card bg-surface p-4">
          <h2 id="about" className="font-bold text-heading">{STRINGS.aboutHeading[lang]}</h2>
          <p className="mt-1 text-ink-900">{STRINGS.aboutBody[lang]}</p>
        </section>

        {snapshotIsStale(snapshot.generatedAt) && (
          <p role="status" className="mt-4 rounded-card bg-yellow px-4 py-2 text-navy">{STRINGS.staleSnapshot[lang]}</p>
        )}

        <div className="mt-4">
          <label htmlFor="tagfilter" className="mr-2 text-sm font-medium">{STRINGS.filterLabel[lang]}</label>
          <select
            id="tagfilter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-card border border-border-strong bg-surface px-2 py-1 text-sm"
          >
            <option value="">{STRINGS.filterAll[lang]}</option>
            {allTags.map((tg) => (<option key={tg} value={tg}>{tg}</option>))}
          </select>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {ORDER.map((status) => (
            <Column
              key={status}
              status={status}
              cards={filtered(snapshot.columns[status])}
              leading={status === 'considering' ? <SuggestButton block /> : undefined}
            />
          ))}
        </div>

        {config.shipped.enabled && snapshot.columns.shipped.length > 0 && (
          <div className="mt-8">
            <Column status="shipped" cards={filtered(snapshot.columns.shipped)} />
          </div>
        )}

        <p className="mt-8 text-sm text-ink-700">
          {STRINGS.lastUpdated[lang]}: {new Date(snapshot.generatedAt).toISOString().slice(0, 16).replace('T', ' ')} UTC
        </p>
      </main>
      <Footer />
    </div>
  );
}
