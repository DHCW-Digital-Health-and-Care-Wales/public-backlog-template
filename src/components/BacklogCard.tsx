import { useLanguage } from '../lib/i18n';
import { localiseWithLang } from '../lib/strings';
import type { Card } from '../lib/types';
import { VoteControl } from './VoteControl';
import { TranslationPending } from './TranslationPending';

const INTERACTIVE_STATUSES = new Set(['considering', 'backlog', 'parked']);

function formatDate(iso: string, lang: string): string {
  const locale = lang === 'cy' ? 'cy' : 'en-GB';
  try {
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return new Date(iso).toISOString().slice(0, 10);
  }
}

export function BacklogCard({ card }: { card: Card }) {
  const { lang, t } = useLanguage();
  const interactive = INTERACTIVE_STATUSES.has(card.status);

  const title = localiseWithLang(card.title, lang);
  const summary = localiseWithLang(card.summary, lang);
  const summaryMissing =
    (lang === 'en' && card.flags.includes('missing-english')) ||
    (lang === 'cy' && card.flags.includes('missing-welsh'));

  const isStale = card.flags.includes('stale-in-progress');
  const parkedWithoutRationale = card.flags.includes('parked-without-rationale');

  return (
    <article
      className="rounded-card border border-border bg-surface p-4 shadow-sm"
      data-testid="card"
      data-number={card.number}
      data-status={card.status}
      data-tags={card.tags.join('|')}
    >
      <h3 className="text-base font-bold text-heading">
        <a
          className="text-heading underline-offset-2 hover:underline"
          href={card.url}
          lang={title.lang}
          rel="noopener noreferrer"
        >
          {title.text}
        </a>
      </h3>

      <p className="mt-2 text-sm text-ink-900" lang={summary.lang}>
        {summary.text}
      </p>
      {summaryMissing && <TranslationPending />}

      {card.status === 'parked' && (
        <div className="mt-3 rounded bg-surface-subtle p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-700">
            {t('rationaleHeading')}
          </p>
          {card.rationale && !parkedWithoutRationale ? (
            <ParkedRationale card={card} />
          ) : (
            <p
              className="mt-1 text-sm italic text-ink-700"
              data-testid="rationale-missing"
            >
              {t('contentErrorRationale')}
            </p>
          )}
        </div>
      )}

      {card.tags.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Tags">
          {card.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-medium text-ink-700"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex items-center justify-between gap-3">
        <VoteControl card={card} interactive={interactive} />
        {isStale && (
          <span
            className="text-xs text-ink-700"
            data-testid="stale-indicator"
          >
            <span className="font-medium">{t('lastUpdatedLabel')}:</span>{' '}
            {formatDate(card.updatedAt, lang)}
            <span className="sr-only"> {t('staleInProgress')}</span>
          </span>
        )}
      </div>
    </article>
  );
}

function ParkedRationale({ card }: { card: Card }) {
  const { lang } = useLanguage();
  if (!card.rationale) return null;
  const rationale = localiseWithLang(card.rationale, lang);
  return (
    <p className="mt-1 text-sm text-ink-900" lang={rationale.lang}>
      {rationale.text}
    </p>
  );
}
