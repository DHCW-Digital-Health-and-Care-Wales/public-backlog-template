import { useLanguage } from '../lib/i18n';

export function SkipLink() {
  const { t } = useLanguage();
  return (
    <a className="skip-link" href="#main">
      {t('skipToContent')}
    </a>
  );
}
