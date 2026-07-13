export const TypographyTokens = {
  fontFamily: {
    display: "'Playfair Display', Georgia, serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "'Space Mono', 'Courier New', monospace"
  },
  fontSize: {
    'display-1': 'clamp(3rem, 8vw, 6rem)',
    'display-2': 'clamp(2.5rem, 5vw, 4.5rem)',
    'heading-1': 'clamp(2rem, 4vw, 3rem)',
    'heading-2': 'clamp(1.25rem, 2.5vw, 1.75rem)',
    'body-lg': 'clamp(1.125rem, 2vw, 1.35rem)',
    'body-md': '1.05rem',
    'caption': '0.85rem',
    'micro': '0.75rem'
  },
  lineHeight: {
    tight: 1.05,
    snug: 1.15,
    normal: 1.5,
    relaxed: 1.7
  },
  letterSpacing: {
    tighter: '-0.03em',
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
    wider: '0.05em',
    widest: '0.15em'
  }
} as const;
