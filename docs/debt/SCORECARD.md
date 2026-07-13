# Technical Debt Scorecard

**Objective**: Prevent technical debt from accumulating across architecture, performance, UX, documentation, and AI consistency.
**Rule**: Any category scoring below 4 requires immediate remediation before release.

## Active Scorecard (Phase 6.3)

| Component | Architecture (0-5) | Performance (0-5) | UX (0-5) | Documentation (0-5) | AI (0-5) | Overall Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **KnowledgeGraphSection** | 5 | 5 | 5 | 5 | N/A | Pass |
| **SmartFarmSection (AI Demo)** | 5 | 5 | 5 | 5 | 5 | Pass |
| **Core Services (Discovery/Profile)**| 5 | 5 | N/A | 5 | N/A | Pass |
| **Recruiter Flow (Home.tsx)** | 5 | 5 | 5 | 5 | N/A | Pass |

### Debt Records

*(No active debt records for Phase 6.3)*

### Guidelines

- **Architecture**: Modules are strictly decoupled. Learning logic is isolated from UI components.
- **Performance**: Strict 60fps frame rate for scrolling and 3D scenes.
- **UX**: All animations use standardized springs (`LAYOUT_SPRING`, `UI_SPRING`). No rogue transition settings.
- **Documentation**: Code fully matches Handbook directives.
- **AI Consistency**: AI interactions are completely transparent. Explainability metadata is always available.
