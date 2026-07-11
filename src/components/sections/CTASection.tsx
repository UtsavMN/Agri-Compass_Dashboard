import { motion } from "framer-motion";

export const CTASection = () => {
  return (
    <section className="py-32 bg-[#0A0900] relative overflow-hidden flex flex-col items-center text-center px-6">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C9A84C]/10 via-[#0A0900] to-[#0A0900] opacity-50" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-3xl"
      >
        <div className="w-16 h-16 mx-auto bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-2xl flex items-center justify-center text-3xl mb-8">
          🌾
        </div>
        <h2 className="font-serif text-5xl md:text-7xl text-[#F5F0E8] mb-6">
          Experience the future of <span className="text-[#C9A84C]">agriculture</span>.
        </h2>
        <p className="text-[#F5F0E8]/40 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
          Explore the live AgriCompass platform and see how data-driven decisions are empowering farmers across Karnataka.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.a
            href="https://agri-compass-v3.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, boxShadow: "0 0 36px rgba(201,168,76,0.45)" }}
            whileTap={{ scale: 0.97 }}
            className="px-10 py-5 bg-[#C9A84C] text-[#0A0900] font-semibold text-lg rounded-xl"
          >
            Launch AgriCompass →
          </motion.a>
          <motion.a
            href="https://github.com/UtsavMN/Agri-compass_v3.git"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ borderColor: "rgba(201,168,76,0.55)" }}
            className="px-10 py-5 border border-[#2A2720] text-[#F5F0E8]/60 font-mono rounded-xl hover:text-[#F5F0E8] transition-all"
          >
            View GitHub Source ↗
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
};
