# Public backlog: specification

A specification for a **best-in-class public backlog and roadmap** that runs on **GitHub Pages**, is driven by **GitHub Issues**, and is built to be **forked and reused** by other public sector teams.

This repository contains the specs, not the implementation. The intent is that you drop these into a repository and ask **Claude Code** (or any engineer) to build against them, test first.

## What it is meant to be

A single static site, hosted on GitHub Pages, that shows the public:

1. **New ideas being considered**
2. **In progress**
3. **Backlog**, ordered by priority
4. **Not being considered right now**

Anyone can **suggest a feature** (it becomes a GitHub issue) and **upvote** existing items (using GitHub's 👍 reaction). The team curates what appears and in what order, in the open.

It is designed for a Welsh NHS body, so **bilingual Welsh and English** and **WCAG 2.2 AA accessibility** are treated as hard requirements, not enhancements.

## Why these shapes were chosen

The short version: votes are a signal and not the decision; the site is static and serves a snapshot built from Issues so there is no backend and no new data store to govern; raw suggestions are curated before they appear. The reasoning, with sources, is in [`specs/02-analysis-and-architecture.md`](specs/02-analysis-and-architecture.md). Read that first.

## How to use this with Claude Code

1. Read [`CLAUDE.md`](CLAUDE.md). It is the operating guide for the build.
2. Read the specs in order. They are numbered.
3. Build feature by feature, writing the tests from each spec's acceptance criteria before the code. The acceptance criteria carry IDs (for example `AC-BOARD-03`) so tests and pull requests can reference them.
4. Run the test suite described in [`specs/09-test-plan.md`](specs/09-test-plan.md). Tests are deterministic and use [`fixtures/issues.sample.json`](fixtures/issues.sample.json); they do not call the network.

## Repository map

```
.
├── README.md                          You are here
├── CLAUDE.md                          Operating guide for the build
├── specs/
│   ├── 00-product-brief.md            Vision, users, scope, non-goals, success measures
│   ├── 01-principles.md               The non-negotiables (legal, ethical, technical)
│   ├── 02-analysis-and-architecture.md  Research findings and the key decisions (ADRs)
│   ├── 03-information-architecture.md   The four columns, labels, item lifecycle, ordering, config schema
│   ├── 04-feature-backlog-board.md      The board: rendering and behaviour
│   ├── 05-feature-request-submission.md The "suggest a feature" flow
│   ├── 06-feature-upvoting.md           Upvoting via GitHub reactions
│   ├── 07-data-pipeline.md              The build-time snapshot from Issues
│   ├── 08-non-functional-requirements.md  Accessibility, bilingual, performance, security
│   └── 09-test-plan.md                  Test strategy, tooling, traceability
├── fixtures/
│   └── issues.sample.json             Representative GitHub Issues API payload for tests
├── data/
│   └── backlog-order.example.yml      Example curated priority manifest
└── .github/ISSUE_TEMPLATE/
    └── feature_request.yml            The suggestion form (a concrete deliverable)
```

## Licence

Specification and template code released under the MIT Licence. Any content you publish from a built instance is expected to carry the Open Government Licence v3.0 unless stated otherwise.

## Building and running this instance

```
npm install
npm run build:data:fixture   # build snapshot offline from fixtures
npm run dev                  # local dev server
npm run build                # snapshot + typecheck + bundle + pre-render to dist/
npm test                     # Vitest unit/DOM
npm run test:e2e             # Playwright + axe accessibility
```

Configure a fork by editing `config.json` only. Set GitHub owner/repo, branding, default language and labels. See `docs/DECISIONS.md` for build decisions. A maintainer must set Pages source to "GitHub Actions".
