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
  intensity = "medium",
  border = true,
  ...props 
}: GlassCardProps) => {
  
  const intensityMap = {
    light: "bg-[#1A0F05]/40 backdrop-blur-md",
    medium: "bg-[#130903]/50 backdrop-blur-2xl",
    heavy: "bg-[#1A0F05]/60 backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]",
  };

  // 3D Tilt Physics
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out the mouse values
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  // Transform mouse position into rotation angles (max 10 degrees)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    // Calculate mouse position relative to center (-0.5 to +0.5)
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className={`relative ${className}`}>
      <motion.div
        ref={ref}
        {...props}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`
          rounded-2xl relative overflow-visible group w-full h-full
        ${intensityMap[intensity]}
        ${border ? 'border border-white/[0.02]' : ''}
        ${className}
      `}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.15)",
        ...props.style
      }}
    >
      {/* SVG Noise Texture for Premium Physical Glass Feel */}
      <div 
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none rounded-2xl overflow-hidden"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          transform: "translateZ(0px)" // keeps noise glued to background
        }}
      />
      
      {/* Soft Top Glow (Specular Highlight) */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E5D08F]/20 to-transparent pointer-events-none" />
      
      {/* Glass border & shine effect */}
      {border && (
        <>
          <div className="absolute inset-0 rounded-2xl border border-[#E5D08F]/0 pointer-events-none group-hover:border-[#E5D08F]/[0.15] transition-colors duration-500" />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.02] via-transparent to-black/40 pointer-events-none" />
          
          {/* Edge highlight line on top */}
          <div className="absolute top-0 inset-x-4 h-px bg-gradient-to-r from-transparent via-[#E5D08F]/[0.4] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </>
      )}

      {/* Content - Translated on Z axis for Hologram Parallax Effect */}
      <div 
        className="relative z-10 h-full w-full pointer-events-none" 
        style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }}
      >
        <div className="pointer-events-auto h-full w-full">
          {children}
        </div>
      </div>
    </motion.div>
    </div>
  );
};
