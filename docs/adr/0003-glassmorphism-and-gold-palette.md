# ADR-0003: Glassmorphism Design Language & Gold Colour System

## Context
AgriCompass requires a UI that feels premium, modern, and perfectly readable over a dynamic 3D background without obscuring the underlying tree metaphor.

## Decision
We enforce a strict Glassmorphism design language using dark, semi-transparent panels (`bg-black/40`, `backdrop-blur-md`) with subtle metallic gold/emerald accents (`border-emerald-500/30`). 

## Alternatives Considered
- **Solid backgrounds:** Obscures the 3D canvas entirely, defeating the purpose of the ScrollControls storytelling.
- **Light mode:** Does not provide enough contrast for the glowing gold/emerald typography and lighting of the 3D scene.

## Engineering Trade-offs
- `backdrop-blur` can be computationally expensive on lower-end devices. We mitigate this by restricting blur to specific UI containers rather than full-screen overlays.

## Performance Impact
- Requires hardware acceleration for CSS filters. Tested to maintain 60FPS on target devices.

## Consequences
- No solid background colours are permitted for main section containers.
- All text must maintain WCAG AA contrast against the dark blurred background.

## Related Handbook Chapters
- `34_DESIGN_DECISIONS.md`
- `33_VISUAL_QA_CHECKLIST.md`

## Antigravity Notes
- Maintain precise consistency with Tailwind classes: `bg-black/40 backdrop-blur-md border border-white/10`.
- Do not introduce arbitrary new accent colors.

## Future Evolution
- May introduce a high-performance fallback (e.g., solid 90% opacity black) for devices that fail to render backdrop filters efficiently.
