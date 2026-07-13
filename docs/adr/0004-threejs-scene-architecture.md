# ADR-0004: Three.js Scene Architecture

## Context
AgriCompass's core storytelling relies heavily on a 3D environment. We need a robust architecture to handle models, lighting, post-processing, and scroll-linked animations without spaghetti code.

## Decision
We enforce a strict separation of concerns within the React-Three-Fiber ecosystem:
- `GlobalCanvas.tsx`: Manages the WebGL context, global lighting, and `ScrollControls`.
- `Earth.tsx` / `ProceduralTree.tsx`: Standalone, stateless rendering components.
- Camera and post-processing logic is isolated from UI overlays.
- HTML Overlays use `<Scroll html>` to perfectly sync with the 3D scene without complex manual scroll listeners.

## Alternatives Considered
- **Vanilla Three.js:** Too verbose, poor integration with React's component lifecycle.
- **Separate canvases per section:** Breaks the continuous cinematic scroll experience and increases memory overhead.

## Engineering Trade-offs
- `ScrollControls` forces all HTML to live inside the Canvas context, complicating CSS layouts (`z-index`, fixed positioning). We solve this by keeping HTML as a direct overlay rather than interleaved meshes.

## Performance Impact
- Single canvas architecture minimizes context switching and memory allocation.

## Consequences
- All scroll-based animations must hook into `useScroll` provided by R3F, not native window listeners.

## Related Handbook Chapters
- Volume 0, Chapter 02: Non-Negotiable Engineering Constitution

## Antigravity Notes
- Maintain clean separation between R3F hooks and native React state.

## Future Evolution
- May introduce more advanced post-processing (Bloom) if performance budgets allow.
