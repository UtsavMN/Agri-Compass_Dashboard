import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { LAYOUT_SPRING } from "../../constants/springs";
import { Typography } from "../primitives/Typography";
import { GlassPanel } from "../primitives/GlassPanel";
import { Button } from "../primitives/Button";
import { Container } from "../primitives/Container";

const problems = [
  { stat: "58%", label: "of Karnataka farmers rely solely on neighbours for crop decisions", color: "var(--color-alert-amber)" },
  { stat: "₹1.5L Cr", label: "lost annually across India to poor planning and post-harvest losses", color: "var(--color-alert-amber)" },
  { stat: "3 in 5", label: "farmers never check mandi prices before selling their harvest", color: "var(--color-knowledge-gold)" },
  { stat: "72%", label: "of government agricultural schemes go unclaimed every year", color: "var(--color-knowledge-gold)" },
];

export const ProblemSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin:"-80px" });

  return (
    <section id="problem" ref={ref} className="relative bg-transparent">
      <Container maxWidth="lg" paddingY="lg">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={LAYOUT_SPRING}
          className="mb-12 flex flex-col items-center text-center"
        >
          <Typography variant="caption" className="uppercase tracking-[0.15em] font-medium mb-4" color="gold">
            The Problem
          </Typography>
          <div className="mb-6 max-w-4xl">
            <Typography variant="display-2">
              India's farmers deserve
              <span className="text-[var(--color-knowledge-gold)] italic block mt-2">better intelligence.</span>
            </Typography>
          </div>
          <Typography variant="body-lg" color="secondary" className="max-w-[65ch]">
            Millions of farmers make million-rupee decisions based on guesswork.
            Traditional knowledge is disappearing. Data that could save harvests
            sits behind walls of complexity and language barriers.
          </Typography>
        </motion.div>

        <div className="flex flex-col gap-6 max-w-3xl mx-auto items-center">
          {problems.map((item, i) => (
            <GlassPanel
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ ...LAYOUT_SPRING, delay: i * 0.14 }}
              className="p-12 flex flex-col items-center text-center group w-full"
              interaction="hover"
            >
              <div
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-6 text-xs font-mono font-bold transition-transform duration-500 group-hover:scale-110"
                style={{ background: `color-mix(in srgb, ${item.color} 10%, transparent)`, color: item.color, border: `1px solid color-mix(in srgb, ${item.color} 30%, transparent)` }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>

              <div className="mb-4 font-semibold transition-colors duration-500 tabular-nums" style={{ color: item.color }}>
                <Typography variant="display-2" as="span" color="primary" style={{ color: 'inherit' }}>{item.stat}</Typography>
              </div>
              <Typography variant="body-lg" className="max-w-md">{item.label}</Typography>
            </GlassPanel>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...LAYOUT_SPRING, delay: 0.7 }}
          className="mt-16 text-center"
        >
          <Button variant="chip" as="div" className="pointer-events-none gap-3 !px-7 !py-3">
            <div className="w-2 h-2 rounded-full bg-[var(--color-knowledge-gold)] animate-pulse" />
            <span>AgriCompass was built to solve exactly this</span>
          </Button>
        </motion.div>
      </Container>
    </section>
  );
};
