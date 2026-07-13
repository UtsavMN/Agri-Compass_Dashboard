export const ColorTokens = {
  knowledgeGold: '#E5D08F',
  knowledgeGoldMuted: 'rgba(229, 208, 143, 0.7)',
  knowledgeGoldSubtle: 'rgba(229, 208, 143, 0.15)',
  
  earthBlack: '#0A0900',
  earthBlackElevated: '#080706',
  
  growthGreen: '#7EC47E',
  growthGreenMuted: 'rgba(126, 196, 126, 0.2)',
  
  aiBlue: '#60A5FA',
  aiBlueMuted: 'rgba(96, 165, 250, 0.2)',
  
  alertAmber: '#F59E0B',
  
  textPrimary: '#F5F0E8',
  textSecondary: 'rgba(245, 240, 232, 0.85)',
  textTertiary: 'rgba(245, 240, 232, 0.5)',
  textMuted: 'rgba(245, 240, 232, 0.4)',
  
  glassBorder: 'rgba(255, 255, 255, 0.06)',
  glassHighlight: 'rgba(255, 255, 255, 0.15)',
} as const;

export type ColorToken = keyof typeof ColorTokens;
