import { motion } from "framer-motion";
import { LAYOUT_SPRING, UI_SPRING } from "../../constants/springs";

export const HeroSection = () => (
  <section className="relative h-screen w-full flex flex-col justify-center overflow-hidden bg-transparent">
    {/* Gradient overlays at z-1 */}
    <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/20 via-transparent to-transparent" />
    <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#1A0F05]/40 via-transparent to-[#1A0F05]/40" />

    {/* Content — CENTER aligned */}
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
      <div className="max-w-4xl flex flex-col items-center text-center">
        {/* Label */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...LAYOUT_SPRING, delay: 0.4 }}
          className="flex items-center gap-2.5 mb-6"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#E5D08F] animate-pulse" />
          <span className="label-super !mb-0">
            Agri Compass · Karnataka, India · AI-Powered Agriculture
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...LAYOUT_SPRING, delay: 0.7 }}
          className="text-display-1 mb-6"
        >
          Empowering farmers<br />
          through{" "}
          <span className="text-[#E5D08F] italic">AI, Data</span>
          <br />&amp; Community.
        </motion.h1>

        {/* Subtext — max-width constraint */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...LAYOUT_SPRING, delay: 1.5 }}
          className="text-body-lg prose-elegant mx-auto text-center"
        >
          Crop recommendations, soil intelligence, mandi prices, and a
          Kannada-first AI assistant — built for Karnataka's 12 million farmers.
        </motion.p>

        {/* Buttons — center-aligned row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...UI_SPRING, delay: 2 }}
          className="flex flex-row justify-center gap-6 items-center mt-4"
        >
          <a href="#features" className="btn-premium">
            Begin Exploration
          </a>
          <a href="https://agri-compass-v3.vercel.app" target="_blank" rel="noopener noreferrer" className="btn-ghost">
            Open Live App
          </a>
        </motion.div>
      </div>
    </div>

    {/* Scroll indicator at z-10 */}
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
      <motion.div 
        className="w-[1px] bg-gradient-to-b from-[#E5D08F]/80 to-transparent origin-top"
        animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0], y: [0, 20, 40] }}
        transition={{ repeat: Infinity, duration: 2, ease: "circInOut" }}
        style={{ height: "60px" }}
      />
      <p className="text-[#F5F0E8]/20 text-[10px] font-mono tracking-[0.4em] uppercase">Scroll</p>
    </div>
  </section>
);
