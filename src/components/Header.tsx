import { useLanguage } from './LanguageProvider';
import { STRINGS } from '../lib/i18n';
import { newIssueUrl, isConfigured } from '../lib/urls';
import { LanguageToggle } from './LanguageToggle';
import config from '../../config.json';

export function SuggestButton({ block }: { block?: boolean }) {
  const { lang } = useLanguage();
  return (
    <a
      href={newIssueUrl(config.github)}
      className={`inline-flex items-center justify-center rounded-card bg-yellow px-4 py-2 font-bold text-navy hover:brightness-95 ${block ? 'w-full' : ''}`}
    >
      {STRINGS.suggest[lang]}
    </a>
  );
}

export function Header() {
  const { lang } = useLanguage();
  const org = config.team.organisation[lang];
  return (
    <header className="bg-nhs-wales-blue text-white">
      <div className="mx-auto flex max-w-content flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm opacity-90">{org}</p>
          <p className="text-lg font-bold">{config.team.name} &middot; {STRINGS.siteTitle[lang]}</p>
        </div>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <SuggestButton />
        </div>
      </div>
      {!isConfigured(config.github) && (
        <p className="bg-yellow px-4 py-2 text-center text-sm text-navy">{STRINGS.configNotice[lang]}</p>
      )}
    </header>
  );
}
