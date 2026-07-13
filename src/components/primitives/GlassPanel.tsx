import React from 'react';
import { GlassTokens } from '../../design-system/tokens';
import { motion, type HTMLMotionProps } from 'framer-motion';

type Variant = 'card' | 'modal' | 'overlay';
type Interaction = 'none' | 'hover' | 'active';

interface GlassPanelProps extends HTMLMotionProps<"div"> {
  variant?: Variant;
  interaction?: Interaction;
  className?: string;
  as?: any;
  children: React.ReactNode;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  variant = 'card',
  interaction = 'none',
  className = '',
  as,
  children,
  ...props
}) => {
  const blur = variant === 'overlay' ? GlassTokens.blur.light : variant === 'modal' ? GlassTokens.blur.heavy : GlassTokens.blur.default;
  const opacity = GlassTokens.opacity.base;
  const border = GlassTokens.border.default;
  const radius = variant === 'overlay' ? '0' : GlassTokens.radius.lg;
  const shadow = variant === 'overlay' ? 'none' : GlassTokens.shadow.ambient;

  const Component = as || motion.div;

  return (
    <Component
      className={`relative overflow-hidden ${className}`}
      style={{
        background: opacity,
        backdropFilter: `blur(${blur}) saturate(140%) brightness(1.15)`,
        WebkitBackdropFilter: `blur(${blur}) saturate(140%) brightness(1.15)`,
        border,
        borderTopColor: GlassTokens.border.topHighlight,
        borderRadius: radius,
        boxShadow: shadow,
        zIndex: variant === 'overlay' ? 40 : variant === 'modal' ? 50 : 20,
      }}
      whileHover={interaction === 'hover' ? {
        y: -2,
        scale: 1.002,
        boxShadow: GlassTokens.shadow.hover,
        borderTopColor: GlassTokens.border.hoverTopHighlight
      } : {}}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      {...props}
    >
      {/* Noise Texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-overlay z-0"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")"
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </Component>
  );
};
