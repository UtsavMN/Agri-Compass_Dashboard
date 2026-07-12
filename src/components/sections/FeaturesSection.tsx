import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { KeynoteScreenshot } from "../ui/KeynoteScreenshot";
import { features } from "../../constants/features";
import { LAYOUT_SPRING, UI_SPRING } from "../../constants/springs";

export const FeaturesSection = () => {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="features" ref={ref} className="relative py-32 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 text-center">
        
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={LAYOUT_SPRING}
        >
          <p className="label-super">
            The Platform
          </p>
          <h2 className="text-display-2 mb-6">
            Eight tools.<br />
            <span className="text-[#E5D08F] italic">One unified dashboard.</span>
          </h2>
          <p className="text-body-lg prose-elegant mx-auto">
            Every feature works together.
          </p>
        </motion.div>

        {/* Feature icon tabs — LARGER and more visible */}
        <div className="flex flex-wrap gap-3 justify-center mb-14" role="tablist">
          {features.map((f, i) => (
            <motion.button
              key={f.id}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') {
                  e.preventDefault();
                  setActive((i + 1) % features.length);
                } else if (e.key === 'ArrowLeft') {
                  e.preventDefault();
                  setActive((i - 1 + features.length) % features.length);
                }
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={UI_SPRING}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5D08F] ${
                active === i
                  ? "bg-[#E5D08F] text-[#0A0900] font-semibold shadow-[0_0_20px_rgba(201,168,76,0.3)]"
                  : "bg-white/[0.02] backdrop-blur-md border border-white/10 text-[#F5F0E8]/50 hover:border-[#E5D08F]/30 hover:text-[#F5F0E8]/80"
              }`}
              role="tab"
              aria-selected={active === i}
              aria-controls={`feature-panel-${f.id}`}
              tabIndex={active === i ? 0 : -1}
            >
              <span className="text-base" aria-hidden="true">{f.icon}</span>
              <span className="font-mono text-xs hidden md:inline">{f.title}</span>
            </motion.button>
          ))}
        </div>

        {/* Active feature — FIXED screenshot handling */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            id={`feature-panel-${features[active].id}`}
            role="tabpanel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={LAYOUT_SPRING}
            className="flex flex-col items-center gap-14 max-w-4xl mx-auto"
          >
            {/* Text side */}
            <div className="flex flex-col items-center text-center">
              <div className="text-6xl mb-6">{features[active].icon}</div>
              <p className="label-super">
                {features[active].subtitle}
              </p>
              <h3 className="text-display-2 mb-5">
                {features[active].title}
              </h3>
              <p className="text-body-lg prose-elegant mx-auto mb-8">
                {features[active].description}
              </p>
              <div className="flex flex-wrap justify-center gap-3 mb-10">
                {features[active].stats.map((s) => (
                  <span key={s} className="chip-premium text-xs">
                    {s}
                  </span>
                ))}
              </div>
              <a
                href="https://agri-compass-v3.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                Try this feature
              </a>
            </div>

            <KeynoteScreenshot 
              src={features[active].screenshot} 
              alt={features[active].title} 
              tilt="straight" 
            />
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};
