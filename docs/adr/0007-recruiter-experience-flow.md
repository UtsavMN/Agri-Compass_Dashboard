# ADR-0007: Recruiter Experience Flow

## Context
The primary audience for this showcase is engineering recruiters and hiring managers who evaluate the project within the first 60 seconds.

## Decision
We aggressively optimize the homepage flow to: Hero -> Problem -> Solution -> Architecture -> Impact.
Additionally, the GitHub repository, Live Demo, and Tech Stack (React, Three.js, TypeScript) must be immediately visible without requiring scrolling past the fold or digging into menus.

## Alternatives Considered
- **Standard feature-first flow:** Fails to tell the engineering story of *why* the product was built.
- **Hiding links in the footer:** Increases the bounce rate for technical evaluators.

## Engineering Trade-offs
- Modifying the narrative requires careful rebalancing of the 3D scroll triggers so the Earth and Tree align properly with the new section order.

## Performance Impact
- None.

## Consequences
- The Navbar and Hero sections must remain uncluttered while explicitly surfacing technical credentials.

## Related Handbook Chapters
- `31_PORTFOLIO_RECRUITER_GUIDE.md`
- `30_DASHBOARD_STORYTELLING.md`

## Antigravity Notes
- Prioritize engineering credibility over pure visual spectacle in the first viewport.

## Future Evolution
- May introduce a dedicated "/recruiter" summary view if the homepage becomes too dense.
