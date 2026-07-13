import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { KeynoteScreenshot } from "../ui/KeynoteScreenshot";
import { features } from "../../constants/features";
import { LAYOUT_SPRING } from "../../constants/springs";
import { Typography } from "../primitives/Typography";
import { Button } from "../primitives/Button";
import { Container } from "../primitives/Container";

export const TimelineSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress through the entire timeline container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center","end end"]
  });

  // Smooth the scroll progress for a buttery animation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // The glowing line height scales with scroll
  const lineHeight = useTransform(smoothProgress, [0, 1], ["0%","100%"]);

  return (
    <section id="features" className="bg-transparent relative z-10">
      <Container maxWidth="xl" paddingY="xl">
        
        {/* Massive Timeline Header */}
        <div className="text-center mb-40">
          <Typography variant="caption" className="uppercase tracking-[0.15em] font-medium mb-4" color="gold">
            The Platform
          </Typography>
          <div className="mb-8">
            <Typography variant="display-2">
              Eight tools.<br />
              <span className="text-[var(--color-knowledge-gold)] italic">One unified dashboard.</span>
            </Typography>
          </div>
          <Typography variant="body-lg" color="secondary" className="max-w-[65ch] mx-auto">
            Every feature works together. Scroll down to explore the complete AgriCompass suite.
          </Typography>
        </div>

        {/* The Timeline Container */}
        <div ref={containerRef} className="relative pb-32">
          
          {/* Central Track (Dark) */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/5 -translate-x-1/2 hidden md:block" />
          
          {/* Central Glowing Line (Animated) */}
          <motion.div 
            className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[var(--color-knowledge-gold)] via-[var(--color-knowledge-gold)] to-transparent -translate-x-1/2 origin-top hidden md:block shadow-[0_0_15px_rgba(201,168,76,0.8)]"
            style={{ scaleY: lineHeight }}
          />

          {/* Timeline Nodes */}
          <div className="space-y-40 md:space-y-64">
            {features.map((feature, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <div key={feature.id} className="relative w-full flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20">
                  
                  {/* Glowing Dot on the Central Line */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center z-20">
                    <div className="w-4 h-4 rounded-full bg-[var(--color-earth-black)] border-2 border-[var(--color-knowledge-gold)]" />
                    <div className="absolute w-12 h-12 rounded-full blur-md" />
                  </div>

                  {/* Text Content Block */}
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin:"-20%" }}
                    transition={LAYOUT_SPRING}
                    className={`w-full md:w-1/2 flex flex-col ${isEven ? 'md:pr-16 md:text-right md:items-end' : 'md:pl-16 md:order-2 md:text-left md:items-start'}`}
                  >
                    <div className="text-4xl mb-6">{feature.icon}</div>
                    <Typography variant="caption" className="uppercase tracking-[0.15em] font-medium mb-4 block" color="gold">
                      {feature.subtitle}
                    </Typography>
                    <div className="mb-6">
                      <Typography variant="heading-1">
                        {feature.title}
                      </Typography>
                    </div>
                    <div className="mb-8 max-w-lg">
                      <Typography variant="body-lg" color="secondary">
                        {feature.description}
                      </Typography>
                    </div>
                    <div className={`flex flex-wrap gap-2 mb-10 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                      {feature.stats.map((s) => (
                        <Button variant="chip" as="span" key={s} className="pointer-events-none">
                          {s}
                        </Button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Massive Screenshot Viewer Block */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin:"-20%" }}
                    transition={LAYOUT_SPRING}
                    className={`w-full md:w-1/2 ${isEven ? 'md:pl-8' : 'md:order-1 md:pr-8'}`}
                  >
                    <div className="relative">
                      {/* Glow behind screenshot */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[var(--color-knowledge-gold)]/15 via-transparent to-transparent opacity-80 blur-3xl pointer-events-none" />
                      <KeynoteScreenshot src={feature.screenshot} alt={feature.title} tilt={isEven ? "right" : "left"} />
                    </div>
                  </motion.div>

                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};
