import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { LAYOUT_SPRING } from "../../constants/springs";
import { FramerCounter } from "../ui/FramerCounter";

const stats = [
  { value: 8,  suffix: "",  label: "Core features for complete farm intelligence" },
  { value: 15, suffix: "+", label: "Live API integrations powering real-time data" },
  { value: 31, suffix: "",  label: "Karnataka districts fully supported" },
  { value: 2,  suffix: "",  label: "Languages — Kannada and English" },
];

export const StatsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative py-32 bg-transparent z-10">
      <div className="max-w-6xl mx-auto px-6">
        
        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={LAYOUT_SPRING}>
          <p className="label-super">
            Scale & Impact
          </p>
          <h2 className="text-display-2 mb-4">
            Built for a <span className="text-[#E5D08F] italic">state.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...LAYOUT_SPRING, delay: i * 0.1 }}
              className="premium-card p-8 text-center flex flex-col items-center justify-center group"
            >
              <div className="text-display-2 text-[#E5D08F] mb-4 drop-shadow-[0_0_15px_rgba(229,208,143,0.3)] tabular-nums group-hover:scale-110 transition-transform duration-500" 
                   role="status" aria-live="polite" aria-label={`${stat.value}${stat.suffix} ${stat.label}`}>
                <FramerCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-body-md text-center">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
