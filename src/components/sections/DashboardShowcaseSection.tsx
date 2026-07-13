import { motion } from "framer-motion";
import { KeynoteScreenshot } from "../ui/KeynoteScreenshot";
import { MotionTokens } from "../../design-system/tokens/motion";
import { GlassPanel } from "../primitives/GlassPanel";
import { Typography } from "../primitives/Typography";

export const DashboardShowcaseSection = () => (
  <section className="relative w-full flex flex-col items-center px-6 pb-12 z-20 pointer-events-none bg-transparent">
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={MotionTokens.KnowledgeReveal}
      className="relative w-full max-w-7xl pointer-events-auto"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#E5D08F]/10 via-transparent to-transparent opacity-80 blur-3xl pointer-events-none" />
      
      {/* Explainability Trust Label (Volume I, Chapter 05) */}
      <GlassPanel 
        className="absolute -top-6 right-10 z-30 px-4 py-2 rounded-lg border-[var(--color-knowledge-gold)] flex items-center gap-2"
        interaction="none"
      >
        <div className="w-2 h-2 rounded-full bg-[var(--color-knowledge-gold)] animate-pulse" />
        <Typography variant="micro" color="primary" className="font-mono tracking-widest uppercase">
          AI Insight Transparency Active
        </Typography>
      </GlassPanel>

      <KeynoteScreenshot src="/screenshots/dashboard_main.png" alt="AgriCompass Dashboard" tilt="straight" />
    </motion.div>
  </section>
);
