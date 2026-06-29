import { useLanguage } from '../lib/i18n';
import {
  upvoteActionLabel,
  voteAnnouncement,
} from '../lib/strings';
import { getVoteCount } from '../lib/votes';
import type { Card } from '../lib/types';

function ThumbsUpIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 10v11" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  );
}

/**
 * Vote display and control (specs/06). Cards in New ideas, Backlog and Not
 * being considered get an interactive control that deep-links to the issue.
 * In progress and Recently shipped show the count only (read-only).
 */
export function VoteControl({
  card,
  interactive,
}: {
  card: Card;
  interactive: boolean;
}) {
  const { lang, localise, t } = useLanguage();
  const count = getVoteCount(card);
  const title = localise(card.title);

  if (!interactive) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1 text-sm font-medium text-ink-700"
        data-testid="vote-readonly"
      >
        <ThumbsUpIcon />
        <span aria-hidden="true">{count}</span>
        <span className="sr-only">{voteAnnouncement(count, lang)}</span>
      </span>
    );
  }

  const helperId = `upvote-help-${card.number}`;
  return (
    <span className="inline-flex flex-col items-start gap-1">
      <a
        href={card.url}
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full border border-action bg-surface px-3 py-1 text-sm font-medium text-action hover:bg-surface-muted"
        aria-label={upvoteActionLabel(count, title, lang)}
        aria-describedby={helperId}
        data-testid="vote-control"
      >
        <ThumbsUpIcon />
        <span aria-hidden="true">{count}</span>
      </a>
      <span id={helperId} className="sr-only">
        {t('upvoteHelper')}
      </span>
    </span>
  );
}
