import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { features } from "../../constants/features";

export const FeaturesSection = () => {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" ref={ref} className="py-32 bg-[#080706]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85 }}
          className="text-center mb-16"
        >
          <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase font-mono mb-4">
            The Platform
          </p>
          <h2 className="font-serif text-5xl md:text-6xl text-[#F5F0E8] mb-4">
            Eight tools.{" "}
            <span className="text-[#C9A84C]">One compass.</span>
          </h2>
          <p className="text-[#F5F0E8]/30 max-w-xl mx-auto">
            Every feature works together. Every data point helps the farmer earn more.
          </p>
        </motion.div>

        {/* Icon grid */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-14">
          {features.map((f, i) => (
            <motion.button
              key={f.id}
              onClick={() => setActive(i)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              className={`p-3 rounded-xl text-center transition-all duration-300 ${
                active === i
                  ? "border border-[#C9A84C]/55 bg-[#C9A84C]/10"
                  : "border border-[#2A2720] hover:border-[#C9A84C]/22"
              }`}
            >
              <div className="text-2xl mb-1">{f.icon}</div>
              <div className="text-[8px] text-[#F5F0E8]/28 font-mono uppercase leading-tight hidden md:block truncate">
                {f.title}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Active feature display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center"
          >
            {/* Text */}
            <div>
              <div className="text-5xl mb-5">{features[active].icon}</div>
              <p className="text-[#C9A84C] text-xs tracking-widest uppercase font-mono mb-2">
                {features[active].subtitle}
              </p>
              <h3 className="font-serif text-4xl text-[#F5F0E8] mb-4">
                {features[active].title}
              </h3>
              <p className="text-[#F5F0E8]/50 text-lg leading-relaxed mb-8">
                {features[active].description}
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {features[active].stats.map((s) => (
                  <span
                    key={s}
                    className="text-xs font-mono px-3 py-1.5 rounded-full border border-[#2A2720] text-[#F5F0E8]/35"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <a
                href="https://agri-compass-v3.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#C9A84C] text-sm border border-[#C9A84C]/30
                           px-5 py-2.5 rounded-lg hover:bg-[#C9A84C]/6 hover:border-[#C9A84C]/55 transition-all"
              >
                Try this feature →
              </a>
            </div>

            {/* Screenshot with browser chrome */}
            <motion.div
              className="relative rounded-2xl overflow-hidden border border-[#2A2720]"
              style={{ boxShadow: `0 0 70px ${features[active].color}12` }}
              whileHover={{ scale: 1.025 }}
              transition={{ duration: 0.32 }}
            >
              <div className="bg-[#1A1814] px-4 py-2.5 flex items-center gap-2 border-b border-[#2A2720]">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                </div>
                <div className="flex-1 bg-[#252320] rounded-md px-3 py-1 text-xs text-[#5A5850] font-mono">
                  agri-compass-v3.vercel.app
                </div>
              </div>
              <img
                src={features[active].screenshot}
                alt={features[active].title}
                className="w-full h-auto"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = "none";
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(to top, ${features[active].color}08, transparent)`,
                }}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
