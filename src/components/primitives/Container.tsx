import React from 'react';
import { LayoutTokens } from '../../design-system/tokens';

type MaxWidth = keyof typeof LayoutTokens.container;
type PaddingY = keyof typeof LayoutTokens.spacing | 'none';

interface ContainerProps {
  maxWidth?: MaxWidth;
  paddingY?: PaddingY;
  className?: string;
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({
  maxWidth = 'lg',
  paddingY = 'lg',
  className = '',
  children
}) => {
  const py = paddingY === 'none' ? '0' : LayoutTokens.spacing[paddingY];
  const mw = LayoutTokens.container[maxWidth];

  return (
    <div 
      className={`mx-auto px-6 w-full ${mw} ${className}`}
      style={{ paddingTop: py, paddingBottom: py }}
    >
      {children}
    </div>
  );
};
