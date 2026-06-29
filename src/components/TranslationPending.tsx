import { useLanguage } from '../lib/i18n';

/**
 * Small, accessible note shown when an issue is missing a language and the
 * available language is shown instead. Welsh is never silently dropped
 * (specs/03, specs/08).
 */
export function TranslationPending() {
  const { t } = useLanguage();
  return (
    <p
      className="mt-2 text-xs italic text-ink-700"
      role="note"
      data-testid="translation-pending"
    >
      {t('translationPending')}
    </p>
  );
}
