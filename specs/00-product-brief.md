# 00. Product brief

## Vision

A public backlog and roadmap that any of our teams can stand up in a day by forking it, so that the work we do with public money is visible, our priorities are open to challenge, and the people who use and depend on our services can shape them. It should be good enough that other public sector organisations want to copy it.

## The problem it solves

Our strategies, code and blogs are already public, but the thread between them is broken: people can see what we said we would do and what we shipped, but not what we are doing now, what is queued, or what we have decided against. That gap costs us feedback, repeats the same "are you doing X?" questions, and makes our delivery look less mature than it is. Publishing the backlog and roadmap closes the gap and, in our experience and the wider evidence, improves recruitment, supplier conversations, peer collaboration and stakeholder trust.

## Who it is for

- **The public and service users**, who want to see what is coming and raise things that matter to them.
- **Partners and peer teams** across NHS Wales and the wider public sector, who may be solving the same problem and want to collaborate or reuse.
- **Suppliers**, who can see where help is wanted.
- **Our own teams and leadership**, for whom the open board is a forcing function for honest, current prioritisation.
- **Other product teams who fork it**, who need it to be generic and easy to rebrand.

## Jobs to be done

- See, at a glance, what is being considered, what is in progress, what is queued and in what order, and what is not being pursued and why.
- Suggest a new idea without friction and without needing to email anyone.
- Signal support for an existing idea, and see how much support each idea has.
- Follow an item and be told when it moves.
- For the team: curate the public view, set priority in the open, and keep it current with little overhead.

## Scope

In scope:

- A single static public page showing four areas: ideas being considered, in progress, backlog (priority-ordered), and not being considered right now.
- A suggestion route that creates a GitHub issue from a structured form.
- Upvoting of items, surfaced as a visible signal.
- An optional, recommended fifth view of recently shipped items, to close the loop.
- Bilingual Welsh and English throughout.
- A build pipeline that snapshots GitHub Issues so the site stays static and fast.
- A configuration file that holds everything organisation-specific.

Out of scope (for the first version):

- Anonymous, account-free voting (see `specs/02`, ADR-003, for why and what it would cost).
- In-page comment threads (comments live on the GitHub issue).
- Authentication, user accounts, or any personal data capture on the site itself.
- Internal-only roadmap detail, dates, or anything not suitable for public view.

## Non-goals

- It is not a project management tool. GitHub Issues and Projects remain the team's working surface; this is the public window onto a curated subset of it.
- It is not a popularity contest. Votes inform prioritisation; they do not set it.
- It is not a promise of dates. The columns communicate confidence, not deadlines.

## Success measures

The site is successful if, after launch:

- Suggestions arrive through it without prompting, and a meaningful share come from outside the team.
- Items accrue upvotes, giving the team a real demand signal.
- The board is current: no item sits in "In progress" untouched for longer than the staleness threshold without an update (see `specs/03`).
- At least one other team forks and ships its own instance.
- Accessibility and bilingual obligations are met in full, evidenced by passing automated checks and a published accessibility statement.
