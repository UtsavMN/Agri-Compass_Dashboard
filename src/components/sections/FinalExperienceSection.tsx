import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const FinalExperienceSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0.8]);

  return (
    <section ref={ref} className="relative py-48 bg-[#050503] overflow-hidden flex items-center justify-center">
      
      {/* Parallax Background */}
      <motion.div 
        style={{ y: yBg, opacity }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#C9A84C]/15 via-[#0A0900] to-[#0A0900]" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: 'linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />
      </motion.div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-[#C9A84C] to-[#D4B86A] rounded-3xl flex items-center justify-center shadow-[0_0_80px_rgba(201,168,76,0.3)] mb-10">
            <span className="text-4xl text-[#0A0900]">✨</span>
          </div>

          <h2 className="font-serif text-5xl md:text-7xl lg:text-[80px] text-[#F5F0E8] leading-[1.1] mb-8">
            The future of farming is <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#F5F0E8]">intelligent</span>.
          </h2>
          
          <p className="text-[#F5F0E8]/40 text-lg md:text-xl mb-14 max-w-2xl mx-auto leading-relaxed">
            AgriCompass isn't just an app. It's an operating system for modern agriculture, designed to put the power of AI, data, and community directly into the hands of every farmer.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <motion.a
              href="https://agri-compass-v3.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(201,168,76,0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-[#C9A84C] text-[#0A0900] font-bold text-lg rounded-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative">Experience AgriCompass Live</span>
            </motion.a>
            
            <motion.a
              href="https://github.com/UtsavMN/Agri-compass_v3.git"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              className="px-10 py-5 bg-[#111008] border border-[#2A2720] text-[#F5F0E8] font-semibold text-lg rounded-2xl transition-all"
            >
              View GitHub Repo
            </motion.a>
          </div>
        </motion.div>
      </div>

    </section>
  );
};
