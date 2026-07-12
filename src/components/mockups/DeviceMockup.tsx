import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const DeviceMockup = ({ screenshot, color }: { screenshot: string; color: string }) => {
  const ref = useRef(null);
  
  // High-end parallax tilt
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [15, -15]);
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, y, perspective: 1200 }}
      className="relative w-full max-w-5xl mx-auto cursor-ns-resize group"
    >
      <motion.div 
        className="relative rounded-[2rem] overflow-hidden border border-white/10 bg-[#1A0F05] shadow-[0_0_100px_rgba(201,168,76,0.15)]"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Apple-style Browser Chrome */}
        <div className="bg-black/20 backdrop-blur-md/80 backdrop-blur-xl px-6 py-4 flex items-center gap-4 border-b border-white/5 z-20 relative">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex-1 max-w-md mx-auto bg-black/40 rounded-lg px-4 py-2 flex items-center justify-center">
            <span className="text-[#5A5850] text-xs font-mono flex items-center gap-2">
              <span className="text-[#E5D08F]">🔒</span> agricompass.in
            </span>
          </div>
        </div>

        {/* Scrollable Screen Content */}
        <div className="relative w-full h-[60vh] overflow-y-auto overflow-x-hidden scrollbar-hide bg-transparent">
          <motion.img
            src={screenshot}
            alt="Application Interface"
            className="w-full h-auto origin-top"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              (e.currentTarget as HTMLImageElement).style.minHeight = "600px";
              (e.currentTarget as HTMLImageElement).style.background = "#111008";
            }}
          />
          {/* Subtle glare overlay */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent" />
        </div>
      </motion.div>
      
      {/* Glow cast onto background */}
      <div 
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 blur-[100px] pointer-events-none"
        style={{ background: color }}
      />
    </motion.div>
  );
};
