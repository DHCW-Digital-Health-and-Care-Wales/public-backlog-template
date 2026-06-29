import { useLanguage } from '../lib/i18n';
import config from '../lib/config';
import { newIssueUrl } from '../lib/urls';

/**
 * The "suggest a feature" control (specs/05). An ordinary link, so it works
 * with JavaScript disabled. Built from config; falls back to a generic
 * new-issue URL on a fresh fork.
 */
export function SuggestButton({
  variant = 'header',
}: {
  variant?: 'header' | 'column';
}) {
  const { t } = useLanguage();
  const { url } = newIssueUrl(config);

  const base =
    'inline-flex items-center justify-center gap-2 rounded-card px-4 py-2 font-medium focus-visible:outline focus-visible:outline-2';
  const styles =
    variant === 'header'
      ? 'bg-yellow text-navy hover:bg-[#f6c02f]'
      : 'w-full border border-action bg-surface text-action hover:bg-surface-muted';

  return (
    <a
      className={`${base} ${styles}`}
      href={url}
      data-testid={`suggest-${variant}`}
      rel="noopener noreferrer"
    >
      <PlusIcon />
      {t('suggestLabel')}
    </a>
  );
}

function PlusIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
