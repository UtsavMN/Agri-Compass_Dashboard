import { motion } from"framer-motion";
import { LAYOUT_SPRING } from"../../constants/springs";
import { useAudio } from"../../hooks/useAudio";

export const CTASection = () => {
  const { playClick, playGlass } = useAudio();
  return (
    <section className="relative py-32 bg-[#0A0900] overflow-hidden flex flex-col items-center text-center px-6 pointer-events-none">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#E5D08F]/5 via-transparent to-transparent opacity-50" />
      
      <div className="relative z-10 pointer-events-auto">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={LAYOUT_SPRING}
        className="relative z-10 max-w-3xl"
      >
        <div className="w-16 h-16 mx-auto border rounded-2xl flex items-center justify-center text-3xl mb-8">
          🌾
        </div>
        <h2 className="text-display-2 mb-6">
          Experience the future of <span className="text-[#E5D08F] italic">agriculture</span>.
        </h2>
        <p className="text-body-lg prose-elegant mx-auto text-center mb-12">
          Explore the live AgriCompass platform and see how data-driven decisions are empowering farmers across Karnataka.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center mt-4">
          <a
            href="https://agri-compass-v3.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            onClick={playClick}
            onMouseEnter={playGlass}
            className="btn-premium"
          >
            Launch AgriCompass
          </a>
          <a
            href="https://github.com/UtsavMN/Agri-compass_v3.git"
            target="_blank"
            rel="noopener noreferrer"
            onClick={playClick}
            onMouseEnter={playGlass}
            className="btn-ghost"
          >
            View GitHub Source
          </a>
        </div>
        </motion.div>
      </div>
    </section>
  );
};
