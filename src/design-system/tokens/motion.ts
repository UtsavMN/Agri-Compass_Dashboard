export const MotionTokens = {
  KnowledgeReveal: { type: "spring", stiffness: 100, damping: 20 },
  DiscoveryPulse: { type: "tween", duration: 0.9, ease: "easeInOut" },
  GlassElevate: { type: "tween", duration: 0.14, ease: "easeOut" },
  TreeBloom: { type: "spring", stiffness: 150, damping: 15 },
  RecruiterFocus: { type: "spring", stiffness: 200, damping: 25 },
  
  // Keep legacy for existing components until fully migrated
  duration: {
    hover: 0.14,
    reveal: 0.24,
    bloom: 0.3,
    pulse: 0.9
  },
  springs: {
    layout: { type: "spring", stiffness: 100, damping: 20 },
    ui: { type: "spring", stiffness: 200, damping: 25 },
    gentle: { type: "spring", stiffness: 120, damping: 14 }
  }
} as const;
