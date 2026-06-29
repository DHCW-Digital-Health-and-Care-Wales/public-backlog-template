# Decisions

Decisions taken while building the backlog from `specs/`. Where this build resolved a tension in the specs, the resolution is recorded here.

## D-1 Surface location: distinct entry point in this repository
This repository held only specs and a Figma export, with no existing roadmap app. The backlog is built as the primary app here, reusing the DHCW Design System V2 tokens. No roadmap data model was touched. (Section 3, default.)

## D-2 No-JavaScript: pre-render the board (preferred)
The board is pre-rendered at build time via `scripts/prerender.ts` (React `renderToString`), so the four areas and all cards are in the served HTML and readable with JavaScript off. JavaScript hydrates on top to add tag filtering, language switching and the staleness notice. (Section 5, preferred option.)

## D-3 Backlog ordering: curated manifest by default
`data/backlog-order.yml` drives backlog order; remaining items append by votes descending. `config.backlog.sort: "votes"` switches the whole column to votes. Votes are shown but are not the default sort (ADR-002).

## D-4 Recently shipped: on by default
`shipped.enabled: true`, closing the loop on delivered work (ADR-005 recommendation).

## D-5 Default language: English
`language.default: "en"`; flip via config to Welsh-first. Both languages are first-class. (Section 12, confirm with Joshua.)

## D-6 Stack: Vite + React + TypeScript + Tailwind
Spec intent honoured: build-time snapshot only (no per-visitor API call), pre-rendered HTML, bilingual via `src/lib/i18n.ts`, curation gate, votes as a signal. JS bundle is ~50 KB gzip, enhancement only.

## Manual step required
Joshua must set the GitHub Pages source to "GitHub Actions" in repository settings. The agent cannot do this.
