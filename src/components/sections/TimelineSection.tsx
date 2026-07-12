import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { KeynoteScreenshot } from "../ui/KeynoteScreenshot";
import { features } from "../../constants/features";
import { LAYOUT_SPRING } from "../../constants/springs";

export const TimelineSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress through the entire timeline container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end end"]
  });

  // Smooth the scroll progress for a buttery animation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // The glowing line height scales with scroll
  const lineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="features" className="py-40 bg-[#130903] relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Massive Timeline Header */}
        <div className="text-center mb-40">
          <p className="label-super">
            The Platform
          </p>
          <h2 className="text-display-2 mb-8">
            Eight tools.<br />
            <span className="text-[#E5D08F] italic">One unified dashboard.</span>
          </h2>
          <p className="text-body-lg prose-elegant mx-auto">
            Every feature works together. Scroll down to explore the complete AgriCompass suite.
          </p>
        </div>

        {/* The Timeline Container */}
        <div ref={containerRef} className="relative pb-32">
          
          {/* Central Track (Dark) */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/5 -translate-x-1/2 hidden md:block" />
          
          {/* Central Glowing Line (Animated) */}
          <motion.div 
            className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#E5D08F] via-[#E5D08F] to-transparent -translate-x-1/2 origin-top hidden md:block shadow-[0_0_15px_rgba(201,168,76,0.8)]"
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
                    <div className="w-4 h-4 rounded-full bg-[#130903] border-2 border-[#E5D08F]" />
                    <div className="absolute w-12 h-12 rounded-full bg-[#E5D08F]/20 blur-md" />
                  </div>

                  {/* Text Content Block */}
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-20%" }}
                    transition={LAYOUT_SPRING}
                    className={`w-full md:w-1/2 flex flex-col ${isEven ? 'md:pr-16 md:text-right md:items-end' : 'md:pl-16 md:order-2 md:text-left md:items-start'}`}
                  >
                    <div className="text-4xl mb-6">{feature.icon}</div>
                    <p className="label-super">
                      {feature.subtitle}
                    </p>
                    <h3 className="text-heading-1 mb-6">
                      {feature.title}
                    </h3>
                    <p className="text-body-lg mb-8 max-w-lg">
                      {feature.description}
                    </p>
                    <div className={`flex flex-wrap gap-2 mb-10 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                      {feature.stats.map((s) => (
                        <span key={s} className="chip-premium !text-[10px] !px-3 !py-1">
                          {s}
                        </span>
                      ))}
                    </div>
                  </motion.div>

                  {/* Massive Screenshot Viewer Block */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20%" }}
                    transition={LAYOUT_SPRING}
                    className={`w-full md:w-1/2 ${isEven ? 'md:pl-8' : 'md:order-1 md:pr-8'}`}
                  >
                    <div className="relative">
                      {/* Glow behind screenshot */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#E5D08F]/15 via-transparent to-transparent opacity-80 blur-3xl pointer-events-none" />
                      <KeynoteScreenshot src={feature.screenshot} alt={feature.title} tilt={isEven ? "right" : "left"} />
                    </div>
                  </motion.div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
