import type { ReactNode } from 'react';
import { useLanguage } from '../lib/i18n';
import type { Card, Status } from '../lib/types';
import type { StringKey } from '../lib/strings';
import { BacklogCard } from './BacklogCard';

export function Column({
  status,
  titleKey,
  descKey,
  cards,
  headingId,
  leadingItem,
}: {
  status: Status;
  titleKey: StringKey;
  descKey: StringKey;
  cards: Card[];
  headingId: string;
  leadingItem?: ReactNode;
}) {
  const { t } = useLanguage();
  const isEmpty = cards.length === 0 && !leadingItem;

  return (
    <section
      className="flex flex-col"
      aria-labelledby={headingId}
      data-testid="column"
      data-column={status}
    >
      <div className="mb-3 border-t-4 border-action pt-3">
        <h2 id={headingId} className="text-lg font-bold text-heading">
          {t(titleKey)}
        </h2>
        <p className="mt-1 text-sm text-ink-700">{t(descKey)}</p>
      </div>

      {isEmpty ? (
        <p
          className="rounded-card border border-dashed border-border bg-surface p-4 text-sm text-ink-700"
          data-testid="empty-state"
        >
          {t('emptyColumn')}
        </p>
      ) : (
        <ul className="flex flex-col gap-3" data-testid="card-list">
          {leadingItem && <li>{leadingItem}</li>}
          {cards.map((card) => (
            <li key={card.number}>
              <BacklogCard card={card} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
