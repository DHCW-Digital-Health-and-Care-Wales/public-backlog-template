# 06. Feature: upvoting

Upvoting uses GitHub's 👍 reaction on the backing issue as the vote (ADR-003). The site reads the count and displays it, and the upvote control sends the person to the issue to register their reaction. There is no vote store on the site.

## User stories

- As a visitor, I can see how much support each idea has, so that I can gauge demand and feel that my own support would count.
- As a visitor, I can add my support to an idea, so that the team sees it matters to me.
- As the team, I get a real, spam-resistant demand signal without building or governing a vote store.

## Behaviour

- Every eligible card shows an upvote count, taken from `reactions["+1"]` on the issue in the build snapshot.
- Cards in New ideas, Backlog and Not being considered show an **upvote control**. Cards in In progress and Recently shipped show the **count only** (read-only), because the decision is made or the work is done.
- The upvote control links to the issue. Because GitHub has no URL that adds a reaction directly, the control takes the person to the issue, where they click 👍. The control's accessible label and adjacent helper text explain this in plain language, in the active language, including that a GitHub account is needed.
- The displayed count is as fresh as the last build snapshot. Optionally, if `data.mode` permits and the visitor has JavaScript, the count may be refreshed live for visible cards via a single batched API call, with the snapshot value shown first so nothing blocks on the network. Live refresh is an enhancement and must degrade silently if it fails or is rate limited.
- Counts and ordering never imply the item will be built. The explainer states that votes are a signal the team weighs, not an automatic decision (consistent with `specs/02` ADR-002).

## Honest limitations stated to users

The card or explainer states, in plain language and bilingually, that: voting needs a free GitHub account; the vote is registered on GitHub; and each account counts once. These are presented matter-of-factly, not as an apology.

## Acceptance criteria

- **AC-VOTE-01** `[unit]` Each card's vote count equals the `+1` reaction count for its issue in the snapshot (for example #14 shows 41, #21 shows 34, #19 shows 8). Other reaction types do not affect the count.
- **AC-VOTE-02** `[dom]` Cards in New ideas, Backlog and Not being considered render an interactive upvote control; cards in In progress and Recently shipped render the count without an interactive control.
- **AC-VOTE-03** `[e2e]` The upvote control links to the backing issue at the correct URL.
- **AC-VOTE-04** `[dom]` The upvote control has an accessible name, in the active language, that conveys the action and that it opens the issue on GitHub; helper text notes a GitHub account is required.
- **AC-VOTE-05** `[unit]` Votes are read through a single abstraction (one function or module) so the source could be swapped without touching the renderer (the seam required by ADR-003).
- **AC-VOTE-06** `[unit]` New ideas and Not being considered columns sort by vote count descending (shared with AC-BOARD-05), proving the count feeds ordering as a signal.
- **AC-VOTE-07** `[e2e]` Vote counts are present and correct with JavaScript disabled, because they come from the pre-rendered snapshot.
- **AC-VOTE-08** `[e2e]` If live refresh is enabled and the API call fails or is rate limited, the snapshot counts remain displayed and no error is shown to the user.
- **AC-VOTE-09** `[a11y]` Upvote controls are keyboard operable, have visible focus, and meet contrast requirements; the count is announced meaningfully to assistive technology (for example "41 people support this", not a bare number).
