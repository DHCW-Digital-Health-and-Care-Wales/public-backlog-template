# CLAUDE.md: operating guide for building this

This file tells you how to build the public backlog described in `specs/`. Read it fully before writing code.

## The job

Build a static website, hosted on GitHub Pages, that renders a public backlog from GitHub Issues. There is no server you can run. The site is HTML, CSS and a small amount of JavaScript. Data is produced at build time by a GitHub Action and served as static files.

## Order of work

1. Read every file in `specs/`, in number order. `02-analysis-and-architecture.md` explains why the design is shaped as it is; do not redesign around it without recording a new decision.
2. Build in this sequence, test first for each step:
   1. The data pipeline (`specs/07`): the Action and the build script that turn Issues into a snapshot. This unblocks everything else.
   2. The board rendering (`specs/04`).
   3. Upvoting display and links (`specs/06`).
   4. The suggestion flow wiring (`specs/05`); the form itself already exists at `.github/ISSUE_TEMPLATE/feature_request.yml`.
   5. Non-functional hardening (`specs/08`).
3. Keep `specs/09-test-plan.md` satisfied throughout.

## Hard rules

- **No backend and no third-party data store.** Everything is static plus the GitHub Action. This is a deliberate information-governance decision, not a convenience. Do not add a database, a serverless function, or a third-party analytics or voting service without a recorded decision and sign-off.
- **No secrets in client code.** The browser never holds a token. The Action uses the built-in `GITHUB_TOKEN` with least privilege (read access to issues).
- **Progressive enhancement.** Core content (the four columns and their items) must be present in the served HTML and readable with JavaScript switched off. JavaScript adds filtering, language switching and live refresh; it is never required to see the backlog.
- **Bilingual is mandatory.** Welsh and English are equal. Neither is a fallback bolted on later. See `specs/08`.
- **Accessible by law.** Target WCAG 2.2 AA. Automated accessibility checks must pass with zero serious or critical issues, and the documented manual checks must be performed. See `specs/08` and `specs/09`.
- **Forkable.** No DHCW specifics in logic. Everything organisation-specific lives in one config file. Another team should be able to fork, edit config, and ship.

## Tooling expectations

- Plain HTML, CSS and modern vanilla JavaScript (ES modules). A small build step is allowed; a heavyweight SPA framework is not, because it works against the no-JS requirement and the performance budget.
- Tests: **Vitest** for unit and DOM logic, **Playwright** with **@axe-core/playwright** for end-to-end and accessibility, **Lighthouse CI** for performance budgets. All tests are deterministic and run against `fixtures/issues.sample.json`. No network calls in tests.
- The build script must be runnable locally against the fixture so the whole thing can be developed and tested offline.

## Definition of done for any feature

- Acceptance criteria for the feature pass as automated tests, referenced by ID.
- No new serious or critical accessibility violations.
- Works with JavaScript disabled for anything in the progressive-enhancement baseline.
- Welsh and English both correct and present.
- Performance budget still met.
- No secret material anywhere in the client bundle.
