# ADR-0002: Earth Introduction & 3D Knowledge Tree Architecture

## Context
AgriCompass requires a powerful visual metaphor to immediately convey its global scope and deep agricultural knowledge. 

## Decision
We utilize a two-stage 3D architectural pattern built on `react-three-fiber`. 
1. **The Earth Intro:** A spinning globe that establishes global context and then transitions away.
2. **The Knowledge Tree (ProceduralTree):** A dynamically generated, low-poly style tree serving as the anchor for the entire scroll experience. 

These 3D elements are treated as a communication medium, not mere decoration.

## Alternatives Considered
- **Static imagery or 2D SVGs:** Fast to load, but fails to deliver the immersive "premium product" feel required to delight recruiters.
- **Pre-rendered video:** Lacks interactivity and cannot tie into the user's scroll position dynamically.

## Engineering Trade-offs
- **Complexity vs. Immersion:** Maintaining a global `Canvas` across all sections introduces state management complexity (`ScrollControls`, `camera.lookAt`), but is strictly necessary for the uninterrupted cinematic experience.

## Performance Impact
- The procedural tree uses instanced meshes and highly optimized low-poly geometry to maintain 60 FPS on average hardware. Shadows are baked or minimal.

## Consequences
- The global canvas must never block the main thread.
- Lazy-loading of sections remains tricky due to the persistent 3D overlay.

## Related Handbook Chapters
- `34_DESIGN_DECISIONS.md`
- Volume 0, Chapter 02: Non-Negotiable Engineering Constitution

## Antigravity Notes
- Preserve the cinematic scroll triggers exactly.
- Do not add arbitrary 3D models without strict justification against the constitution.

## Future Evolution
- May introduce more procedural variations of the tree based on specific user progress, provided performance budgets are maintained.
