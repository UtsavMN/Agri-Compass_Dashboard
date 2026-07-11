import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import CountUp from "react-countup";

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
    <section ref={ref} className="py-20 border-y border-[#2A2720] bg-[#0A0900]">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.65 }}
            className="text-center"
          >
            <div className="font-serif text-5xl text-[#C9A84C] mb-2">
              {inView ? (
                <CountUp end={stat.value} duration={2.5} suffix={stat.suffix} />
              ) : `0${stat.suffix}`}
            </div>
            <p className="text-[#F5F0E8]/30 text-sm leading-relaxed">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
