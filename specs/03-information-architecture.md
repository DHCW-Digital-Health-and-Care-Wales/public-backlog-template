# 03. Information architecture

This defines the data model the whole site is built on: the four areas, the labels that drive them, how an item moves through its life, how each area is ordered, the shape of a rendered card, the staleness rules, and the configuration schema. Features in later specs refer back to this.

## The four areas (plus one optional)

Each area is a column on the board. Detail is graded by confidence: the more committed the work, the more detail a card carries.

| Order | Area | Driven by | Card detail | Voting |
|------:|------|-----------|-------------|--------|
| 1 | **New ideas being considered** | `status: considering` (open) | Title and a sentence or two | Shown, votes enabled |
| 2 | **In progress** | `status: in-progress` (open) | Title, short description | Shown, read-only |
| 3 | **Backlog** | `status: backlog` (open) | Title, short description | Shown, votes enabled |
| 4 | **Not being considered right now** | `status: parked` (open) | Title, short description, **and a rationale** | Shown, votes enabled |
| 5 (optional, recommended) | **Recently shipped** | `status: shipped` (closed, `state_reason: completed`) | Title, short description, shipped date | Shown, read-only |

Notes:
- "Voting enabled" means the card shows an upvote control that deep-links to the issue. "Read-only" means the vote count is shown but no upvote control, because the decision is already made (in-progress) or the work is done (shipped).
- A parked card without a rationale is a content error; the renderer surfaces it (see staleness, below) so it can be fixed.

## Label taxonomy

### Status labels (exactly one per public item)

- `status: considering`
- `status: in-progress`
- `status: backlog`
- `status: parked`
- `status: shipped` (used on closed issues)

An item with no status label is **not** shown publicly. An item with more than one status label is a content error; the renderer picks the first in the order above and flags the conflict.

### Workflow labels

- `needs-triage` applied automatically to new suggestions. Removed when a status is set.
- `enhancement` applied automatically to suggestions (GitHub default). Not used for placement.

### Descriptive labels (zero or more, free-form per team)

Anything not in the sets above is treated as a **tag** and may be shown as a pill on the card and used for filtering. Examples: `service: clinics`, `type: reporting`, `cymraeg`. Tag conventions are a team choice and live in config, not in code.

## Item lifecycle

```
                         (human triage)
 suggestion ──► needs-triage ──┬──► status: considering ──► status: backlog ──► status: in-progress ──► closed + status: shipped
 (issue form)   (hidden)       │            │                      │                    │
                               │            └──────────────────────┴────────────────────┴──► status: parked (with rationale)
                               │
                               └──► closed as "not planned"  (hidden, unless deliberately moved to parked)
```

- Movement is a human action: editing labels on the issue. The site reflects it at the next build.
- An item can move backwards (for example backlog to considering) if priorities change. The model imposes no one-way flow.
- Closing an issue as "completed" with `status: shipped` puts it in Recently shipped. Closing as "not planned" hides it, unless the team relabels it `status: parked` and adds a rationale, which is the honest way to say "we looked at this and decided against it, here is why".

## Ordering within each area

The build applies these rules. They must be covered by unit tests (see `specs/09`).

- **New ideas being considered**: upvotes descending, then newest first. Demand is the most useful signal at triage time.
- **In progress**: most recently updated first. Active work surfaces; anything drifting sinks, which pairs with the staleness signal.
- **Backlog**: the curated manifest order from `data/backlog-order.yml` first, in that exact sequence; then any remaining `status: backlog` items appended, upvotes descending. A config flag `backlog.sort: "curated" | "votes"` may switch the whole column to upvotes descending; default is `curated`.
- **Not being considered right now**: upvotes descending. This deliberately surfaces high-demand parked items, so that strong public demand for something the team has parked is visible and can prompt a rethink.
- **Recently shipped**: shipped date (issue closed date) descending. The view may be capped (config `shipped.limit`, default 12).

## The card model

The build normalises each eligible issue into this shape. This is the contract between the pipeline (`specs/07`) and the renderer (`specs/04`). Tests assert against it.

```jsonc
{
  "number": 14,                       // GitHub issue number
  "url": "https://github.com/ORG/REPO/issues/14",
  "status": "backlog",                // considering | in-progress | backlog | parked | shipped
  "title": {                          // see bilingual handling below
    "en": "Welsh-language SMS reminders by default",
    "cy": "Nodiadau atgoffa SMS Cymraeg yn ddiofyn"
  },
  "summary": {                        // first paragraph under the matching language heading
    "en": "Send reminders in a person's chosen language by default.",
    "cy": "Anfon nodiadau atgoffa yn iaith ddewisol y person yn ddiofyn."
  },
  "rationale": {                      // present only for parked items
    "en": "…",
    "cy": "…"
  },
  "tags": ["type: reminders", "cymraeg"],
  "votes": 41,                        // reactions["+1"] on the issue
  "createdAt": "2026-04-15T10:00:00Z",
  "updatedAt": "2026-06-22T14:00:00Z",
  "shippedAt": null,                  // issue closed_at, for shipped items
  "flags": []                         // content errors, e.g. ["multiple-status", "parked-without-rationale", "missing-welsh"]
}
```

### Bilingual content handling

Issue titles and bodies are free text authored by people, so the model needs a convention for two languages. The convention, which the suggestion form and contributor guidance encourage:

- Issue bodies use H2 section headings to separate languages: `## English` and `## Cymraeg`. Parked items add `## Decision` and `## Penderfyniad` for the rationale.
- The build extracts the first paragraph under each language heading as the summary for that language.
- If a language section is missing, the build falls back to the language that is present and records a `missing-welsh` or `missing-english` flag so the gap is visible and fixable. The user-facing card shows the available language with a small, accessible note that a translation is pending. Welsh is never silently dropped.
- Titles are single-line and often authored in one language. The build stores the title under the issue's primary language and reuses it for the other unless a bilingual title convention is configured. This is a known limitation; the spec prefers an honest "translation pending" note over a machine translation.

## Staleness and content health

The build computes health signals so the board cannot rot unnoticed. Thresholds live in config; defaults given.

- **In-progress staleness**: an in-progress item not updated for more than `health.inProgressStaleDays` (default 30) is flagged stale and shown with an accessible "last updated" indicator. This is a visible signal, not a hidden one, in line with the principle that delay is owned openly.
- **Triage backlog age**: the build reports (in its log and an optional badge for maintainers) how many `needs-triage` items exist and the age of the oldest, so the untriaged queue is not ignored.
- **Parked without rationale**: flagged as a content error.
- **Missing-language**: flagged as above.

Health flags are for the team and, where useful, surfaced subtly to users (a "last updated" date). They never block rendering.

## Configuration schema

Everything organisation-specific lives in one file (for example `config.json` or `config.yml`). The logic reads only from here; no team specifics are hard-coded. Minimum shape:

```jsonc
{
  "team": {
    "name": "Welsh Immunisation System",
    "organisation": { "en": "Digital Health and Care Wales", "cy": "Iechyd a Gofal Digidol Cymru" }
  },
  "github": { "owner": "ORG", "repo": "REPO", "featureTemplate": "feature_request.yml" },
  "branding": { "primary": "#005EB8", "primaryDark": "#003087" },
  "language": { "default": "en", "available": ["en", "cy"] },
  "labels": {
    "status": {
      "considering": "status: considering",
      "inProgress":  "status: in-progress",
      "backlog":     "status: backlog",
      "parked":      "status: parked",
      "shipped":     "status: shipped"
    },
    "needsTriage": "needs-triage"
  },
  "backlog": { "sort": "curated", "manifest": "data/backlog-order.yml" },
  "shipped": { "enabled": true, "limit": 12 },
  "health":  { "inProgressStaleDays": 30 },
  "data":    { "mode": "snapshot", "snapshotPath": "backlog.json" }
}
```

`data.mode` is `"snapshot"` (production, ADR-004) or `"client"` (the demo or low-traffic client-side mode). Renderer and pipeline both read this config so a fork is configured in one place.
