import { useLanguage } from '../lib/i18n';

function formatDateTime(iso: string, lang: string): string {
  const locale = lang === 'cy' ? 'cy' : 'en-GB';
  try {
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return new Date(iso).toISOString();
  }
}

/**
 * Shows when the board was last refreshed and, when the snapshot is older than
 * the configured freshness window, a visible staleness notice (AC-BOARD-15).
 */
export function StalenessNotice({
  generatedAt,
  isStale,
}: {
  generatedAt: string;
  isStale: boolean;
}) {
  const { t, lang } = useLanguage();
  return (
    <div className="mb-6 text-sm" data-testid="board-freshness">
      <p className="text-ink-700">
        <span className="font-medium">{t('boardUpdated')}:</span>{' '}
        <time dateTime={generatedAt}>{formatDateTime(generatedAt, lang)}</time>
      </p>
      {isStale && (
        <p
          role="status"
          className="mt-2 rounded-card border border-yellow bg-[#fdf6e3] p-3 text-ink-900"
          data-testid="stale-notice"
        >
          {t('staleSnapshotNotice')}
        </p>
      )}
    </div>
  );
}
