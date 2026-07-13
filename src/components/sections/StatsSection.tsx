import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { LAYOUT_SPRING } from "../../constants/springs";
import { FramerCounter } from "../ui/FramerCounter";
import { Typography } from "../primitives/Typography";
import { GlassPanel } from "../primitives/GlassPanel";
import { Container } from "../primitives/Container";

const stats = [
  { value: 8,  suffix:"",  label:"Core features for complete farm intelligence" },
  { value: 15, suffix:"+", label:"Live API integrations powering real-time data" },
  { value: 31, suffix:"",  label:"Karnataka districts fully supported" },
  { value: 2,  suffix:"",  label:"Languages — Kannada and English" },
];

export const StatsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative bg-transparent z-10">
      <Container maxWidth="lg" paddingY="xl">
        
        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={LAYOUT_SPRING}>
          <Typography variant="caption" className="uppercase tracking-[0.15em] font-medium mb-4" color="gold">
            Scale & Impact
          </Typography>
          <Typography variant="display-2" className="mb-4">
            Built for a <span className="text-[var(--color-knowledge-gold)] italic">state.</span>
          </Typography>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <GlassPanel
              as={motion.div}
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...LAYOUT_SPRING, delay: i * 0.1 }}
              className="p-8 text-center flex flex-col items-center justify-center group"
              interaction="hover"
            >
              <div className="text-display-2 text-[var(--color-knowledge-gold)] mb-4 drop-shadow-[0_0_15px_rgba(229,208,143,0.3)] tabular-nums group-hover:scale-110 transition-transform duration-500" 
                   role="status" aria-live="polite" aria-label={`${stat.value}${stat.suffix} ${stat.label}`}>
                <FramerCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <Typography variant="body-md" className="text-center">{stat.label}</Typography>
            </GlassPanel>
          ))}
        </div>
      </Container>
    </section>
  );
};
