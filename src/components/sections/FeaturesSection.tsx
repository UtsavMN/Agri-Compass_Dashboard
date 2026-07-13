import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { KeynoteScreenshot } from "../ui/KeynoteScreenshot";
import { features } from "../../constants/features";
import { LAYOUT_SPRING, UI_SPRING } from "../../constants/springs";
import { Typography } from "../primitives/Typography";
import { GlassPanel } from "../primitives/GlassPanel";
import { Button } from "../primitives/Button";
import { Container } from "../primitives/Container";

export const FeaturesSection = () => {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin:"-10%" });

  return (
    <section id="features" ref={ref} className="relative bg-transparent">
      <Container maxWidth="lg" paddingY="lg" className="text-center">
        
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={LAYOUT_SPRING}
        >
          <Typography variant="caption" className="uppercase tracking-[0.15em] font-medium mb-4" color="gold">
            The Platform
          </Typography>
          <div className="mb-6">
            <Typography variant="display-2">
              Eight tools.<br />
              <span className="text-[var(--color-knowledge-gold)] italic">One unified dashboard.</span>
            </Typography>
          </div>
          <Typography variant="body-lg" color="secondary" className="max-w-[65ch] mx-auto">
            Every feature works together.
          </Typography>
        </motion.div>

        {/* Feature icon tabs — LARGER and more visible */}
        <div className="flex flex-wrap gap-2 justify-center mb-6" role="tablist">
          {features.map((f, i) => (
            <GlassPanel
              as={motion.button}
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
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-knowledge-gold)] ${
                active === i
                  ? "bg-[var(--color-knowledge-gold)] !border-[var(--color-knowledge-gold)] text-[var(--color-earth-black)] font-semibold shadow-[0_0_20px_rgba(229,208,143,0.3)]"
                  : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
              }`}
              role="tab"
              aria-selected={active === i}
              aria-controls={`feature-panel-${f.id}`}
              tabIndex={active === i ? 0 : -1}
              interaction={active === i ? 'none' : 'hover'}
            >
              <span className="text-base" aria-hidden="true">{f.icon}</span>
              <span className="font-mono text-xs hidden md:inline">{f.title}</span>
            </GlassPanel>
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
            className="flex flex-col items-center gap-4 max-w-4xl mx-auto"
          >
            {/* Text side */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-2">
                <Typography variant="display-2">
                  {features[active].title}
                </Typography>
              </div>
              <Typography variant="body-md" color="secondary" className="max-w-[65ch] mx-auto mb-4">
                {features[active].description}
              </Typography>
              <div className="flex flex-wrap justify-center gap-3 mb-4">
                {features[active].stats.map((s) => (
                  <Button variant="chip" as="span" key={s} className="pointer-events-none">
                    {s}
                  </Button>
                ))}
              </div>
              <a
                href="https://agri-compass-v3.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost">Try this feature</Button>
              </a>
            </div>

            <KeynoteScreenshot 
              src={features[active].screenshot} 
              alt={features[active].title} 
              tilt="straight" 
            />
          </motion.div>
        </AnimatePresence>

      </Container>
    </section>
  );
};
