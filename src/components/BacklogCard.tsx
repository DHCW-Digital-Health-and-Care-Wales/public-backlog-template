import type { Card } from '../lib/types';
import type { Lang } from '../lib/types';
import { useLanguage } from './LanguageProvider';
import { STRINGS } from '../lib/i18n';
import { UpvoteControl } from './UpvoteControl';

function summaryLang(card: Card): Lang {
  if (card.flags.includes('missing-welsh')) return 'en';
  if (card.flags.includes('missing-english')) return 'cy';
  return 'en';
}

export function BacklogCard({ card }: { card: Card }) {
  const { lang } = useLanguage();
  const sLang: Lang = card.summary[lang] && card.summary[lang].trim() ? lang : summaryLang(card);
  const isStale = card.flags.includes('stale');
  const tagList = card.tags;

  return (
    <article
      className="rounded-card border border-border bg-surface p-4 shadow-sm"
      data-number={card.number}
      data-tags={tagList.join('|')}
    >
      <h3 className="font-bold text-heading">
        <a href={card.url} className="hover:underline">{card.title[lang] || card.title.en}</a>
      </h3>
      <p className="mt-1 text-ink-900" lang={sLang}>{card.summary[sLang]}</p>
      {sLang !== lang && (
        <p className="mt-1 text-xs text-ink-700">{STRINGS.translationPending[lang]}</p>
      )}
      {card.status === 'parked' && (
        <div className="mt-3 rounded bg-surface-subtle p-3">
          <p className="text-xs font-medium text-heading">{STRINGS.rationale[lang]}</p>
          {card.rationale ? (
            <p className="text-sm text-ink-900">{card.rationale[lang] || card.rationale.en}</p>
          ) : (
            <p className="text-sm font-medium text-ink-700">{STRINGS.rationaleMissing[lang]}</p>
          )}
        </div>
      )}
      {tagList.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Tags">
          {tagList.map((tag) => (
            <li key={tag} className="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-medium text-ink-700">{tag}</li>
          ))}
        </ul>
      )}
      <div className="mt-3 flex items-center justify-between gap-2">
        <UpvoteControl card={card} />
        {isStale && (
          <span className="text-xs text-ink-700">
            {STRINGS.lastUpdated[lang]}: {new Date(card.updatedAt).toISOString().slice(0, 10)}
          </span>
        )}
      </div>
      {isStale && <p className="mt-1 text-xs text-ink-700">{STRINGS.stale[lang]}</p>}
    </article>
  );
}
