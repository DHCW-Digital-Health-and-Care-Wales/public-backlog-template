import { useLanguage } from '../lib/i18n';
import config from '../lib/config';
import { SuggestButton } from './SuggestButton';
import { LanguageToggle } from './LanguageToggle';

export function Header() {
  const { localise } = useLanguage();
  return (
    <header className="bg-nhs-wales-blue text-surface">
      <div className="mx-auto flex max-w-content flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-surface/90">
            {localise(config.team.organisation)}
          </p>
          <p className="text-lg font-bold">{config.team.name}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <LanguageToggle />
          <SuggestButton variant="header" />
        </div>
      </div>
    </header>
  );
}
