import { useLanguage } from '../lib/i18n';
import config from '../lib/config';

export function AccessibilityStatement() {
  const { lang } = useLanguage();
  return (
    <section
      id="accessibility"
      aria-labelledby="accessibility-heading"
      className="rounded-card border border-border bg-surface p-4"
      data-testid="accessibility-statement"
    >
      <h2
        id="accessibility-heading"
        className="text-lg font-bold text-heading"
        lang={lang}
      >
        {lang === 'cy' ? 'Datganiad hygyrchedd' : 'Accessibility statement'}
      </h2>
      {lang === 'cy' ? (
        <div className="mt-2 space-y-2 text-sm text-ink-900" lang="cy">
          <p>
            Rydym am i gymaint o bobl a phosibl allu defnyddio'r wefan hon. Rydym yn
            anelu at gydymffurfio a Chanllawiau Hygyrchedd Cynnwys Gwe (WCAG) 2.2 lefel AA.
          </p>
          <p>
            [LleNwr] Cwblhewch y datganiad hwn cyn cyhoeddi: y dyddiad adolygu, sut i
            roi gwybod am broblemau hygyrchedd, a llwybr cyswllt.
          </p>
        </div>
      ) : (
        <div className="mt-2 space-y-2 text-sm text-ink-900" lang="en">
          <p>
            We want as many people as possible to be able to use this website. We aim to
            meet the Web Content Accessibility Guidelines (WCAG) 2.2 level AA.
          </p>
          <p>
            [Placeholder] Complete this statement before publishing: the review date, how
            to report accessibility problems, and a contact route.
          </p>
        </div>
      )}
    </section>
  );
}

export function PrivacyNote() {
  const { lang } = useLanguage();
  return (
    <section
      id="privacy"
      aria-labelledby="privacy-heading"
      className="rounded-card border border-border bg-surface p-4"
      data-testid="privacy-note"
    >
      <h2 id="privacy-heading" className="text-lg font-bold text-heading" lang={lang}>
        {lang === 'cy' ? 'Nodyn preifatrwydd' : 'Privacy note'}
      </h2>
      {lang === 'cy' ? (
        <p className="mt-2 text-sm text-ink-900" lang="cy">
          Nid yw'r safle hwn yn gosod cwcis tracio, nid yw'n defnyddio dadansoddeg
          trydydd parti, ac mae'n hunan-westeia ei ffontiau, felly nid oes dim i
          gydsynio iddo. Cynhelir pleidleisio a thrafod ar GitHub.
        </p>
      ) : (
        <p className="mt-2 text-sm text-ink-900" lang="en">
          This site sets no tracking cookies, uses no third-party analytics, and
          self-hosts its fonts, so there is nothing to consent to. Voting and discussion
          take place on GitHub.
        </p>
      )}
    </section>
  );
}

export function Footer() {
  const { t, localise } = useLanguage();
  return (
    <footer className="mt-10 bg-navy text-surface">
      <div className="mx-auto max-w-content px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          <AccessibilityStatement />
          <PrivacyNote />
        </div>
        <nav
          className="mt-6 flex flex-wrap gap-4 text-sm"
          aria-label={localise(config.team.organisation)}
        >
          <a className="underline hover:no-underline" href="#accessibility">
            {t('accessibilityStatement')}
          </a>
          <a className="underline hover:no-underline" href="#privacy">
            {t('privacyNote')}
          </a>
        </nav>
        <p className="mt-4 text-xs text-surface/80">
          {localise(config.team.organisation)} &middot; Code: MIT &middot; Content:
          Open Government Licence v3.0
        </p>
      </div>
    </footer>
  );
}
