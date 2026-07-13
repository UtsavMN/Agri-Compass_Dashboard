# ADR-0006: AI Experience Architecture

## Context
KrishiMitra must feel like a real, intelligent agricultural assistant rather than a static placeholder. 

## Decision
We implement a simulated streaming text architecture. The mock UI will generate characters over time (staggered reveal), include a blinking typing cursor when waiting, and provide contextual suggested follow-up chips at the end of the message generation.

## Alternatives Considered
- **Static text blocks:** Faster to implement but fails to demonstrate the "AI Experience" required by the portfolio.
- **Real LLM Integration:** Overcomplicates the showcase deployment and introduces unpredictable latency/costs.

## Engineering Trade-offs
- Simulated streaming requires complex `useEffect` timers and local state management for the chat history, increasing the complexity of the `SmartFarmSection` and `VoiceSection`.

## Performance Impact
- Text streaming causes rapid DOM updates. We mitigate this by using a lightweight character-by-character append rather than heavy component re-renders.

## Consequences
- AI components must handle `isTyping` state gracefully and prevent user input while streaming to simulate realism.

## Related Handbook Chapters
- `29_AI_EXPERIENCE_GUIDE.md`

## Antigravity Notes
- Ensure voice/text parity is maintained visually.

## Future Evolution
- Could be swapped with a real WebSocket/SSE backend without changing the frontend component API.
