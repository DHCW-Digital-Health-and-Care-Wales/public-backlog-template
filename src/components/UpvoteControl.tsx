import type { Card } from '../lib/types';
import { useLanguage } from './LanguageProvider';
import { STRINGS, t } from '../lib/i18n';

const INTERACTIVE: Card['status'][] = ['considering', 'backlog', 'parked'];

export function UpvoteControl({ card }: { card: Card }) {
  const { lang } = useLanguage();
  const announce = `${card.votes} ${t(STRINGS.votesLabel, lang)}`;
  const interactive = INTERACTIVE.includes(card.status);

  if (!interactive) {
    return (
      <span className="inline-flex items-center gap-2 text-ink-700 text-sm font-medium">
        <span aria-hidden="true">▲</span>
        <span>{announce}</span>
      </span>
    );
  }

  return (
    <a
      href={card.url}
      className="inline-flex items-center gap-2 rounded-card border border-border-strong bg-surface px-3 py-1.5 text-sm font-medium text-action hover:bg-surface-muted"
      aria-label={`${t(STRINGS.upvote, lang)}: ${announce}. ${t(STRINGS.upvoteHelp, lang)}`}
    >
      <span aria-hidden="true">▲</span>
      <span>{announce}</span>
    </a>
  );
}
