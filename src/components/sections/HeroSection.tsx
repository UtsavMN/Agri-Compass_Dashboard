import { motion } from "framer-motion";
import { LAYOUT_SPRING, UI_SPRING } from "../../constants/springs";
import { Typography } from "../primitives/Typography";
import { Button } from "../primitives/Button";

export const HeroSection = () => (
  <section className="relative h-screen w-full flex flex-col justify-center overflow-hidden bg-transparent pointer-events-none">
    {/* Enhanced Cinematic Vignette & Radial Mask for UI readability */}
    <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[var(--color-earth-black)]/80 via-transparent to-[var(--color-earth-black)]/40 pointer-events-none" />
    <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--color-earth-black)_100%)] opacity-60 pointer-events-none" />

    {/* Content — STRICTLY CENTER ALIGNED */}
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 pointer-events-none">
      <div className="max-w-4xl flex flex-col items-center text-center pointer-events-auto mt-12">
        {/* Label */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...LAYOUT_SPRING, delay: 0.4 }}
          className="mb-8"
        >
          <Button variant="chip" as="div" className="pointer-events-none gap-3">
            <div className="w-2 h-2 rounded-full bg-[var(--color-knowledge-gold)] animate-pulse" />
            <span>AgriCompass · AI-Powered Agriculture</span>
          </Button>
        </motion.div>

        {/* Headline - Drop shadow for readability against bright volumetric rays */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...LAYOUT_SPRING, delay: 0.7 }}
          className="mb-6 drop-shadow-2xl"
          style={{ textShadow: "0 10px 40px rgba(0,0,0,0.8)" }}
        >
          <Typography variant="display-1">
            Empowering farmers<br />
            through{" "}
            <span className="text-[var(--color-knowledge-gold)] italic drop-shadow-[0_0_30px_rgba(229,208,143,0.3)]">AI, Data</span>
            <br />&amp; Community.
          </Typography>
        </motion.div>

        {/* Subtext */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...LAYOUT_SPRING, delay: 1.5 }}
          className="max-w-2xl mx-auto text-center drop-shadow-lg mb-6"
          style={{ textShadow: "0 4px 20px rgba(0,0,0,0.9)" }}
        >
          <Typography variant="body-lg" color="secondary" className="font-medium">
            Crop recommendations, soil intelligence, mandi prices, and a
            Kannada-first AI assistant — built for Karnataka's 12 million farmers.
          </Typography>
        </motion.div>

        {/* Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...UI_SPRING, delay: 2 }}
          className="flex flex-row justify-center gap-6 items-center mt-6"
        >
          <a href="#problem">
            <Button variant="primary">Begin Exploration</Button>
          </a>
          <a href="https://agri-compass-v3.vercel.app" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost">Open Live App</Button>
          </a>
        </motion.div>

        {/* Tech Stack Row for Recruiters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.5 }}
          className="mt-12 flex items-center justify-center gap-4 text-[var(--color-text-muted)] text-[10px] font-mono tracking-widest uppercase"
        >
          <span>React</span>
          <span className="w-1 h-1 rounded-full bg-[var(--color-text-tertiary)]/50" />
          <span>Three.js</span>
          <span className="w-1 h-1 rounded-full bg-[var(--color-text-tertiary)]/50" />
          <span>TypeScript</span>
          <span className="w-1 h-1 rounded-full bg-[var(--color-text-tertiary)]/50" />
          <span>Tailwind</span>
        </motion.div>
      </div>
    </div>

    {/* Scroll indicator */}
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10 pointer-events-none">
      <motion.div 
        className="w-[1px] bg-gradient-to-b from-[var(--color-knowledge-gold)] to-transparent origin-top shadow-[0_0_10px_rgba(229,208,143,0.5)]"
        animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0], y: [0, 20, 40] }}
        transition={{ repeat: Infinity, duration: 2, ease: "circInOut" }}
        style={{ height: "60px" }}
      />
      <p className="text-[var(--color-text-muted)] text-[10px] font-mono tracking-[0.5em] uppercase drop-shadow-md">Scroll</p>
    </div>
  </section>
);
