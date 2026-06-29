# 02. Analysis and architecture

This is the reasoning behind the design. It draws on the case for public backlogs, on how the strongest public and private examples work, and on the specific constraints of hosting on GitHub Pages for a Welsh NHS body. Read it before building. The decisions at the end (ADRs) are binding unless a new decision supersedes them.

## What the evidence says

### Working in the open pays off, but only if the story is coherent

Ross Ferguson's case for public backlogs and roadmaps (Public Digital, 2024) is the anchor. The argument is not abstract transparency for its own sake; it is that an open backlog and roadmap fill the gap between a published strategy and shipped code, and that doing so yields concrete delivery benefits: better feedback, owning your narrative, visibility, attracting talent, and trust. He reports that opening his backlogs over the years helped recruit people who could study the work, signalled to suppliers what support was wanted, prompted peer teams to make contact, and forced bolder, honester conversations with stakeholders. He is candid about why teams stall: boards get too complex when granular roadmaps are merged; they stop telling the whole truth when they would expose debt or immaturity; they are not worked hard enough to earn engagement; they fall out of the delivery cadence and go stale; and comms or executives get nervous about creating expectations.
Source: Public Digital, "Filling in the gaps: the case for public backlogs and roadmaps", https://public.digital/pd-insights/blog/2024/07/filling-in-the-gaps-the-case-for-public-backlogs-roadmaps

Two design consequences follow directly. First, keep the board simple and singular, not a merge of every team's detail. Second, build the "whole truth" in as a first-class feature, which is exactly what the "Not being considered right now" area is for, and make staleness visible so the board cannot rot unnoticed.

### The exemplars cluster into two patterns

The public sector examples Ferguson cites split cleanly. The **roadmaps** are bespoke published pages (NHS.UK, GOV.UK Pay, Search.gov). The **backlogs** are GitHub, specifically GitHub Projects boards on the organisation (GOV.UK Design System, Notify.gov, Ministry of Justice Operations Engineering). The private sector examples (Microsoft 365, GitHub's own roadmap, Climate Policy Radar) are a mix of bespoke pages and GitHub Projects.

The lesson is that GitHub is already the accepted substrate for public backlogs in this community, which suits a team that lives in GitHub. But a raw Projects board cannot be branded, cannot be made properly bilingual, and cannot show a curated, voteable, public-friendly view. So the right move is to keep GitHub Issues as the source of truth and render a branded, bilingual, accessible view on top, rather than point the public at a Projects board.

### Feature-voting portals show what "good" looks like, and where the traps are

The SaaS feedback-portal class (Canny, Featurebase, Quackback, Buffer's public board, and others) has converged on a set of practices worth importing:

- **Confidence-graded columns.** Mature roadmaps label certainty explicitly, give "Now"-type items full detail and "Later"-type items a single sentence, and review and move items on a regular cadence. The columns communicate commitment, not dates.
  Source: "8 Product Roadmap Best Practices", https://www.aakashg.com/product-roadmap-best-practices/
- **Every item linked to its demand.** The most effective public roadmaps show people that their feedback shaped the work; linking a roadmap item to its source request and vote count makes voters feel heard.
  Source: Quackback, "Best Public Roadmap Tools", https://quackback.io/blog/best-public-roadmap-tools
- **A visible explainer and an easy way to submit.** Good boards carry a "how does this board work?" note so statuses are not ambiguous, and they put a "submit your own idea" affordance in the first column, because if submitting is not in easy reach people give up.
  Source: Canny, "Public product roadmap examples", https://canny.io/blog/public-product-roadmap-examples/
- **Curate what is public, and never publish a board full of things that never ship.** Internal infrastructure and sensitive work stay off the public view.
  Source: Quackback, as above.
- **Staleness kills trust.** If an item sits in "In progress" for months, people lose faith in the whole board; the remedy is a regular review cadence and openness about delay rather than silence.
  Source: Quackback, as above.
- **Voting is one input, not the decision engine.** The healthiest teams treat votes as a signal among several.
  Source: Gleap, "Best Product Roadmap Tools with Feature Voting", https://www.gleap.io/blog/best-product-roadmap-tools-feature-voting-2026
- **Close the loop with a changelog and notifications.** Telling people when their item ships turns the board into a trust and retention tool.
  Sources: Quackback and Canny, as above; Buffer, "Introducing Our New Roadmap", https://buffer.com/resources/transparent-product-roadmap-v2/

These practices are baked into the specs: confidence-graded columns, votes shown on every eligible card, an explainer, a prominent suggest affordance, a curation gate, a visible staleness signal, and loop-closing via GitHub's native subscription notifications plus an optional "Recently shipped" view.

### Upvoting on a static host: GitHub reactions are the native answer

GitHub Pages cannot run server code, so there is no obvious place to store votes. The resolution is that the votes already exist. GitHub's own feature-request process treats the 👍 reaction as the upvote: people thumbs-up a request, and more reactions mean more attention. Reaction counts are available through the REST API on the issues endpoint, so the site can read and display them. This is a widely used pattern (caniuse, CKEditor and many others rely on reaction counts to gauge demand), and GitHub itself documents thumbs-up as the way to upvote a request.
Sources: GitHub Community, "Feature: Voting up issues", https://github.com/orgs/community/discussions/17119 ; GitHub Community feedback guidance, https://github.com/orgs/community/discussions/68444

The honest limitations, which the spec states plainly to users: voting requires a GitHub account, the vote is registered on github.com rather than on our page, there is one vote per account with no weighting, and the unauthenticated API is rate limited. For an audience of staff, partners and digitally engaged contributors these are acceptable. For account-free public voting you would need a data store, which is a different and heavier proposition (ADR-003).

## Architecture decision records

### ADR-001: Static site on GitHub Pages, sourced from GitHub Issues

**Context.** We need a branded, bilingual, accessible public backlog, owned by a team that already works in GitHub, for an NHS body with strict information-governance expectations.

**Options.**
- (a) Point the public at a GitHub Projects board. Zero build, but unbrandable, not bilingual, not curated for a public audience, poor accessibility control.
- (b) Use a hosted SaaS feedback portal (Canny, Featurebase, Quackback, etc). Excellent features out of the box, but a third-party processor and data store, recurring cost, and an information-governance and procurement burden. Not reusable as an open template.
- (c) A custom application with a backend. Full control, but a server to run, secure, patch and govern, for what is essentially a read-mostly public page.
- (d) A static site on GitHub Pages that renders a curated view of GitHub Issues.

**Decision.** Option (d). Issues remain the source of truth; the site is a static, branded, bilingual rendering of a curated subset.

**Consequences.** No backend to run or secure. No new data store to govern. Free hosting. Fully forkable as an open template. The cost is that anything dynamic (votes, live counts) must be handled within the static constraint, which ADR-003 and ADR-004 address.

### ADR-002: The backlog is curated; votes are a signal shown alongside

**Context.** The "Backlog" area must be ordered by priority. Prioritisation is an accountable team decision, but demand should be visible. Best practice warns against letting votes become the decision engine.

**Options.**
- (a) Sort the backlog by vote count. Transparent and zero-maintenance, but turns prioritisation into a popularity contest and is gameable.
- (b) Maintain order in GitHub Projects. Good UX internally, but the Projects v2 ordering is awkward to read via the API and pulls us back towards exposing Projects.
- (c) Maintain a small ordering manifest in the repository that lists backlog issue numbers in priority order; render in that order; show vote counts on each card as a signal.

**Decision.** Option (c), with votes displayed prominently but not used as the default sort. Backlog items not present in the manifest are appended in vote order so nothing is hidden by omission. A configuration flag may switch the whole backlog to vote-order for teams that want it, but curated order is the default and the recommended mode.

**Consequences.** Prioritisation stays a deliberate, accountable act, made in the open and reviewable in a pull request (which suits a working-in-the-open, GitOps culture). The manifest is a little maintenance, but it is cheap, diffable and honest. See `data/backlog-order.example.yml`.

### ADR-003: Upvoting uses GitHub 👍 reactions, not a third-party vote store

**Context.** We want upvoting, on a static host, for an NHS body.

**Options.**
- (a) GitHub 👍 reactions on the backing issue, read via the API, displayed as the vote count, with the upvote control deep-linking to the issue.
- (b) A third-party or self-hosted vote store (a serverless counter, or a tool such as a self-hosted Fider) to allow account-free voting.

**Decision.** Option (a) for the first version. Option (b) is explicitly deferred.

**Consequences of (a).** No backend, no data store, no information-governance burden, spam resistance via GitHub identity, durable counts tied to the source of truth, and free update notifications when voters subscribe to an issue. The accepted limitations (GitHub account required, vote registered on github.com, one unweighted vote per account, API rate limits handled by ADR-004) are stated to users in plain language.

**Why (b) is deferred.** Account-free voting means storing and processing input from the public, which for an NHS Wales service brings a data-protection impact assessment, a lawful basis and notice, data-residency questions, and bot and abuse mitigation, plus ongoing operations. That is a significant undertaking for marginal benefit over (a) and is out of scope for the first version. The architecture leaves a clean seam: the vote count is read through a single function, so a different source could be substituted later behind the same interface.

### ADR-004: Data is produced at build time, and the page is pre-rendered

**Context.** Reading the GitHub API directly from each visitor's browser is rate limited to roughly 60 requests per hour per IP when unauthenticated, would make the page slow and dependent on a live call, and would leave nothing for a no-JavaScript user or a crawler to read.

**Options.**
- (a) Call the API from the browser on each visit, with a cached fallback.
- (b) A scheduled GitHub Action queries the API (authenticated, higher limits), normalises the issues into a snapshot, applies the curated order, and writes static artefacts (a `backlog.json` data file and pre-rendered HTML) that the Pages site serves. The page reads same-origin static files and never calls the API at request time.

**Decision.** Option (b) is the production architecture. A lightweight client-side mode (a) may exist behind a config flag for demos or very low-traffic forks, with graceful fallback to the last snapshot.

**Consequences.** No per-visitor rate limit, fast loads, resilient to API outages (serves the last good snapshot with a staleness notice), good for crawlers, and a baseline that works with JavaScript off because the columns are pre-rendered into the HTML. Freshness is bounded by the Action's cadence (for example every 15 to 30 minutes, plus on issue events), which is ample for a backlog. JavaScript then enhances the pre-rendered page with filtering, language switching and an optional live count refresh.

### ADR-005: Four confidence-graded areas, plus an optional shipped view

**Context.** The brief specifies four areas: new ideas being considered, in progress, backlog (priority-ordered), and not being considered right now. The common public-sector roadmap format is Now / Next / Later.

**Decision.** Use the four specified areas. They map better to a feedback-and-delivery model than Now / Next / Later: they separate undecided ideas from the committed queue, and they make space for honest "not now" decisions, which Now / Next / Later lacks. The areas are confidence-graded in the same spirit as Now / Next / Later: the further from "In progress", the less certain.

**Recommendation, not imposed.** Add an optional, default-on "Recently shipped" view (closed issues labelled shipped). Best practice is clear that closing the loop on delivered work is where roadmaps build the most trust, and omitting it leaves a visible gap at the end of the story. It is specified as optional so the four-area brief is honoured, but it is recommended on.

**Consequences.** The information architecture in `specs/03` defines all four areas precisely, plus the optional shipped view, and grades detail by column (full detail for in-progress and backlog, a sentence or two for considering, a sentence plus a rationale for parked).

### ADR-006: A curation gate

**Context.** Anyone can open an issue. Not everything should appear on a public NHS board.

**Decision.** Only issues carrying a `status:` label appear on the public board. A fresh suggestion is labelled `needs-triage` and is invisible to the public until a human assigns it a status. Items closed as "not planned" do not appear unless deliberately moved to the parked area with a rationale.

**Consequences.** Spam, duplicates, abusive content and obvious non-starters never reach the public view. The cost is that the team must triage; the staleness signal in `specs/03` includes a triage-age check so the untriaged queue cannot be ignored indefinitely.
