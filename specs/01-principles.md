# 01. Principles

These are the non-negotiables. They constrain every decision in the specs that follow. If a later spec appears to conflict with one of these, the principle wins and the spec is wrong.

## Legal and statutory

1. **Bilingual by right, not by favour.** As a Welsh public body the Welsh language must be treated no less favourably than English (Welsh Language (Wales) Measure 2011 and the Welsh Language Standards). Both languages are first-class across content, interface and form. Welsh is never a delayed translation or a smaller font.
2. **Accessible by law.** Meet WCAG 2.2 level AA (Public Sector Bodies (Websites and Mobile Applications) Accessibility Regulations 2018). Publish and keep current an accessibility statement.
3. **Data protection by design.** Capture no personal data on the site. The suggestion form warns people not to include personal or confidential information. No tracking that processes personal data without a lawful basis and a notice.

## Ethical and editorial

4. **Tell the whole truth.** A public backlog that hides hard realities erodes trust faster than no backlog. If something is stuck, say so. The "Not being considered right now" area exists precisely so that honesty has somewhere to live.
5. **Curate, do not dump.** Not every raw suggestion belongs on the public board. Items appear only after a human has triaged them. This protects signal, dignity and safety.
6. **Votes are a signal, not a verdict.** Demand is shown and taken seriously, but prioritisation remains a deliberate act by an accountable team. Design must not let a vote count silently override editorial judgement.
7. **Close the loop.** When an item moves or ships, the people who engaged with it should be able to find out. Prefer mechanisms that notify without extra manual effort.
8. **Keep it current or take it down.** A stale board is worse than none. The design must make staleness visible and cheap to fix.

## Technical

9. **Static, with no backend and no new data store.** The site is hosted on GitHub Pages and serves static files. Data is produced at build time from GitHub Issues. Introducing a server, database, or third-party service is a governed decision with real information-governance cost, not a default.
10. **Open by default.** Open source, open standards, documented, and reusable. Aligns with the Technology Code of Practice and the Digital Service Standard for Wales.
11. **Progressive enhancement.** The four areas and their items are present in the served HTML and readable with no JavaScript. JavaScript enhances; it is never required to read the backlog.
12. **No secrets in the client.** The browser never holds credentials. Automation uses the least-privilege built-in token.
13. **Forkable and generic.** Nothing organisation-specific in the logic. One configuration file holds names, branding, language strings and repository details. A fork should ship by editing config alone.
14. **Small and durable.** Minimal dependencies, a tiny JavaScript footprint, and no reliance on a single vendor beyond GitHub itself. Favour boring, long-lived technology a future maintainer will thank you for.
