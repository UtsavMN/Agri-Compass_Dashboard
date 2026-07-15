import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { TypographyTokens } from '../../design-system/tokens';

type Variant = 'primary' | 'ghost' | 'chip';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  as?: any;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  as,
  ...props
}) => {
  const isPrimary = variant === 'primary';
  const isChip = variant === 'chip';

  const baseStyle: React.CSSProperties = {
    fontFamily: TypographyTokens.fontFamily.body,
    fontSize: isChip ? TypographyTokens.fontSize.caption : TypographyTokens.fontSize['body-md'],
    letterSpacing: isChip ? TypographyTokens.letterSpacing.wider : TypographyTokens.letterSpacing.wide,
    textTransform: isChip ? 'uppercase' : 'none',
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: isChip ? 'var(--color-knowledge-gold)' : (isPrimary ? 'var(--color-knowledge-gold)' : 'var(--color-text-primary)'),
    padding: isChip ? '0.4rem 1.2rem' : '0.85rem 2rem',
    minHeight: isChip ? 'auto' : '44px',
    borderRadius: '9999px',
    border: isPrimary 
      ? '1px solid rgba(229, 208, 143, 0.4)' 
      : isChip 
        ? '1px solid rgba(229, 208, 143, 0.2)' 
        : '1px solid transparent',
    background: isPrimary
      ? 'linear-gradient(135deg, rgba(229, 208, 143, 0.15) 0%, rgba(229, 208, 143, 0.05) 100%)'
      : isChip
        ? 'rgba(26, 15, 5, 0.6)'
        : 'transparent',
    backdropFilter: isPrimary || isChip ? 'blur(12px)' : 'none',
    WebkitBackdropFilter: isPrimary || isChip ? 'blur(12px)' : 'none',
    boxShadow: isPrimary 
      ? '0 8px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
      : isChip
        ? '0 4px 15px rgba(0, 0, 0, 0.2)'
        : 'none',
  };

  const hoverProps = isPrimary ? {
    y: -2,
    scale: 1.02,
    backgroundColor: 'rgba(229, 208, 143, 0.2)',
    borderColor: 'rgba(229, 208, 143, 0.7)'
  } : isChip ? {
    y: -1,
    scale: 1.02,
    borderColor: 'rgba(229, 208, 143, 0.4)'
  } : {
    color: 'var(--color-knowledge-gold)'
  };

  const tapProps = {
    scale: 0.98,
    y: 1
  };

  const Component = as || motion.button;

  return (
    <Component
      className={`focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E5D08F] ${className}`}
      style={baseStyle}
      whileHover={hoverProps}
      whileTap={tapProps}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      {...props}
    >
      {children}
    </Component>
  );
};
