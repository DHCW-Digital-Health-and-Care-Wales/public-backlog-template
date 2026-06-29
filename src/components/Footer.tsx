import { useLanguage } from './LanguageProvider';
import { STRINGS } from '../lib/i18n';
import config from '../../config.json';

export function Footer() {
  const { lang } = useLanguage();
  const base = (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? '/PCMH-Roadmap/';
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-4 px-4 py-6 text-sm">
        <p>{config.team.organisation[lang]}</p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-4">
            <li><a className="text-white underline" href={`${base}accessibility.html`}>{STRINGS.footerAccessibility[lang]}</a></li>
            <li><a className="text-white underline" href={`${base}privacy.html`}>{STRINGS.footerPrivacy[lang]}</a></li>
            <li><a className="text-white underline" href="#top">{STRINGS.backToTop[lang]}</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
