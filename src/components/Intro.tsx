import { useLanguage } from '../lib/i18n';

export function Intro() {
  const { t } = useLanguage();
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-heading sm:text-3xl">
        {t('introHeading')}
      </h1>
      <p className="mt-2 max-w-3xl text-ink-900">{t('introBody')}</p>
    </div>
  );
}

export function AboutBoard() {
  const { t } = useLanguage();
  return (
    <section
      aria-labelledby="about-heading"
      className="mb-6 rounded-card border border-border bg-surface p-4"
      data-testid="about-board"
    >
      <h2 id="about-heading" className="text-lg font-bold text-heading">
        {t('aboutHeading')}
      </h2>
      <p className="mt-2 text-sm text-ink-900">{t('aboutBody')}</p>
      <p className="mt-2 text-sm text-ink-700">{t('votingLimitations')}</p>
    </section>
  );
}
