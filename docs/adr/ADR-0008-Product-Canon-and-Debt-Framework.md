# ADR-0008: Product Canon & Technical Debt Framework

## Date
2026-07-13

## Status
Accepted

## Context
AgriCompass is evolving into an explainable learning platform rather than just a feature showcase. To manage this evolution without deteriorating the codebase or losing focus, we must formalize the **Product Canon** (Single Source of Truth) and a **Technical Debt Prevention Framework**. Without governance, the documentation, codebase, UI, and AI logic naturally diverge. Additionally, technical shortcuts ("debt") taken during development must be tracked and prioritized exactly like functional defects, to ensure the product remains maintainable and true to its constitutional intent.

## Decision

### 1. Product Canon Hierarchy
We will strictly follow the established knowledge hierarchy to resolve conflicts.
1. **Engineering Handbook**: Defines product behavior and intent.
2. **Architecture Decision Records (ADRs)**: Captures approved technical decisions.
3. **Design & Motion Specs**: Defines UX/UI and animation physics.
4. **Source Code**: Implements the handbook.
5. **Automated Tests**: Verifies compliance.
6. **Issue Tracker**: Request changes.

### 2. Technical Debt Prevention Framework
We will establish a formal debt tracking system.
- Every architectural, performance, UX, documentation, or AI shortcut must generate a **Debt Record**.
- Critical debt (Architecture) blocks new feature development until resolved.
- A **Debt Scorecard** (0-5 scale) is used to evaluate every feature before release. Any category scoring below 4 requires immediate remediation.

### 3. Implementation Tracking
- We introduce `docs/debt/SCORECARD.md` as the active ledger of our debt scorecard.
- Future ADRs or issues will reference this scorecard if compromises are necessary to meet deadlines.

## Consequences
- **Positive**: Clear conflict resolution mechanism. We won't argue whether the design spec or the code is right—the Handbook decides. Codebase quality remains exceptionally high.
- **Negative**: Adds slight friction to the development process, as "quick hacks" are no longer permissible without formal documentation and ownership.
