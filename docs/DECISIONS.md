# Decisions

This file records the design and architecture decisions taken while building the
public backlog, including the points where the build prompt resolved a tension in
`specs/`. Where the prompt and the specs disagree, the prompt wins and the choice
is recorded here.

## D1. Surface location: distinct entry point in this repository

The backlog is built as its own product surface in this repository. It has its own
data model (the card model in `specs/03`) and its own entry point (`index.html` plus
`src/entry-client.tsx` and `src/entry-server.tsx`). It deliberately does not merge
with or repurpose any roadmap data model.

When this repository was opened, it did not contain a pre-existing roadmap app under
`src/`. The DHCW Design System V2 tokens described in the brief were therefore
realised directly in `tailwind.config.js` (brand, UI, neutral, type and shape
tokens), and the card, column, header, footer, language toggle, accessibility
statement, privacy note and back-to-top patterns were built to match the documented
design system. No new colours or fonts were introduced. Roboto is self-hosted via
`@fontsource/roboto`.

If the backlog is later moved to its own repository, this code and the design tokens
move with it unchanged.

## D2. No-JavaScript baseline: pre-render the board (preferred)

The board is pre-rendered to static HTML at build time. `npm run build` runs the
data snapshot, type-checks, builds the client and an SSR bundle, then injects the
rendered board into `dist/index.html` (`scripts/prerender.ts`). The four areas, the
optional Recently shipped area and every card are present in the served HTML and are
readable with JavaScript switched off. The suggestion control and every upvote
control are ordinary links, so they work without JavaScript.

JavaScript is pure enhancement: tag filtering, the language toggle and the
freshness re-read of the static snapshot.

Documented deviation: the pre-rendered HTML is emitted in the default language only.
Switching to Welsh updates the page and the `?lang=` URL through JavaScript. The
default-language board is fully readable without JavaScript; live language switching
is a JavaScript enhancement. This matches the "acceptable fallback, documented
deviation" allowance in the build prompt. Both languages are present and correct for
all users with JavaScript, and the Welsh state passes the automated accessibility
checks.

## D3. Backlog ordering: curated manifest (default)

The Backlog area is ordered by the curated manifest `data/backlog-order.yml`
(`specs/02` ADR-002, `specs/03`). Vote counts are shown on cards but do not drive the
order. A configuration flag (`backlog.sort` in `config.json`, `curated` or `votes`)
can switch the Backlog area to vote order; any items not named in the manifest are
appended in vote order so nothing is lost.

## D4. Recently shipped: on by default

The Recently shipped area is enabled by default because closing the loop builds
trust (`specs/03` ADR-005). It is controlled by `shipped.enabled` in `config.json`
and shows read-only vote counts.

## D5. Default language: English

The default language is English (`language.default` in `config.json`), matching the
roadmap convention. Welsh and English are equal; neither is a fallback bolted on
later. A single configuration value flips the default to Welsh-first. Where a Welsh
translation is missing, the English text is shown, marked with the correct `lang`
attribute, and a visible "translation pending" note is displayed; Welsh is never
silently dropped.

## D6. Build-time data only, no per-visitor API call

Issues are snapshotted into a static data file by a GitHub Action
(`.github/workflows/update-backlog.yml`) using the built-in `GITHUB_TOKEN` with read
access to issues. The browser never calls the GitHub API at request time in the
production path and never holds a token. The snapshot script
(`scripts/build-snapshot.ts`) pages through all issues, requests reaction summaries,
excludes pull requests, applies the curation gate (only issues carrying a `status:`
label appear; closed issues only when shipped), and refuses to overwrite the last
good snapshot with empty data. It runs offline against
`fixtures/issues.sample.json`, so the whole site is developable and testable without
network access.

## D7. Stack: Vite + React, with Preact in production

The repository stack is Vite, React, TypeScript and Tailwind, and that stack is kept.
To meet the performance budget in `specs/08`, the production build aliases React to
Preact (`@preact/preset-vite`), which keeps the client bundle small (about 17 KB
gzipped). Tests run against real React (`@vitejs/plugin-react` in `vitest.config.ts`)
so `@testing-library/react` behaves normally. Component code uses the React API and is
unchanged between the two.

## D8. Relative base path for forkability

The Vite `base` is `'./'` (relative) so the site works on any GitHub Pages path
without per-fork configuration. Everything organisation-specific lives in
`config.json`, so another team can fork, edit the config, and ship.

## Manual step required (for the repository owner)

GitHub Pages must be set to deploy from GitHub Actions:
Settings > Pages > Build and deployment > Source > GitHub Actions. This cannot be
automated and must be done once by a repository administrator.
