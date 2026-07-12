import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { techStack } from "../../constants/techStack";

export const TechSection = () => {
  const categories = ["Frontend", "Backend", "Auth", "Database", "Hosting", "AI & APIs"];
  const [active, setActive] = useState("Frontend");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const filtered = techStack.filter((t) => t.category === active);

  return (
    <section id="tech" ref={ref} className="py-32 bg-transparent">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85 }}>
          <p className="text-[#E5D08F] text-xs tracking-[0.3em] uppercase font-mono mb-4">
            Technology
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#F5F0E8] mb-4">
            Built with{" "}
            <span className="text-[#E5D08F]">production-grade</span> tools.
          </h2>
          <p className="text-[#F5F0E8]/30 max-w-lg mx-auto">
            Not a student prototype. A production system using industry-standard technologies.
          </p>
        </motion.div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActive(cat)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className={`px-4 py-2 rounded-full text-xs font-mono transition-all duration-300 ${
                active === cat
                  ? "bg-[#E5D08F] text-[#0A0900] font-bold"
                  : "border border-[#2A2720] text-[#F5F0E8]/40 hover:border-[#E5D08F]/30"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Cards */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((tech, i) => (
              <motion.div
                key={tech.name}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.055, duration: 0.4 }}
                whileHover={{ y: -5, borderColor: "rgba(201,168,76,0.28)" }}
                className="premium-card bg-[#0A0603]/30 p-6 transition-all duration-300 cursor-default"
              >
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[#F5F0E8] font-semibold">{tech.name}</p>
                  <span className="text-[9px] font-mono bg-[#E5D08F]/10 text-[#E5D08F]
                                   border border-[#E5D08F]/20 px-2 py-0.5 rounded-full flex-shrink-0 ml-2">
                    {tech.badge}
                  </span>
                </div>
                <p className="text-[#F5F0E8]/30 text-sm leading-relaxed">
                  {tech.description}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
