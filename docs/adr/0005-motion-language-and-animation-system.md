# ADR-0005: Motion Language & Animation System

## Context
Animations must feel purposeful, physical, and premium. Disjointed easings and durations make the application feel cheap.

## Decision
We standardize all motion on `framer-motion` using specific spring physics defined in `src/constants/springs.ts`. 
- Every element entrance uses a standard `staggerChildren` reveal.
- Hover states use consistent scale (`1.02`) and transition (`spring`).
- No generic CSS transitions are allowed for layout shifts.

## Alternatives Considered
- **CSS Transitions exclusively:** Lacks the physical spring feeling required for the premium AgriCompass identity.
- **GSAP:** Overkill for React architecture where Framer Motion provides a more idiomatic component API.

## Engineering Trade-offs
- Slight bundle size increase due to `framer-motion`, but acceptable for the visual quality gained.

## Performance Impact
- Framer Motion utilizes hardware-accelerated transforms (translate, scale, opacity) ensuring stable 60 FPS. 

## Consequences
- Developers must import presets from `springs.ts` rather than hardcoding `{ duration: 0.3 }` inline.

## Related Handbook Chapters
- `32_COMPONENT_ANIMATION_LIBRARY.md`

## Antigravity Notes
- Audit all `motion.div` elements to ensure they consume global constants.

## Future Evolution
- Will expand `springs.ts` into a comprehensive Motion Design Token system.
