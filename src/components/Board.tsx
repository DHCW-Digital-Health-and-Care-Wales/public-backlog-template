import { useMemo } from 'react';
import type { Card, Snapshot, Status } from '../lib/types';
import config from '../lib/config';
import { Column } from './Column';
import { SuggestButton } from './SuggestButton';
import type { StringKey } from '../lib/strings';

const COLUMN_META: {
  status: Exclude<Status, 'shipped'>;
  titleKey: StringKey;
  descKey: StringKey;
}[] = [
  {
    status: 'considering',
    titleKey: 'col_considering_title',
    descKey: 'col_considering_desc',
  },
  {
    status: 'in-progress',
    titleKey: 'col_inprogress_title',
    descKey: 'col_inprogress_desc',
  },
  { status: 'backlog', titleKey: 'col_backlog_title', descKey: 'col_backlog_desc' },
  { status: 'parked', titleKey: 'col_parked_title', descKey: 'col_parked_desc' },
];

function filterCards(cards: Card[], tag: string | null): Card[] {
  if (!tag) return cards;
  return cards.filter((c) => c.tags.includes(tag));
}

export function Board({
  snapshot,
  selectedTag,
}: {
  snapshot: Snapshot;
  selectedTag: string | null;
}) {
  const columns = snapshot.columns;
  const showShipped = config.shipped.enabled && columns.shipped.length > 0;

  const filtered = useMemo(() => {
    const result: Record<string, Card[]> = {};
    for (const [status, cards] of Object.entries(columns)) {
      result[status] = filterCards(cards, selectedTag);
    }
    return result;
  }, [columns, selectedTag]);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {COLUMN_META.map((meta) => (
          <Column
            key={meta.status}
            status={meta.status}
            titleKey={meta.titleKey}
            descKey={meta.descKey}
            cards={filtered[meta.status] ?? []}
            headingId={`column-${meta.status}`}
            leadingItem={
              meta.status === 'considering' ? (
                <SuggestButton variant="column" />
              ) : undefined
            }
          />
        ))}
      </div>

      {showShipped && (
        <div className="mt-10">
          <Column
            status="shipped"
            titleKey="col_shipped_title"
            descKey="col_shipped_desc"
            cards={filtered.shipped ?? []}
            headingId="column-shipped"
          />
        </div>
      )}
    </>
  );
}
