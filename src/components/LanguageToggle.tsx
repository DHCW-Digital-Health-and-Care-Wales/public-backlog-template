import { useLanguage } from './LanguageProvider';
import { STRINGS, t } from '../lib/i18n';

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <div role="group" aria-label="Language / Iaith" className="flex gap-1 rounded-card bg-white/10 p-1">
      <button
        type="button"
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        lang="en"
        className={`px-3 py-1 rounded text-sm font-medium ${lang === 'en' ? 'bg-white text-nhs-wales-blue' : 'text-white'}`}
      >
        {t(STRINGS.langEn, lang)}
      </button>
      <button
        type="button"
        onClick={() => setLang('cy')}
        aria-pressed={lang === 'cy'}
        lang="cy"
        className={`px-3 py-1 rounded text-sm font-medium ${lang === 'cy' ? 'bg-white text-nhs-wales-blue' : 'text-white'}`}
      >
        {t(STRINGS.langCy, lang)}
      </button>
    </div>
  );
}
