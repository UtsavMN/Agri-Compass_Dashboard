import React from 'react';
import { TypographyTokens } from '../../design-system/tokens';

type Variant = keyof typeof TypographyTokens.fontSize;
type Color = 'primary' | 'secondary' | 'tertiary' | 'muted' | 'gold' | 'green' | 'amber';

interface TypographyProps {
  variant: Variant;
  color?: Color;
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({ 
  variant, 
  color = 'primary', 
  as, 
  className = '', 
  children 
}) => {
  const isDisplay = variant.startsWith('display');
  const isHeading = variant.startsWith('heading');
  const isMono = variant === 'micro';
  
  const Component = as || (isDisplay ? 'h1' : isHeading ? 'h2' : 'p');
  
  const fontFamily = isDisplay || isHeading 
    ? TypographyTokens.fontFamily.display 
    : isMono 
      ? TypographyTokens.fontFamily.mono 
      : TypographyTokens.fontFamily.body;

  const colorVar = 
    color === 'gold' ? 'var(--color-knowledge-gold)' :
    color === 'green' ? 'var(--color-growth-green)' :
    color === 'amber' ? 'var(--color-alert-amber)' :
    color === 'secondary' ? 'var(--color-text-secondary)' :
    color === 'tertiary' ? 'var(--color-text-tertiary)' :
    color === 'muted' ? 'var(--color-text-muted)' :
    'var(--color-text-primary)';

  const style: React.CSSProperties = {
    fontFamily,
    fontSize: TypographyTokens.fontSize[variant],
    lineHeight: isDisplay ? TypographyTokens.lineHeight.tight : isHeading ? TypographyTokens.lineHeight.snug : TypographyTokens.lineHeight.relaxed,
    letterSpacing: isDisplay ? TypographyTokens.letterSpacing.tighter : isHeading ? TypographyTokens.letterSpacing.tight : TypographyTokens.letterSpacing.normal,
    color: colorVar,
    textTransform: isMono ? 'uppercase' : 'none',
  };

  if (isMono) {
    style.letterSpacing = TypographyTokens.letterSpacing.wider;
  }

  return (
    <Component style={style} className={className}>
      {children}
    </Component>
  );
};
