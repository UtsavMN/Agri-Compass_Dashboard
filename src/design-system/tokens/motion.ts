export const MotionTokens = {
  duration: {
    hover: 0.14, // 140ms
    reveal: 0.24, // 240ms
    bloom: 0.3,   // 300ms
    pulse: 0.9    // 900ms
  },
  springs: {
    layout: { type: "spring", stiffness: 100, damping: 20 },
    ui: { type: "spring", stiffness: 200, damping: 25 },
    gentle: { type: "spring", stiffness: 120, damping: 14 }
  }
} as const;
