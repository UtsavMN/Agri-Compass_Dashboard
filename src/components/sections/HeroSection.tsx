import { motion } from "framer-motion";
import { LAYOUT_SPRING, UI_SPRING } from "../../constants/springs";

export const HeroSection = () => (
  <section className="relative h-screen w-full flex flex-col justify-center overflow-hidden bg-transparent pointer-events-none">
    {/* Enhanced Cinematic Vignette & Radial Mask for UI readability */}
    <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#0A0900]/80 via-transparent to-[#0A0900]/40 pointer-events-none" />
    <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_40%,#0A0900_100%)] opacity-60 pointer-events-none" />

    {/* Content — STRICTLY CENTER ALIGNED */}
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 pointer-events-none">
      <div className="max-w-4xl flex flex-col items-center text-center pointer-events-auto mt-12">
        {/* Label */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...LAYOUT_SPRING, delay: 0.4 }}
          className="flex items-center gap-3 mb-8 bg-[#0A0900]/40 backdrop-blur-md border border-[#E5D08F]/20 px-4 py-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
        >
          <div className="w-2 h-2 rounded-full bg-[#E5D08F] animate-pulse" />
          <span className="label-super !mb-0 !tracking-[0.2em] !text-[11px]">
            AgriCompass · AI-Powered Agriculture
          </span>
        </motion.div>

        {/* Headline - Drop shadow for readability against bright volumetric rays */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...LAYOUT_SPRING, delay: 0.7 }}
          className="text-display-1 mb-6 drop-shadow-2xl"
          style={{ textShadow: "0 10px 40px rgba(0,0,0,0.8)" }}
        >
          Empowering farmers<br />
          through{" "}
          <span className="text-[#E5D08F] italic drop-shadow-[0_0_30px_rgba(229,208,143,0.3)]">AI, Data</span>
          <br />&amp; Community.
        </motion.h1>

        {/* Subtext */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...LAYOUT_SPRING, delay: 1.5 }}
          className="text-body-lg prose-elegant mx-auto text-center font-medium drop-shadow-lg"
          style={{ textShadow: "0 4px 20px rgba(0,0,0,0.9)" }}
        >
          Crop recommendations, soil intelligence, mandi prices, and a
          Kannada-first AI assistant — built for Karnataka's 12 million farmers.
        </motion.p>

        {/* Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...UI_SPRING, delay: 2 }}
          className="flex flex-row justify-center gap-6 items-center mt-6"
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

    {/* Scroll indicator */}
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10 pointer-events-none">
      <motion.div 
        className="w-[1px] bg-gradient-to-b from-[#E5D08F] to-transparent origin-top shadow-[0_0_10px_rgba(229,208,143,0.5)]"
        animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0], y: [0, 20, 40] }}
        transition={{ repeat: Infinity, duration: 2, ease: "circInOut" }}
        style={{ height: "60px" }}
      />
      <p className="text-[#F5F0E8]/40 text-[10px] font-mono tracking-[0.5em] uppercase drop-shadow-md">Scroll</p>
    </div>
  </section>
);
