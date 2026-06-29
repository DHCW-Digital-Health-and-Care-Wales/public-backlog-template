import { useLanguage } from '../lib/i18n';

/**
 * Tag filtering is a progressive enhancement (AC-BOARD-12). With JavaScript
 * disabled the full board is shown and this control simply does nothing.
 */
export function TagFilter({
  tags,
  selected,
  onSelect,
}: {
  tags: string[];
  selected: string | null;
  onSelect: (tag: string | null) => void;
}) {
  const { t } = useLanguage();
  if (tags.length === 0) return null;

  return (
    <section aria-labelledby="filter-heading" className="mb-6">
      <h2 id="filter-heading" className="text-sm font-bold text-heading">
        {t('filterHeading')}
      </h2>
      <div className="mt-2 flex flex-wrap gap-2" role="group" aria-labelledby="filter-heading">
        <button
          type="button"
          onClick={() => onSelect(null)}
          aria-pressed={selected === null}
          className={
            'rounded-full px-3 py-1 text-sm font-medium ' +
            (selected === null
              ? 'bg-action text-surface'
              : 'border border-border bg-surface text-ink-700 hover:bg-surface-muted')
          }
        >
          {t('filterAll')}
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onSelect(tag)}
            aria-pressed={selected === tag}
            data-testid="tag-filter"
            className={
              'rounded-full px-3 py-1 text-sm font-medium ' +
              (selected === tag
                ? 'bg-action text-surface'
                : 'border border-border bg-surface text-ink-700 hover:bg-surface-muted')
            }
          >
            {tag}
          </button>
        ))}
      </div>
    </section>
  );
}
