import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      // Check if hovering over clickable elements
      const isClickable = target.closest('button, a, .premium-card, input, select, textarea');
      setIsHovering(!!isClickable);
    };

    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, [isMobile]);

  if (isMobile) return null; // No custom cursor on touch devices

  return (
    <>
      {/* Tiny solid dot that perfectly tracks mouse */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-[#E5D08F] rounded-full pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovering ? 0 : 1,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
      />
      
      {/* Larger soft ring with spring physics trailing behind */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#E5D08F]/40 pointer-events-none z-[9998]"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? 'rgba(229, 208, 143, 0.1)' : 'transparent',
          borderColor: isHovering ? 'rgba(229, 208, 143, 0.8)' : 'rgba(229, 208, 143, 0.4)',
        }}
        transition={{ 
          type: "spring", 
          stiffness: 150, 
          damping: 15,
          mass: 0.5
        }}
      />
    </>
  );
};
