import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { techStack } from "../../constants/techStack";
import { LAYOUT_SPRING, UI_SPRING } from "../../constants/springs";
import { Typography } from "../primitives/Typography";
import { GlassPanel } from "../primitives/GlassPanel";
import { Container } from "../primitives/Container";
export const TechSection = () => {
  const categories = ["Frontend","Backend","Auth","Database","Hosting","AI & APIs"];
  const [active, setActive] = useState("Frontend");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin:"-80px" });

  const filtered = techStack.filter((t) => t.category === active);

  return (
    <section id="tech" ref={ref} className="bg-transparent">
      <Container maxWidth="lg" paddingY="xl">

        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={LAYOUT_SPRING}>
          <Typography variant="caption" className="uppercase tracking-[0.15em] font-medium mb-4" color="gold">
            Technology
          </Typography>
          <div className="mb-4">
            <Typography variant="display-2">
              Built with{" "}
              <span className="text-[var(--color-knowledge-gold)]">production-grade</span> tools.
            </Typography>
          </div>
          <Typography variant="body-md" color="secondary" className="max-w-lg mx-auto">
            Not a student prototype. A production system using industry-standard technologies.
          </Typography>
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
                  ? "bg-[var(--color-knowledge-gold)] text-[var(--color-earth-black)] font-bold"
                  : "border border-[var(--color-glass-border,rgba(255,255,255,0.06))] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Cards */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((tech, i) => (
              <GlassPanel
                as={motion.div}
                key={tech.name}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ ...UI_SPRING, delay: i * 0.055 }}
                className="p-6 transition-all duration-300 cursor-default"
                interaction="hover"
              >
                <div className="flex justify-between items-start mb-4">
                  <Typography variant="body-md" color="primary" className="font-semibold">{tech.name}</Typography>
                  <span className="text-[9px] font-mono text-[var(--color-knowledge-gold)]
                                   border border-[var(--color-knowledge-gold)]/20 px-2 py-0.5 rounded-full flex-shrink-0 ml-2">
                    {tech.badge}
                  </span>
                </div>
                <div className="mb-0">
                  <Typography variant="caption" color="muted">{tech.description}</Typography>
                </div>
              </GlassPanel>
            ))}
          </AnimatePresence>
        </motion.div>
      </Container>
    </section>
  );
};
