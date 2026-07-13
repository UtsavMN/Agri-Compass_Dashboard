export const LayoutTokens = {
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '2rem',
    lg: '4rem',
    xl: '8rem',
    '2xl': '12rem'
  },
  container: {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-[96rem]',
    full: 'max-w-none'
  },
  zIndex: {
    background: -10,
    base: 0,
    canvas: 10,
    content: 20,
    overlay: 40,
    modal: 50
  }
} as const;
