# 08. Non-functional requirements

These apply across every feature. Several are legal obligations, not preferences (see `specs/01`).

## Accessibility (WCAG 2.2 AA)

- Semantic structure: a single `h1`, a sensible heading hierarchy, landmark regions (header, main, footer), and each column as a labelled region. Cards form lists so assistive technology can announce counts and navigate them.
- Keyboard: every interactive element is reachable and operable by keyboard in a logical order, with a visible focus style that meets contrast. A skip link is provided.
- Colour and contrast: text contrast at least 4.5:1, interface and graphical contrast at least 3:1. Status is never conveyed by colour alone; each column and card carries a text label.
- Reflow and zoom: usable at 320 CSS pixels wide and at 400% zoom without loss of content or function.
- Motion: honour `prefers-reduced-motion`; no essential information depends on animation.
- Screen-reader sense: reading order matches visual order; vote counts are announced meaningfully (for example "41 people support this"); the "translation pending" note is announced where a language is missing.
- Language of parts: Welsh content is marked `lang="cy"` and English `lang="en"` so it is pronounced correctly.
- An **accessibility statement** page is provided and linked in the footer; it is a placeholder each fork completes before publishing.

## Bilingual (Welsh and English)

- Full parity: every interface string exists in both languages. Neither is a partial translation.
- A language toggle switches all interface strings and the language-specific card content. The choice is reflected in the URL (for example `?lang=cy`) so a link can be shared in a chosen language, and it works without client storage.
- Card content follows the bilingual convention in `specs/03`. Where a language is missing from an issue, the available language is shown with an accessible "translation pending" note; Welsh is never silently dropped.
- The default language is configurable.

## Performance

- The site is static. No heavyweight client framework. Total JavaScript shipped to the browser is small (budget: under 50 KB gzipped) and is enhancement only.
- No render-blocking third-party requests. Prefer self-hosted assets and fonts over third-party CDNs, both for performance and to avoid third-party calls from a public NHS page.
- Targets: Lighthouse performance at least 95 and accessibility 100 on the built page; First Contentful Paint fast on a mid-range mobile profile.
- The board content is in the initial HTML (pre-rendered), so it is useful before any JavaScript runs.

## Security and privacy

- No secrets in client code (also AC-PIPE-10). The only credential is the Action's least-privilege `GITHUB_TOKEN`.
- No personal data captured by the site. No third-party tracking that processes personal data without a lawful basis and a notice. If any analytics is added, it must be privacy-respecting and documented.
- Set the strongest Content Security Policy the hosting allows (via meta where headers are not configurable on Pages), and use Subresource Integrity for any unavoidable third-party asset. Prefer eliminating third-party assets entirely.
- The repository should run GitHub Advanced Security tooling where available (dependency scanning, secret scanning, code scanning), consistent with our wider engineering practice.

## Browser support and resilience

- Support current evergreen browsers. Degrade gracefully on older ones: the pre-rendered content remains readable even where enhancement scripts do not run.
- With JavaScript disabled, the four columns, their cards, vote counts, issue links and suggestion links all work.
- With the snapshot stale or missing, the page renders the last content and shows a staleness notice (AC-BOARD-15, AC-PIPE resilience).

## Acceptance criteria

- **AC-NFR-01** `[a11y]` Automated accessibility checks report zero serious or critical violations on the board in default, filtered, and Welsh-language states.
- **AC-NFR-02** `[a11y]` A documented keyboard-only pass reaches and operates every interactive element with visible focus, including the language toggle, filters, suggestion controls and upvote controls.
- **AC-NFR-03** `[unit]`/`[dom]` Welsh content carries `lang="cy"` and English `lang="en"`; the language toggle updates all interface strings and language-specific card content and reflects the choice in the URL.
- **AC-NFR-04** `[dom]` Status and column identity are conveyed by text, not colour alone.
- **AC-NFR-05** `[e2e]` The layout reflows without loss of content or function at 320 px width and at 400% zoom.
- **AC-NFR-06** `[manual]` Lighthouse performance is at least 95 and accessibility 100 on the built page; CI enforces these budgets.
- **AC-NFR-07** `[unit]` Total shipped JavaScript is within the budget and the page makes no third-party requests in snapshot mode.
- **AC-NFR-08** `[e2e]` With JavaScript disabled, columns, cards, counts, issue links and suggestion links are all present and correct.
- **AC-NFR-09** `[e2e]` `prefers-reduced-motion` is honoured: no non-essential animation runs when it is set.
- **AC-NFR-10** `[manual]` An accessibility statement page exists and is linked in the footer.
