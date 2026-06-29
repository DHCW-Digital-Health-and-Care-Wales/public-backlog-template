# 05. Feature: suggest a feature (request an item)

The route by which anyone can propose a new item. It creates a GitHub issue from a structured, bilingual form, and that issue enters the lifecycle at `needs-triage` (hidden until triaged).

## User stories

- As anyone, I can suggest an idea in a few fields without emailing anyone or creating an account on this site, so that contributing is low friction.
- As a contributor, I am told my suggestion will be public and reviewed before it appears, so that I know what to expect and what not to include.
- As the team, suggestions arrive as well-formed issues with consistent fields, pre-labelled for triage, so that they are easy to process.

## Behaviour

- The suggestion control appears in the page header and as the first entry in the New ideas column. Both lead to GitHub's new-issue page pre-selecting the form template.
- The form is the GitHub issue form at `.github/ISSUE_TEMPLATE/feature_request.yml` (already provided). It is bilingual, asks for the problem, who it affects, an optional idea, an optional measure of success, and time sensitivity, and requires the contributor to confirm there is no personal or confidential information.
- A new submission is labelled `enhancement` and `needs-triage` automatically and does not appear on the public board until a human assigns a `status:` label (curation gate, `specs/02` ADR-006).
- The link is built from config: `https://github.com/{owner}/{repo}/issues/new?template={featureTemplate}`. If owner or repo are unset (a fresh fork), the control links to the generic new-issue page and the page shows a configuration notice.
- The site captures no form data itself. All capture is on GitHub.

## Acceptance criteria

- **AC-REQ-01** `[e2e]` The suggestion control in the header links to `https://github.com/{owner}/{repo}/issues/new?template=feature_request.yml` using the configured owner and repo.
- **AC-REQ-02** `[e2e]` The suggestion control also appears as the first entry in the New ideas column and links to the same URL.
- **AC-REQ-03** `[unit]` The new-issue URL is constructed from config; changing owner, repo or template name changes the URL accordingly, and the template name is URL-encoded.
- **AC-REQ-04** `[unit]` When owner or repo are unset, the control falls back to the generic `…/issues/new` URL and the page exposes a configuration notice.
- **AC-REQ-05** `[manual]` The issue form renders on GitHub with all specified fields, the required confirmation checkbox blocks submission until ticked, and a submitted issue carries the `enhancement` and `needs-triage` labels.
- **AC-REQ-06** `[unit]` An issue carrying `needs-triage` and no `status:` label is excluded from every public column (shared with AC-BOARD-03).
- **AC-REQ-07** `[a11y]` The suggestion controls are reachable and operable by keyboard, have discernible accessible names in the active language, and meet contrast requirements.
- **AC-REQ-08** `[e2e]` Both suggestion controls are present and correct with JavaScript disabled (they are ordinary links).
