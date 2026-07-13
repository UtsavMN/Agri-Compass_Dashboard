import { motion } from"framer-motion";
import { KeynoteScreenshot } from"../ui/KeynoteScreenshot";
import { LAYOUT_SPRING } from"../../constants/springs";

export const DashboardShowcaseSection = () => (
  <section className="relative w-full flex flex-col items-center px-6 pb-12 z-20 pointer-events-none bg-transparent">
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin:"-100px" }}
      transition={LAYOUT_SPRING}
      className="relative w-full max-w-7xl pointer-events-auto"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#E5D08F]/10 via-transparent to-transparent opacity-80 blur-3xl pointer-events-none" />
      <KeynoteScreenshot src="/screenshots/dashboard_main.png" alt="AgriCompass Dashboard" tilt="straight" />
    </motion.div>
  </section>
);
