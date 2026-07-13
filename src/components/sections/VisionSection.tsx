import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { LAYOUT_SPRING } from "../../constants/springs";
import { Typography } from "../primitives/Typography";
import { GlassPanel } from "../primitives/GlassPanel";
import { Button } from "../primitives/Button";
import { Container } from "../primitives/Container";


// ─── FARMER STORY SCROLL ──────────────────────────────────────────────────────
const FarmerStory = () => {
  const ref = useRef(null);

  const decisions = [
    {
      question:"Which crop should I grow?",
      before:"Ask the neighbour",
      after:"AI recommendation with 92% confidence",
      icon:"🌾",
    },
    {
      question:"Will it rain this week?",
      before:"Watch the clouds",
      after:"5-day hyper-local forecast with farming advisory",
      icon:"🌦",
    },
    {
      question:"How much fertilizer do I need?",
      before:"Guess based on experience",
      after:"Exact quantities from soil NPK analysis",
      icon:"🧪",
    },
    {
      question:"Where should I sell my harvest?",
      before:"Whoever shows up first",
      after:"Compare mandi prices across Karnataka",
      icon:"📈",
    },
    {
      question:"What government help is available?",
      before:"Never found out",
      after:"Personalised scheme matches — PM-KISAN, Raitha Siri, PMFBY",
      icon:"🏛",
    },
  ];

  return (
    <div ref={ref} className="space-y-6">
      {decisions.map((d, i) => (
        <GlassPanel
          as={motion.div}
          key={i}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ ...LAYOUT_SPRING, delay: i * 0.1 }}
          className="p-8 text-center flex flex-col items-center w-full"
          interaction="hover"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="flex flex-col items-center gap-6 w-full">
            <span className="text-4xl flex-shrink-0 drop-shadow-xl">{d.icon}</span>
            <div className="flex-1 min-w-0 w-full flex flex-col items-center">
              <div className="mb-3">
                <Typography variant="body-lg" className="font-serif leading-relaxed italic opacity-70">
                  "{d.question}"
                </Typography>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg justify-center">
                <div className="border border-[var(--color-glass-border,rgba(255,255,255,0.06))] rounded-xl px-5 py-4 flex-1 text-center bg-[var(--color-earth-black)]/30">
                  <Typography variant="micro" className="text-[var(--color-alert-amber)] font-bold mb-2 block">
                    Before
                  </Typography>
                  <Typography variant="caption" color="muted">{d.before}</Typography>
                </div>
                <div className="border border-[var(--color-growth-green)]/30 rounded-xl px-5 py-4 flex-1 text-center bg-[var(--color-growth-green)]/5" style={{ boxShadow: "0 0 30px rgba(126,196,126,0.1) inset" }}>
                  <Typography variant="micro" className="text-[var(--color-growth-green)] font-bold mb-2 block">
                    With AgriCompass
                  </Typography>
                  <Typography variant="caption" color="primary">{d.after}</Typography>
                </div>
              </div>
            </div>
          </div>
        </GlassPanel>
      ))}
    </div>
  );
};

// ─── KNOWLEDGE FLOW ANIMATION ─────────────────────────────────────────────────
const KnowledgeFlow = () => {
  const nodes = [
    { label:"Experienced Farmer", icon:"👴", color:"#E5D08F" },
    { label:"AgriCompass Community", icon:"📱", color:"#7EC47E" },
    { label:"Young Farmer", icon:"👨🌾", color:"#6090E0" },
    { label:"Future Generations", icon:"🌱", color:"#E5D08F" },
  ];

  return (
    <div className="flex flex-col items-center gap-0">
      {nodes.map((node, i) => (
        <div key={i} className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ ...LAYOUT_SPRING, delay: i * 0.2 }}
            className="flex flex-col items-center text-center"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-2"
              style={{
                background: `color-mix(in srgb, ${node.color} 15%, transparent)`,
                border: `1.5px solid color-mix(in srgb, ${node.color} 35%, transparent)`,
                boxShadow: `0 0 20px color-mix(in srgb, ${node.color} 18%, transparent)`,
              }}
            >
              {node.icon}
            </div>
            <Typography variant="micro" color="muted">{node.label}</Typography>
          </motion.div>

          {i < nodes.length - 1 && (
            <div className="relative h-12 flex items-center justify-center">
              <div className="w-0.5 h-full bg-gradient-to-b from-[#E5D08F]/40 to-[#E5D08F]/10" />
              <motion.div
                className="absolute w-2 h-2 bg-[#E5D08F] rounded-full"
                style={{ boxShadow:"0 0 8px #E5D08F" }}
                animate={{ y: ["0%","100%"], opacity: [1, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  delay: i * 0.4,
                  ease:"linear",
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ─── FUTURE ROADMAP ───────────────────────────────────────────────────────────
const futureVision = [
  { icon:"🛰", title:"Satellite Monitoring", description:"Crop health analysis from satellite imagery — detect disease before it spreads" },
  { icon:"🤖", title:"Predictive AI", description:"ML models that predict optimal harvest windows and price peaks weeks in advance" },
  { icon:"💧", title:"Smart Irrigation", description:"IoT soil sensors that trigger irrigation automatically based on moisture levels" },
  { icon:"🚁", title:"Drone Analytics", description:"Aerial crop mapping that identifies yield variations across each farm sector" },
  { icon:"🦠", title:"Disease Detection", description:"Computer vision that identifies pest infestations from photos taken on any smartphone" },
  { icon:"🌍", title:"Multi-State Expansion", description:"Extend beyond Karnataka to cover all major agricultural states across India" },
];

// ─── MAIN VISION SECTION ──────────────────────────────────────────────────────
export const VisionSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin:"-60px" });

  return (
    <section id="vision" ref={ref} className="relative bg-transparent">
      <Container maxWidth="lg" paddingY="xl">

        {/* Header */}
        <motion.div className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={LAYOUT_SPRING}>
          <Typography variant="caption" className="uppercase tracking-[0.15em] font-medium mb-4" color="gold">
            The Vision
          </Typography>
          <div className="mb-6">
            <Typography variant="display-2" className="max-w-3xl mx-auto">
              Why does<br />
              <span className="text-[var(--color-knowledge-gold)] italic">AgriCompass</span> exist?
            </Typography>
          </div>
          <Typography variant="body-lg" color="secondary" className="max-w-[65ch] mx-auto">
            Every day, millions of farmers in Karnataka make decisions that affect their
            families' income — without access to the data that could help them choose better.
            AgriCompass is an attempt to change that.
          </Typography>
        </motion.div>

        {/* Farmer story */}
        <div className="flex flex-col gap-16 items-center mb-28 px-0 max-w-3xl mx-auto text-center">
          <div className="min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={LAYOUT_SPRING}
              className="mb-8"
            >
              <Typography variant="caption" className="uppercase tracking-[0.15em] font-medium mb-4 block" color="gold">
                The everyday challenge
              </Typography>
              <div className="mb-4">
                <Typography variant="heading-1">
                  Every farmer faces these decisions. Every season.
                </Typography>
              </div>
              <Typography variant="caption" color="muted" className="leading-relaxed block">
                The difference between a profitable harvest and a loss often comes down
                to information that exists — but was never accessible. AgriCompass bridges that gap.
              </Typography>
            </motion.div>
            <FarmerStory />
          </div>

          {/* Knowledge preservation */}
          <div className="min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...LAYOUT_SPRING, delay: 0.2 }}
              className="mb-8 mt-16"
            >
              <Typography variant="caption" className="uppercase tracking-[0.15em] font-medium mb-4 block" color="gold">
                Knowledge should never be lost
              </Typography>
              <div className="mb-4">
                <Typography variant="heading-1">
                  Generations of farming wisdom — preserved and shared.
                </Typography>
              </div>
              <Typography variant="caption" color="muted" className="leading-relaxed block">
                When an experienced farmer retires, decades of local knowledge disappear.
                The AgriCompass community platform ensures that knowledge flows forward —
                from experienced farmers to the next generation.
              </Typography>
            </motion.div>
            <KnowledgeFlow />
          </div>
        </div>

        {/* Mission statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={LAYOUT_SPRING}
          className="text-center mb-24 py-16 border-y border-[var(--color-glass-border,rgba(255,255,255,0.06))] bg-transparent"
        >
          <Typography variant="caption" className="uppercase tracking-[0.15em] font-medium mb-4 block" color="gold">
            Our Vision
          </Typography>
          <Typography variant="heading-1" className="max-w-3xl mx-auto italic leading-relaxed" color="secondary" as="blockquote">
            "Empowering every farmer with intelligent decision-making — through AI, data, and community knowledge."
          </Typography>
        </motion.div>

        {/* Multilingual accessibility */}
        <div className="mb-24">
          <motion.div className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <Typography variant="caption" className="uppercase tracking-[0.15em] font-medium mb-4 block" color="gold">
              Accessibility First
            </Typography>
            <Typography variant="heading-1">
              Built for farmers, not for engineers.
            </Typography>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Accessibility Items */}
            {[
              { icon: "🇮🇳", title: "Kannada First", desc: "Full UI translation. Every label, button, and message available in Kannada.", color: "var(--color-knowledge-gold)" },
              { icon: "🗣", title: "Voice Navigation", desc: "Farmers who find typing difficult can speak to navigate the entire app.", color: "var(--color-growth-green)" },
              { icon: "📱", title: "Any Device", desc: "Designed for ₹8,000 Android phones with 2G connectivity in rural areas.", color: "var(--color-water-blue)" },
            ].map((item, i) => (
              <GlassPanel key={i}
                as={motion.div}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...LAYOUT_SPRING, delay: i * 0.12 }}
                whileHover={{ y: -5 }}
                className="p-8 text-center h-full flex flex-col pointer-events-auto transition-transform duration-500 hover:scale-[1.02]"
                interaction="hover">
                <div className="text-4xl mb-6 flex-shrink-0 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{item.icon}</div>
                <div className="mb-3">
                  <Typography variant="heading-1" className="!text-2xl">{item.title}</Typography>
                </div>
                <Typography variant="body-md">{item.desc}</Typography>
              </GlassPanel>
            ))}
          </div>
        </div>

        {/* Future roadmap */}
        <div>
          <motion.div className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <Typography variant="caption" className="uppercase tracking-[0.15em] font-medium mb-4 block" color="gold">
              What Comes Next
            </Typography>
            <div className="mb-4">
              <Typography variant="heading-1">
                The roadmap ahead.
              </Typography>
            </div>
            <Typography variant="body-md" color="secondary" className="max-w-lg mx-auto">
              AgriCompass V1 is live. These are the capabilities we're building toward.
            </Typography>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {futureVision.map((item, i) => (
              <GlassPanel key={i}
                as={motion.div}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ ...LAYOUT_SPRING, delay: i * 0.08 }}
                className="p-8 overflow-hidden transition-all duration-300 pointer-events-auto"
                interaction="hover">
                <div className="text-2xl mb-4">{item.icon}</div>
                <div className="mb-2">
                  <Typography variant="heading-1" className="!text-xl" color="gold">{item.title}</Typography>
                </div>
                <div className="flex-grow">
                  <Typography variant="body-md">{item.description}</Typography>
                </div>
                <div className="mt-6">
                  <Button variant="chip" as="span" className="pointer-events-none opacity-70">
                    Planned
                  </Button>
                </div>
              </GlassPanel>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
