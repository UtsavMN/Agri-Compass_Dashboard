export const GlassTokens = {
  blur: {
    default: '24px',
    heavy: '40px',
    light: '12px'
  },
  opacity: {
    base: 'linear-gradient(160deg, rgba(255, 255, 255, 0.03) 0%, rgba(10, 9, 0, 0.5) 100%)',
    hover: 'linear-gradient(160deg, rgba(255, 255, 255, 0.05) 0%, rgba(10, 9, 0, 0.6) 100%)',
    active: 'linear-gradient(160deg, rgba(255, 255, 255, 0.08) 0%, rgba(10, 9, 0, 0.7) 100%)'
  },
  border: {
    default: '1px solid rgba(255, 255, 255, 0.06)',
    topHighlight: 'rgba(229, 208, 143, 0.15)',
    hoverTopHighlight: 'rgba(229, 208, 143, 0.3)'
  },
  shadow: {
    ambient: '0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 40px 80px -20px rgba(0, 0, 0, 0.9), inset 0 1px 1px rgba(255, 255, 255, 0.15), inset 0 -1px 1px rgba(0, 0, 0, 0.5)',
    hover: '0 30px 60px -10px rgba(0, 0, 0, 0.9), 0 50px 100px -20px rgba(0, 0, 0, 1.0), 0 0 80px rgba(229, 208, 143, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.25)'
  },
  radius: {
    md: '1rem',
    lg: '1.5rem',
    pill: '9999px'
  }
} as const;
