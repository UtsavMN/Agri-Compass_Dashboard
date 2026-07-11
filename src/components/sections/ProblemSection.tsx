import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const problems = [
  { stat: "58%", label: "of Karnataka farmers rely solely on neighbours for crop decisions", icon: "👥", color: "#E06060" },
  { stat: "₹1.5L Cr", label: "lost annually across India to poor planning and post-harvest losses", icon: "📉", color: "#E06060" },
  { stat: "3 in 5", label: "farmers never check mandi prices before selling their harvest", icon: "🏪", color: "#C9A84C" },
  { stat: "72%", label: "of government agricultural schemes go unclaimed every year", icon: "🏛", color: "#C9A84C" },
];

export const ProblemSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="problem" ref={ref} className="py-32 px-6 bg-[#0A0900]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85 }}
          className="mb-20"
        >
          <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase font-mono mb-5">
            The Problem
          </p>
          <h2 className="font-serif text-5xl md:text-6xl text-[#F5F0E8] mb-6 max-w-3xl leading-tight">
            India's farmers deserve
            <span className="text-[#C9A84C]"> better intelligence.</span>
          </h2>
          <p className="text-[#F5F0E8]/40 text-lg max-w-2xl leading-relaxed">
            Millions of farmers make million-rupee decisions based on guesswork.
            Traditional knowledge is disappearing. Data that could save harvests
            sits behind walls of complexity and language barriers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {problems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, x: i % 2 === 0 ? -20 : 20 }}
              animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
              transition={{ delay: i * 0.14, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, borderColor: "rgba(201,168,76,0.22)" }}
              className="bg-[#111008] border border-[#2A2720] rounded-2xl p-8 transition-all duration-300"
              style={{ boxShadow: "0 6px 48px rgba(0,0,0,0.45)" }}
            >
              <div className="text-4xl mb-5">{item.icon}</div>
              <div className="font-serif text-5xl mb-3" style={{ color: item.color }}>
                {item.stat}
              </div>
              <p className="text-[#F5F0E8]/40 text-base leading-relaxed">{item.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 border border-[#C9A84C]/20 rounded-full px-7 py-3">
            <div className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
            <p className="text-[#C9A84C] text-sm font-mono">
              AgriCompass was built to solve exactly this
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
