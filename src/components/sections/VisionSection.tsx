import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { LAYOUT_SPRING } from "../../constants/springs";


// ─── FARMER STORY SCROLL ──────────────────────────────────────────────────────
const FarmerStory = () => {
  const ref = useRef(null);

  const decisions = [
    {
      question: "Which crop should I grow?",
      before: "Ask the neighbour",
      after: "AI recommendation with 92% confidence",
      icon: "🌾",
    },
    {
      question: "Will it rain this week?",
      before: "Watch the clouds",
      after: "5-day hyper-local forecast with farming advisory",
      icon: "🌦",
    },
    {
      question: "How much fertilizer do I need?",
      before: "Guess based on experience",
      after: "Exact quantities from soil NPK analysis",
      icon: "🧪",
    },
    {
      question: "Where should I sell my harvest?",
      before: "Whoever shows up first",
      after: "Compare mandi prices across Karnataka",
      icon: "📈",
    },
    {
      question: "What government help is available?",
      before: "Never found out",
      after: "Personalised scheme matches — PM-KISAN, Raitha Siri, PMFBY",
      icon: "🏛",
    },
  ];

  return (
    <div ref={ref} className="space-y-6">
      {decisions.map((d, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ ...LAYOUT_SPRING, delay: i * 0.1 }}
          className="premium-card p-8 group text-center flex flex-col items-center w-full"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="flex flex-col items-center gap-5 w-full">
            <span className="text-4xl flex-shrink-0 drop-shadow-xl">{d.icon}</span>
            <div className="flex-1 min-w-0 w-full flex flex-col items-center">
              <p className="text-[#F5F0E8]/70 text-sm font-serif mb-3 leading-relaxed">
                "{d.question}"
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg justify-center">
                <div className="bg-[#1A0F05]/80 border border-[#E06060]/30 rounded-xl px-5 py-4 flex-1 text-center">
                  <p className="text-[9px] text-[#E06060] font-mono uppercase tracking-[0.3em] mb-2 font-bold">
                    Before
                  </p>
                  <p className="text-[#F5F0E8]/50 text-sm leading-relaxed">{d.before}</p>
                </div>
                <div className="bg-[#1A0F05]/80 border border-[#7EC47E]/30 rounded-xl px-5 py-4 flex-1 text-center" style={{ boxShadow: "0 0 30px rgba(126,196,126,0.1) inset" }}>
                  <p className="text-[9px] text-[#7EC47E] font-mono uppercase tracking-[0.3em] mb-2 font-bold">
                    With AgriCompass
                  </p>
                  <p className="text-[#F5F0E8]/80 text-sm leading-relaxed">{d.after}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// ─── KNOWLEDGE FLOW ANIMATION ─────────────────────────────────────────────────
const KnowledgeFlow = () => {
  const nodes = [
    { label: "Experienced Farmer", icon: "👴", color: "#E5D08F" },
    { label: "AgriCompass Community", icon: "📱", color: "#7EC47E" },
    { label: "Young Farmer", icon: "👨🌾", color: "#6090E0" },
    { label: "Future Generations", icon: "🌱", color: "#E5D08F" },
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
                background: `${node.color}15`,
                border: `1.5px solid ${node.color}35`,
                boxShadow: `0 0 20px ${node.color}18`,
              }}
            >
              {node.icon}
            </div>
            <p className="text-[#F5F0E8]/60 text-sm font-mono">{node.label}</p>
          </motion.div>

          {i < nodes.length - 1 && (
            <div className="relative h-12 flex items-center justify-center">
              <div className="w-0.5 h-full bg-gradient-to-b from-[#E5D08F]/40 to-[#E5D08F]/10" />
              <motion.div
                className="absolute w-2 h-2 bg-[#E5D08F] rounded-full"
                style={{ boxShadow: "0 0 8px #E5D08F" }}
                animate={{ y: ["0%", "100%"], opacity: [1, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  delay: i * 0.4,
                  ease: "linear",
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
  { icon: "🛰", title: "Satellite Monitoring", description: "Crop health analysis from satellite imagery — detect disease before it spreads" },
  { icon: "🤖", title: "Predictive AI", description: "ML models that predict optimal harvest windows and price peaks weeks in advance" },
  { icon: "💧", title: "Smart Irrigation", description: "IoT soil sensors that trigger irrigation automatically based on moisture levels" },
  { icon: "🚁", title: "Drone Analytics", description: "Aerial crop mapping that identifies yield variations across each farm sector" },
  { icon: "🦠", title: "Disease Detection", description: "Computer vision that identifies pest infestations from photos taken on any smartphone" },
  { icon: "🌍", title: "Multi-State Expansion", description: "Extend beyond Karnataka to cover all major agricultural states across India" },
];

// ─── MAIN VISION SECTION ──────────────────────────────────────────────────────
export const VisionSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="vision" ref={ref} className="relative py-32 bg-transparent">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={LAYOUT_SPRING}>
          <p className="label-super">
            The Vision
          </p>
          <h2 className="text-display-2 mb-6 max-w-3xl mx-auto">
            Why does<br />
            <span className="text-[#E5D08F] italic">AgriCompass</span> exist?
          </h2>
          <p className="text-body-lg prose-elegant mx-auto">
            Every day, millions of farmers in Karnataka make decisions that affect their
            families' income — without access to the data that could help them choose better.
            AgriCompass is an attempt to change that.
          </p>
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
              <p className="label-super">
                The everyday challenge
              </p>
              <h3 className="text-heading-1 mb-4">
                Every farmer faces these decisions. Every season.
              </h3>
              <p className="text-[#F5F0E8]/35 text-sm leading-relaxed">
                The difference between a profitable harvest and a loss often comes down
                to information that exists — but was never accessible. AgriCompass bridges that gap.
              </p>
            </motion.div>
            <FarmerStory />
          </div>

          {/* Knowledge preservation */}
          <div className="min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...LAYOUT_SPRING, delay: 0.2 }}
              className="mb-8"
            >
              <p className="label-super mt-8">
                Knowledge should never be lost
              </p>
              <h3 className="text-heading-1 mb-4">
                Generations of farming wisdom — preserved and shared.
              </h3>
              <p className="text-[#F5F0E8]/35 text-sm leading-relaxed">
                When an experienced farmer retires, decades of local knowledge disappear.
                The AgriCompass community platform ensures that knowledge flows forward —
                from experienced farmers to the next generation.
              </p>
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
          className="text-center mb-24 py-16 border-y border-[#2A2720] bg-transparent"
        >
          <p className="label-super">
            Our Vision
          </p>
          <blockquote className="text-heading-1 text-[#F5F0E8]/80 max-w-3xl mx-auto italic leading-relaxed">
            "Empowering every farmer with intelligent decision-making —
            through AI, data, and community knowledge."
          </blockquote>
        </motion.div>

        {/* Multilingual accessibility */}
        <div className="mb-24">
          <motion.div className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <p className="label-super">
              Accessibility First
            </p>
            <h3 className="text-heading-1">
              Built for farmers, not for engineers.
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: "🇮🇳", title: "Kannada First", desc: "Full UI translation. Every label, button, and message available in Kannada.", color: "#E5D08F" },
              { icon: "🗣", title: "Voice Navigation", desc: "Farmers who find typing difficult can speak to navigate the entire app.", color: "#7EC47E" },
              { icon: "📱", title: "Any Device", desc: "Designed for ₹8,000 Android phones with 2G connectivity in rural areas.", color: "#6090E0" },
            ].map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...LAYOUT_SPRING, delay: i * 0.12 }}
                whileHover={{ y: -5 }}
                className="premium-card p-8 text-center h-full flex flex-col pointer-events-auto transition-transform duration-500 hover:scale-[1.02]">
                <div className="text-4xl mb-6 flex-shrink-0 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{item.icon}</div>
                <h4 className="text-heading-1 !text-2xl mb-3">{item.title}</h4>
                <p className="text-body-md">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Future roadmap */}
        <div>
          <motion.div className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <p className="label-super">
              What Comes Next
            </p>
            <h3 className="text-heading-1 mb-4">
              The roadmap ahead.
            </h3>
            <p className="text-body-md max-w-lg mx-auto">
              AgriCompass V1 is live. These are the capabilities we're building toward.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {futureVision.map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ ...LAYOUT_SPRING, delay: i * 0.08 }}
                className="premium-card bg-[#0A0603]/30 p-7 overflow-hidden transition-all duration-300 pointer-events-auto">
                <div className="text-2xl mb-4">{item.icon}</div>
                <p className="text-heading-1 !text-xl mb-2 text-[#E5D08F]/90">{item.title}</p>
                <p className="text-body-md flex-grow">{item.description}</p>
                <div className="mt-6">
                  <span className="chip-premium !text-[10px] !px-3 !py-1 opacity-70">
                    Planned
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
