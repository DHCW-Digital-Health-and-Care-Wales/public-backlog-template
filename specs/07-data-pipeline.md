# 07. Feature: the data pipeline

The build-time process that turns GitHub Issues into static artefacts the site serves (ADR-004). This is the first thing to build, because everything else renders from its output.

## What it produces

A GitHub Action runs a build script that:

1. Queries the repository's Issues via the GitHub API, authenticated with the built-in `GITHUB_TOKEN` (read-only on issues), requesting reaction summaries. It pages through all results and excludes pull requests.
2. Keeps only issues that carry a `status:` label (the curation gate). Includes closed issues only where they are `status: shipped` and `state_reason: completed`.
3. Normalises each kept issue into the card model in `specs/03` (status, bilingual title and summary, parked rationale, tags, vote count, timestamps, content-health flags).
4. Reads the curated manifest (`data/backlog-order.yml`) and computes the order for each column per `specs/03`.
5. Computes health signals (in-progress staleness, triage-queue age, parked-without-rationale, missing-language).
6. Writes the artefacts: a data file (`backlog.json`) containing the ordered, normalised cards and metadata (including a `generatedAt` timestamp and the health summary), and the pre-rendered HTML for the board so the page works with no JavaScript.

## When it runs

- On a schedule (configurable; default every 15 to 30 minutes), so counts and movements stay fresh.
- On issue events (opened, edited, labeled, unlabeled, closed, reopened), so a triage action is reflected quickly.
- On manual dispatch.
- On push to the default branch, so content and code deploy together.

## Modes

- **Snapshot mode** (`data.mode: "snapshot"`, production): the page reads the static `backlog.json` and the pre-rendered HTML. No API calls at request time. This is the default and the recommended mode.
- **Client mode** (`data.mode: "client"`, demos and very low traffic): the page may call the API from the browser, with the last committed snapshot as a fallback. Provided for convenience; not recommended for anything public-facing at scale.

## Resilience

- If the API call fails during a build, the build does not overwrite the last good snapshot with an empty or partial one; it fails loudly (Action failure) and the previously published snapshot remains live.
- The served page treats a snapshot older than a configured freshness window as stale and shows a visible staleness notice while still rendering the last content (paired with AC-BOARD-15).
- A failed scheduled build notifies maintainers through the Action's normal failure notifications.

## Security

- No token is ever placed in client code or the published artefacts. The only credential is the Action's `GITHUB_TOKEN`, scoped to read issues.
- The build script must run locally against `fixtures/issues.sample.json` with no network access, so the site is fully developable and testable offline.

## Acceptance criteria

- **AC-PIPE-01** `[unit]` Given `fixtures/issues.sample.json`, the build outputs cards only for issues carrying a `status:` label; #33 (`needs-triage`, no status) and #5 (closed, not planned, no status) are excluded.
- **AC-PIPE-02** `[unit]` Closed issue #30 (`status: shipped`, completed) appears only in the shipped set, with `shippedAt` set from the issue's closed date.
- **AC-PIPE-03** `[unit]` Each output card matches the card-model schema in `specs/03`, including bilingual `title` and `summary`, `votes` from the `+1` count, and timestamps.
- **AC-PIPE-04** `[unit]` Parked issue #7 produces a card with a populated bilingual `rationale` extracted from its decision section; an otherwise-identical parked issue with no decision section produces a `parked-without-rationale` flag.
- **AC-PIPE-05** `[unit]` An issue missing a `## Cymraeg` section produces a `missing-welsh` flag and falls back to the English summary; an issue missing `## English` produces `missing-english`.
- **AC-PIPE-06** `[unit]` Column ordering in the output matches `specs/03` for every column, including curated manifest order for the backlog with vote-ordered remainder.
- **AC-PIPE-07** `[unit]` The output includes a `generatedAt` timestamp and a health summary (counts of stale in-progress items, untriaged items and the oldest untriaged age, and any content-error flags).
- **AC-PIPE-08** `[unit]` An in-progress issue with `updatedAt` older than `health.inProgressStaleDays` is marked stale in the output.
- **AC-PIPE-09** `[manual]` The Action runs on schedule, on the listed issue events, on manual dispatch and on push, and a deliberately failing API call does not replace the last good published snapshot.
- **AC-PIPE-10** `[unit]` Inspecting the published artefacts (HTML, `backlog.json`, JavaScript bundle) reveals no token or secret material.
- **AC-PIPE-11** `[unit]` The build script completes successfully against the fixture with no network access.
