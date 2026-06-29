# Public backlog

A DHCW template for publishing a product backlog in the open. It is a public, accessible, bilingual website that shows people what a team is considering, what it is building, what is queued, and what it has decided against, sourced from GitHub Issues, with upvoting and a route to suggest new ideas. Any DHCW team can fork it and make it their own.

Built on the DHCW Design System V2, Digital Health and Care Wales (Iechyd a Gofal Digidol Cymru), hosted free on GitHub Pages, with no backend and no tracking.

**About this template.** It ships with example items so the layout renders with something in it. Replace them with your own work, or point it at your repository's Issues. See [Fork this for your team](#fork-this-for-your-team).

## Why a public backlog

Publishing a backlog in the open invites feedback, makes our priorities visible and open to challenge, reduces repeated "are you doing X?" questions, and keeps us honest about what we are and are not doing. Two principles shape how it behaves:

- **Votes are a signal, not a verdict.** We show how much support each idea has and take it seriously, but prioritisation stays a deliberate decision by the team.
- **We curate, we do not dump.** Items appear only after a person has triaged them, so the public view stays clear, useful and safe.

## What the public sees

The backlog has four areas, graded by how committed the work is. The further an item is from "In progress", the less certain it is.

- **New ideas being considered.** Recent ideas we are weighing up. Not yet committed.
- **In progress.** Work we are actively building.
- **Backlog.** The queue, ordered by priority. Each item shows how much support it has.
- **Not being considered right now.** Things we have looked at and decided against for the time being, with a short reason. We show these so our thinking is open and so expectations are clear.

An optional **Recently shipped** view closes the loop by showing what has been delivered.

Every item links to its discussion on GitHub, where people can read more, comment and upvote.

## Suggest a feature

Anyone can suggest an idea using the button on the page. It opens a short, bilingual form and creates a public GitHub issue. New suggestions are reviewed by the team before they appear on the board, which usually takes a few working days. The form asks people not to include personal or confidential information.

## Upvoting

Upvoting uses GitHub's thumbs-up reaction on the issue behind each item. The board reads and shows the count, and the upvote button takes you to the issue to add your reaction. Being plain about how it works:

- You need a free GitHub account to vote.
- Your vote is registered on GitHub, and each account counts once.
- Counts inform prioritisation. They do not decide it.

This keeps voting resistant to spam and means there is no separate vote store to build or look after, which matters for information governance.

## How it works

GitHub Issues are the source of truth. Issues carrying a `status:` label are picked up; a scheduled GitHub Action snapshots them at build time, applies the team's priority order, and writes static files that the site serves. The browser never calls the GitHub API directly and never holds a token. The result is a fast, static site with no backend, no database, and nothing to consent to.

The authoritative requirement and the design decisions behind all of this are in `specs/`, with build guidance in `CLAUDE.md`.

## Fork this for your team

This repository is built to be reused. Any DHCW team can fork it to publish its own backlog in the open, on the same accessible, bilingual, DHCW-branded foundation.

### What you get

- A static site, with no backend to run or secure, built with Vite, React, TypeScript and Tailwind.
- The DHCW Design System V2 look and feel, consistent with the directorate's roadmap.
- A bilingual Welsh and English structure, an accessibility statement and a privacy note, all in place.
- A GitHub Action that keeps the board in step with your Issues.

### Before you start

Node.js 20, npm, and a GitHub repository with Issues enabled.

### Steps

1. **Fork or copy** this repository into your team or organisation.
2. **Configure it.** In the configuration file, set your team and organisation name, your GitHub owner and repository, your default language, and any branding you need. The DHCW design tokens live in `tailwind.config.js`; keep them, and change a token only if your team has a genuine reason to.
3. **Set up your labels.** Add `status: considering`, `status: in-progress`, `status: backlog`, `status: parked` and `status: shipped` to your repository, plus `needs-triage` for new suggestions. Only labelled issues appear on the board (see [Labels](#labels)).
4. **Set your priority order.** The Backlog area renders in the order listed in `data/backlog-order.yml`, which you edit in a pull request. Anything not listed is added afterwards, ordered by upvotes.
5. **Tailor the suggestion form.** Edit `.github/ISSUE_TEMPLATE/feature_request.yml` to suit your service.
6. **Turn it on.** In Settings -> Pages, set the source to GitHub Actions. The included workflows build and publish the site, and refresh the snapshot from your Issues on a schedule and whenever issues change.
7. **Update the placeholders.** Complete the accessibility statement, the contact route and the review date, and the privacy note, before you publish.

### What you must keep

These are obligations and DHCW conventions, not preferences:

- **WCAG 2.2 AA.** As a Welsh public sector website it must be accessible. Keep the semantic structure, keyboard support, contrast, and status conveyed in text rather than by colour alone.
- **The bilingual structure.** Welsh must be treated no less favourably than English. Keep the language-keyed content and the language toggle, and fill in the Welsh as translations are ready.
- **The curation gate.** Only triaged, labelled issues are public, so suggestions are reviewed before they appear. Do not remove this.
- **No third-party tracking.** No tracking cookies and no third-party analytics, so there is nothing to consent to. Self-host fonts rather than calling a font service.
- **House style in interface copy.** British English. No em dashes. No exclamation marks.

If your team would like help getting started, open an issue on this repository or get in touch with the PCMH product and delivery team.

## Labels

The board is driven by labels on your Issues. A new suggestion arrives as `needs-triage` and stays off the public board until someone gives it a status.

| Label | Where it appears |
| --- | --- |
| `status: considering` | New ideas being considered |
| `status: in-progress` | In progress |
| `status: backlog` | Backlog, in your curated order |
| `status: parked` | Not being considered right now (add a short reason in the issue) |
| `status: shipped` | Recently shipped (on a closed, completed issue) |
| `needs-triage` | Nowhere public yet; flags a new suggestion for review |

Any other labels are shown as tags on the card and can be used to filter the board.

## Keeping it current

A stale board loses trust, so the design makes staleness visible rather than hiding it. In-progress items that have not moved for a while show a "last updated" date. The build refreshes vote counts and item movements on a schedule and when issues change, so the public view keeps pace with the real picture.

## Running and building locally

Requires Node.js 20 and npm.

```bash
npm install      # install dependencies
npm run dev      # start the development server
npm run build    # type-check and build for production into dist/
npm run preview  # preview the production build locally
npm run test     # run the unit and DOM test suite (Vitest)
npm run test:e2e # run end-to-end and accessibility tests (Playwright, axe)
npm run lhci     # run the Lighthouse performance and accessibility budgets
npm run lint     # run ESLint
```

The data build can run against the sample data in `fixtures/` with no network access, so you can develop and test offline.

## Project structure

```
specs/                     The authoritative requirement and the design decisions.
CLAUDE.md                  Build guidance for the implementation.
src/                       The application: components, data layer and bilingual helpers.
tailwind.config.js         DHCW design tokens: colours, Roboto, spacing and the card style.
data/backlog-order.yml     Your curated priority order for the Backlog area.
fixtures/                  Sample Issues data for offline development and tests.
.github/ISSUE_TEMPLATE/    The suggestion form.
.github/workflows/         Build, deploy and snapshot workflows.
```

## Design and conventions

The look and feel follows the DHCW Design System V2 and is consistent with the directorate's roadmap.

- **Type:** Roboto, the DHCW digital interface font, self-hosted. Rubik is the document font and is not used here.
- **Colour:** the DHCW palette as design tokens in `tailwind.config.js`. Body text meets 4.5:1 contrast.
- **Copy:** British English, with no em dashes and no exclamation marks.

## Accessibility and privacy

- We aim to meet WCAG 2.2 AA. See the accessibility statement on the site.
- The site sets no tracking cookies, uses no third-party analytics, and self-hosts its fonts, so there is nothing to consent to. See the privacy note on the site.

## Licence

- **Code:** MIT
- **Content:** Open Government Licence v3.0
