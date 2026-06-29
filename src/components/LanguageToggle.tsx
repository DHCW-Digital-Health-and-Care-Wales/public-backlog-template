import { useLanguage } from '../lib/i18n';
import config from '../lib/config';
import type { Language } from '../lib/types';

/**
 * Language toggle. Welsh and English are equal. The choice is reflected in the
 * URL (?lang=) and works without client storage (specs/08).
 */
export function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();
  const available = config.language.available;

  return (
    <div
      className="inline-flex items-center gap-1 rounded-card bg-surface p-1"
      role="group"
      aria-label={t('languageToggleLabel')}
    >
      {available.map((option: Language) => {
        const isActive = option === lang;
        const label = option === 'cy' ? 'Cymraeg' : 'English';
        return (
          <button
            key={option}
            type="button"
            lang={option}
            onClick={() => setLang(option)}
            aria-pressed={isActive}
            className={
              'rounded px-3 py-1 text-sm font-medium ' +
              (isActive
                ? 'bg-action text-surface'
                : 'text-action hover:bg-surface-muted')
            }
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
