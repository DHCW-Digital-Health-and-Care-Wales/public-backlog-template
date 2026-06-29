# 09. Test plan

The specs are written to be testable. This file says how the acceptance criteria become automated tests, what tooling to use, and how to keep traceability. Tests are deterministic and run against `fixtures/issues.sample.json`; none of them call the network.

## Principles

- **Test first.** Write the test for an acceptance criterion before the code that satisfies it. Reference the criterion ID in the test name.
- **Deterministic.** The fixture is the single source of test data. The build script and the renderer both run against it offline. No live API calls in any test.
- **Fast and layered.** Most logic is covered by fast unit tests; a smaller number of end-to-end tests cover the assembled page and accessibility.

## Tooling

| Layer | Tool | Covers |
|-------|------|--------|
| Unit | Vitest | Normalisation (issue to card), label-to-status mapping, summary and rationale extraction, bilingual selection and fallback, vote count read, ordering and manifest logic, health flags, URL construction. |
| DOM / component | Vitest with jsdom (or Playwright component testing) | Card rendering, empty states, staleness indicator, accessible names, read-only vs interactive vote controls. |
| End to end | Playwright | Page structure, column order and placement, links, language toggle and URL reflection, filtering, no-JavaScript baseline, stale-snapshot behaviour. |
| Accessibility | @axe-core/playwright | Zero serious or critical violations across default, filtered and Welsh states; keyboard and focus checks. |
| Performance | Lighthouse CI | Performance and accessibility budgets on the built page. |
| Pipeline | Vitest (running the build script against the fixture) | Snapshot schema, curation gate, ordering, health summary, no-secret check, offline build. |

## Fixtures and test data

- `fixtures/issues.sample.json` is a representative GitHub Issues API payload covering: in-progress (#12, #9), considering (#21, #25), backlog (#14, #17, #19), parked with rationale (#7), shipped and closed (#30), an untriaged item that must be hidden (#33), and an issue closed as not planned that must be hidden (#5). It includes reaction counts, bilingual bodies, a parked decision section, and a multi-status-free design so placement is unambiguous.
- `data/backlog-order.example.yml` provides a curated order (17, 14, 19) deliberately different from vote order, so curated-versus-votes behaviour is testable.
- Tests that need edge cases (missing Welsh, missing English, multiple status labels, parked without rationale) construct small in-memory variants derived from the fixture rather than hitting the network.

## No-JavaScript and resilience tests

- Run the page in Playwright with JavaScript disabled and assert the four columns, cards, counts, issue links and suggestion links are present and correct (AC-BOARD-08, AC-NFR-08, AC-VOTE-07, AC-REQ-08).
- Serve a deliberately stale or absent `backlog.json` and assert the page still renders the last content with a staleness notice (AC-BOARD-15).
- Simulate a failing or rate-limited live refresh in client mode and assert snapshot counts remain and no error surfaces (AC-VOTE-08).

## Definition of done (per feature and overall)

A feature is done when:

- Every acceptance criterion for it passes as an automated test referencing its ID (manual-only criteria have a recorded, repeatable manual check).
- Accessibility checks show no new serious or critical violations.
- The no-JavaScript baseline for that feature holds.
- Welsh and English are both present and correct.
- Performance budgets still pass.
- No secret material appears in any client artefact.

## Traceability matrix

| Acceptance criteria | Primary test layer |
|---------------------|--------------------|
| AC-PIPE-01..08, 10, 11 | Pipeline (Vitest, build vs fixture) |
| AC-PIPE-09 | Manual (Action runs and failure behaviour) |
| AC-BOARD-03, 04, 05 | Unit (Vitest) |
| AC-BOARD-06, 11, 13 | DOM (Vitest/jsdom) |
| AC-BOARD-01, 02, 07, 08, 09, 10, 12, 15 | End to end (Playwright) |
| AC-BOARD-14 | Accessibility (axe) |
| AC-REQ-01, 02, 08 | End to end (Playwright) |
| AC-REQ-03, 04, 06 | Unit (Vitest) |
| AC-REQ-05 | Manual (GitHub form behaviour) |
| AC-REQ-07 | Accessibility (axe) |
| AC-VOTE-01, 05, 06 | Unit (Vitest) |
| AC-VOTE-02, 04 | DOM (Vitest/jsdom) |
| AC-VOTE-03, 07, 08 | End to end (Playwright) |
| AC-VOTE-09 | Accessibility (axe) |
| AC-NFR-01 | Accessibility (axe) |
| AC-NFR-03, 04, 07 | Unit/DOM (Vitest) |
| AC-NFR-05, 08, 09 | End to end (Playwright) |
| AC-NFR-02, 06, 10 | Manual / Lighthouse CI |

Keep this matrix current as criteria are added or changed. A criterion without a corresponding test is a gap, and a test without a criterion is either dead or a missing criterion.
