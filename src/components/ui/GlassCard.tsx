import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { useRef } from "react";
import type { ComponentProps, ReactNode } from "react";

type GlassCardProps = ComponentProps<typeof motion.div> & {
  children: ReactNode;
  className?: string;
  intensity?: "light" | "medium" | "heavy";
  border?: boolean;
};

export const GlassCard = ({ 
  children, 
  className = "", 
  intensity = "medium", // Kept for API compatibility, though premium-card handles styling
  border = true,
  ...props 
}: GlassCardProps) => {
  
  // 3D Tilt Physics
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out the mouse values
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  // Transform mouse position into rotation angles (max 8 degrees for subtlety)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    // Calculate mouse position relative to center (-0.5 to +0.5)
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    
    x.set(mouseX);
    y.set(mouseY);
    
    // Set CSS variables for the interactive radial glow in .premium-card
    const glowX = e.clientX - rect.left;
    const glowY = e.clientY - rect.top;
    ref.current.style.setProperty("--mouse-x", `${glowX}px`);
    ref.current.style.setProperty("--mouse-y", `${glowY}px`);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1200 }} className={`relative ${className}`}>
      <motion.div
        ref={ref}
        {...props}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`premium-card w-full h-full ${className}`}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          ...props.style
        }}
      >
        {/* Content - Translated on Z axis for Hologram Parallax Effect */}
        <div 
          className="relative z-10 h-full w-full pointer-events-none" 
          style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
        >
          <div className="pointer-events-auto h-full w-full">
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
