import type { Card, Status } from '../lib/types';
import { useLanguage } from './LanguageProvider';
import { COLUMN_DESCRIPTIONS, COLUMN_TITLES, STRINGS } from '../lib/i18n';
import { BacklogCard } from './BacklogCard';

export function Column({
  status,
  cards,
  leading,
}: {
  status: Status;
  cards: Card[];
  leading?: React.ReactNode;
}) {
  const { lang } = useLanguage();
  const headingId = `col-${status}`;
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3">
      <header>
        <h2 id={headingId} className="text-xl font-bold text-heading">{COLUMN_TITLES[status][lang]}</h2>
        <p className="text-sm text-ink-700">{COLUMN_DESCRIPTIONS[status][lang]}</p>
      </header>
      {leading}
      {cards.length === 0 && !leading ? (
        <p className="rounded-card border border-dashed border-border bg-surface p-4 text-sm text-ink-700">
          {STRINGS.empty[lang]}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {cards.map((c) => (
            <li key={c.number}>
              <BacklogCard card={c} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
