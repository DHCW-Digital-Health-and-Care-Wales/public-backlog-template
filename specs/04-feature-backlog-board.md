# 04. Feature: the backlog board

The public page that renders the four areas (and the optional Recently shipped view) from the build snapshot.

## User stories

- As a member of the public, I can see at a glance what is being considered, what is in progress, what is queued and in what order, and what is not being pursued, so that I understand where the service is heading.
- As a stakeholder, I can read why a parked item is parked, so that I do not have to ask.
- As any visitor, I can read the board with no JavaScript, on a phone, and with a screen reader, so that the information is genuinely public.
- As a visitor, I can filter the board by tag and switch language, so that I can find what is relevant to me.

## Behaviour

- The page renders four columns in the fixed order: New ideas being considered, In progress, Backlog, Not being considered right now. If `shipped.enabled` is true, a Recently shipped view follows.
- Each column shows its title in the active language, a one-line description of what the column means, and its cards in the order defined in `specs/03`.
- Each card shows: title, summary, tags (as non-interactive pills), an upvote count, and, where voting is enabled, an upvote control (see `specs/06`). Parked cards also show the rationale. Cards link to their issue for discussion.
- The columns and cards are present in the served HTML (pre-rendered at build time). JavaScript enhances with filtering, language switching and optional live count refresh, but is not required to read the board.
- An "About this board" explainer is present, stating what each area means and that votes are a signal the team considers, not an automatic decision.
- A prominent "Suggest a feature" affordance appears in the page header and as the first item in the New ideas column (see `specs/05`).
- Empty columns show a plain-language empty state, not a blank space.
- Stale in-progress items show an accessible "last updated" indicator (see `specs/03`).

## Acceptance criteria

Each is tagged with how it is verified: `[unit]`, `[dom]`, `[e2e]`, `[a11y]`, `[manual]`.

- **AC-BOARD-01** `[e2e]` The page renders exactly four primary columns, titled and in the order: New ideas being considered, In progress, Backlog, Not being considered right now.
- **AC-BOARD-02** `[e2e]` When `shipped.enabled` is true, a Recently shipped view is rendered after the four columns; when false, it is absent.
- **AC-BOARD-03** `[unit]` Given the sample fixture, each issue is placed in the column matching its status label, and issues with no status label (for example #33) and issues closed as not planned (for example #5) do not appear in any column.
- **AC-BOARD-04** `[unit]` The Backlog column renders manifest-listed items first in manifest order (17, 14, 19 for the example manifest), then any remaining backlog items by votes descending. Switching `backlog.sort` to `votes` orders the whole column by votes descending (14, 17, 19).
- **AC-BOARD-05** `[unit]` New ideas are ordered by votes descending then newest first; Not being considered is ordered by votes descending; In progress is ordered by most recently updated first; Recently shipped is ordered by shipped date descending and capped at `shipped.limit`.
- **AC-BOARD-06** `[dom]` Each card shows title, summary, its tags as pills, and a vote count. Parked cards additionally show a rationale; a parked card lacking a rationale renders a visible content-error state rather than an empty rationale.
- **AC-BOARD-07** `[e2e]` Each card links to its GitHub issue at the correct URL.
- **AC-BOARD-08** `[e2e]` With JavaScript disabled, all four columns and their cards are present and readable, and every card's issue link works.
- **AC-BOARD-09** `[e2e]` An "About this board" explainer is present and states that votes inform but do not decide prioritisation.
- **AC-BOARD-10** `[e2e]` A "Suggest a feature" control is present in the header and as the first entry in the New ideas column, and both point to the correct new-issue URL (see `specs/05`).
- **AC-BOARD-11** `[dom]` An empty column renders a plain-language empty state.
- **AC-BOARD-12** `[e2e]` Filtering by a tag shows only cards carrying that tag across all columns, and clearing the filter restores all cards. Filtering is an enhancement; with JavaScript disabled the full board is shown.
- **AC-BOARD-13** `[dom]` An in-progress item whose `updatedAt` is older than `health.inProgressStaleDays` shows an accessible "last updated" indicator.
- **AC-BOARD-14** `[a11y]` The page passes automated accessibility checks (see `specs/08`/`specs/09`) with zero serious or critical violations in the default and filtered states.
- **AC-BOARD-15** `[e2e]` When the snapshot is missing or older than a configured freshness window, the page still renders the last available content and shows a staleness notice (see `specs/07`).
