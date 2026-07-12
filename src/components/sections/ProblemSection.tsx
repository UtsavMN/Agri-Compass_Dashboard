import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { LAYOUT_SPRING } from "../../constants/springs";

const problems = [
  { stat: "58%", label: "of Karnataka farmers rely solely on neighbours for crop decisions", color: "#E06060" },
  { stat: "₹1.5L Cr", label: "lost annually across India to poor planning and post-harvest losses", color: "#E06060" },
  { stat: "3 in 5", label: "farmers never check mandi prices before selling their harvest", color: "#E5D08F" },
  { stat: "72%", label: "of government agricultural schemes go unclaimed every year", color: "#E5D08F" },
];

export const ProblemSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="problem" ref={ref} className="relative py-32 px-6 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={LAYOUT_SPRING}
          className="mb-24 flex flex-col items-center text-center"
        >
          <p className="label-super">
            The Problem
          </p>
          <h2 className="text-display-2 mb-6 max-w-4xl">
            India's farmers deserve
            <span className="text-[#E5D08F] italic block mt-2">better intelligence.</span>
          </h2>
          <p className="text-body-lg prose-elegant">
            Millions of farmers make million-rupee decisions based on guesswork.
            Traditional knowledge is disappearing. Data that could save harvests
            sits behind walls of complexity and language barriers.
          </p>
        </motion.div>

        <div className="flex flex-col gap-6 max-w-3xl mx-auto items-center">
          {problems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ ...LAYOUT_SPRING, delay: i * 0.14 }}
              className="premium-card p-12 flex flex-col items-center text-center group w-full"
            >
              <div
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-6 text-xs font-mono font-bold transition-transform duration-500 group-hover:scale-110"
                style={{ background: `${item.color}18`, color: item.color, border: `1px solid ${item.color}30` }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>

              <div className="text-display-2 mb-4 font-semibold transition-colors duration-500 tabular-nums" style={{ color: item.color }}>
                {item.stat}
              </div>
              <p className="text-body-lg max-w-md">{item.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...LAYOUT_SPRING, delay: 0.7 }}
          className="mt-16 text-center"
        >
          <div className="chip-premium gap-3 !px-7 !py-3">
            <div className="w-2 h-2 rounded-full bg-[#E5D08F] animate-pulse" />
            <span className="!mb-0">
              AgriCompass was built to solve exactly this
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
