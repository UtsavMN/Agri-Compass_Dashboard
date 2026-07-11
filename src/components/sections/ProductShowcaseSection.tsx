import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion";

const chapters = [
  {
    id: "dashboard",
    title: "Command Centre",
    subtitle: "Everything at a glance",
    screenshot: "/screenshots/dashboard.png",
    description: "The dashboard surfaces your most critical information instantly — live weather, recommended crops for your soil, market price movements, and government scheme alerts.",
    highlights: ["Live weather for your district", "AI crop recommendations", "Market price trends", "Scheme deadline alerts"],
    poweredBy: ["React 18", "OpenWeather", "Data.gov.in", "Gemini AI"],
    color: "#C9A84C",
  },
  {
    id: "crops",
    title: "Crop Intelligence",
    subtitle: "AI-powered crop selection",
    screenshot: "/screenshots/crops.png",
    description: "Enter your soil type, NPK values, district, and season. AgriCompass calculates compatibility scores for every crop and tells you exactly what to grow and why.",
    highlights: ["NPK-based recommendations", "Climate suitability score", "Sowing & harvesting calendar", "Expected yield and profit"],
    poweredBy: ["Gemini AI", "Spring Boot", "Agricultural datasets"],
    color: "#7EC47E",
  },
  {
    id: "fertilizer",
    title: "Soil Intelligence",
    subtitle: "Precision fertilizer planning",
    screenshot: "/screenshots/fertilizer.png",
    description: "Not guesswork — chemistry. Input your soil deficits and get exact fertilizer quantities. The Soil Health Vitality Score gives a clear picture of your land's condition.",
    highlights: ["Exact N-P-K quantities", "Soil vitality index", "Urea, DAP, MOP recommendations", "Application timing guidance"],
    poweredBy: ["Spring Boot", "NPK algorithms", "ICAR guidelines"],
    color: "#C9A84C",
  },
  {
    id: "weather",
    title: "Weather & Advisory",
    subtitle: "Farm-specific meteorology",
    screenshot: "/screenshots/weather.png",
    description: "Hyper-local 5-day forecasts with farming advisories. Tells you exactly what to do today — spray, irrigate, harvest, or wait.",
    highlights: ["5-day timeline forecast", "Humidity & wind data", "Farming action advisory", "District-specific data"],
    poweredBy: ["OpenWeather API", "Spring Boot caching", "React Query"],
    color: "#60C0E0",
  },
  {
    id: "market",
    title: "Market Intelligence",
    subtitle: "Know your price before harvest",
    screenshot: "/screenshots/market.png",
    description: "Live APMC mandi prices from Data.gov.in. Compare input costs against gross returns. Interactive charts show which crops earn the most per acre.",
    highlights: ["Live mandi prices", "MSP comparison", "Profitability charts", "Yield vs investment analysis"],
    poweredBy: ["Data.gov.in", "Spring Boot", "Recharts"],
    color: "#6090E0",
  },
  {
    id: "community",
    title: "Kisan Community",
    subtitle: "Farmers learning from farmers",
    screenshot: "/screenshots/community.png",
    description: "A real social platform for Karnataka's farmers. Share knowledge, ask questions, follow other farmers, and communicate directly through real-time messaging.",
    highlights: ["Kisan Feed with categories", "Follow/follower system", "Real-time direct messaging", "District-based filtering"],
    poweredBy: ["WebSocket STOMP", "Spring Boot", "Turso", "Clerk"],
    color: "#7EC47E",
  },
  {
    id: "schemes",
    title: "Government Schemes",
    subtitle: "Your benefits, filtered for you",
    screenshot: "/screenshots/schemes.png",
    description: "25+ central and Karnataka state schemes filtered to match your land size, caste category, and district. Never miss a benefit again.",
    highlights: ["PM-KISAN, Raitha Siri, PMFBY", "Eligibility scoring", "Caste & land size filters", "Application guides"],
    poweredBy: ["Data.gov.in", "Spring Boot", "Eligibility algorithm"],
    color: "#C9A84C",
  },
  {
    id: "voice",
    title: "Voice Navigation",
    subtitle: "ಮಾತನಾಡಿ, navigate ಮಾಡಿ",
    screenshot: "/screenshots/voice.png",
    description: "Speak in Kannada or English. The platform understands natural language and navigates to exactly what you need. No typing required.",
    highlights: ["Kannada (kn-IN) support", "Natural language understanding", "Any Android device", "Quick command grid"],
    poweredBy: ["Web Speech API", "Groq LLaMA3", "React"],
    color: "#E0C060",
  },
];

// Parallax browser mockup
const ParallaxMockup = ({ screenshot, color }: { screenshot: string; color: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className="relative rounded-2xl overflow-hidden border border-[#2A2720]"
      whileHover={{ scale: 1.025 }}
      transition={{ duration: 0.3 }}
    >
      <div style={{ boxShadow: `0 30px 90px ${color}12, 0 0 0 1px #2A2720` }}>
        {/* Browser chrome */}
        <div className="bg-[#141210] px-4 py-3 flex items-center gap-2.5 border-b border-[#2A2720]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
          </div>
          <div className="flex-1 bg-[#1E1C18] rounded px-3 py-1.5 text-xs text-[#5A5850] font-mono">
            agri-compass-v3.vercel.app
          </div>
        </div>
        <img
          src={screenshot}
          alt="AgriCompass Screenshot"
          className="w-full h-auto block"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            (e.currentTarget as HTMLImageElement).style.minHeight = "300px";
            (e.currentTarget as HTMLImageElement).style.background = "#111008";
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `linear-gradient(to top, ${color}08, transparent 60%)` }}
        />
      </div>
    </motion.div>
  );
};

// Before / After comparison
const BeforeAfter = () => {
  const [hover, setHover] = useState<"before" | "after" | null>(null);
  const items = [
    { before: "Ask the neighbour for crop advice", after: "AI recommendation with confidence score" },
    { before: "Watch clouds to predict weather", after: "5-day hyper-local meteorological forecast" },
    { before: "Guess how much fertilizer to use", after: "Exact NPK quantities from soil analysis" },
    { before: "Sell to whoever arrives first", after: "Compare mandi prices across Karnataka" },
    { before: "Never find out about schemes", after: "Personalised scheme matches auto-filtered" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Before */}
      <motion.div
        className="bg-[#1a0808] border border-[#E06060]/15 rounded-2xl p-7"
        animate={hover === "before" ? { scale: 1.02 } : { scale: 1 }}
        onMouseEnter={() => setHover("before")}
        onMouseLeave={() => setHover(null)}
      >
        <p className="text-[#E06060]/70 text-xs font-mono uppercase tracking-wider mb-5">
          Before AgriCompass
        </p>
        <ul className="space-y-4">
          {items.map((item, i) => (
            <motion.li key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-3 text-sm text-[#F5F0E8]/35">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E06060]/40 flex-shrink-0 mt-1.5" />
              {item.before}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* After */}
      <motion.div
        className="bg-[#081a08] border border-[#7EC47E]/15 rounded-2xl p-7"
        animate={hover === "after" ? { scale: 1.02 } : { scale: 1 }}
        onMouseEnter={() => setHover("after")}
        onMouseLeave={() => setHover(null)}
      >
        <p className="text-[#7EC47E]/70 text-xs font-mono uppercase tracking-wider mb-5">
          With AgriCompass
        </p>
        <ul className="space-y-4">
          {items.map((item, i) => (
            <motion.li key={i}
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-3 text-sm text-[#F5F0E8]/65">
              <div className="w-1.5 h-1.5 rounded-full bg-[#7EC47E]/60 flex-shrink-0 mt-1.5" />
              {item.after}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export const ProductShowcaseSection = () => {
  const [activeChapter, setActiveChapter] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const active = chapters[activeChapter];

  return (
    <section ref={ref} className="py-32 bg-[#080706]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85 }}>
          <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase font-mono mb-4">
            Live Product
          </p>
          <h2 className="font-serif text-5xl md:text-6xl text-[#F5F0E8] mb-4">
            Experience it.<br />
            <span className="text-[#C9A84C]">Without logging in.</span>
          </h2>
          <p className="text-[#F5F0E8]/30 max-w-xl mx-auto">
            A guided tour of every feature. Real screenshots from the live platform.
          </p>
        </motion.div>

        {/* Chapter navigation */}
        <div className="flex flex-wrap gap-2 justify-center mb-14">
          {chapters.map((ch, i) => (
            <motion.button key={ch.id} onClick={() => setActiveChapter(i)}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className={`px-4 py-2 rounded-lg text-xs font-mono transition-all ${
                activeChapter === i
                  ? "bg-[#C9A84C] text-[#0A0900] font-bold"
                  : "bg-[#111008] border border-[#2A2720] text-[#F5F0E8]/40 hover:border-[#C9A84C]/30"
              }`}
            >
              {ch.title}
            </motion.button>
          ))}
        </div>

        {/* Active Chapter Details */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={active.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32"
          >
            <div>
              <p className="text-xs uppercase font-mono tracking-widest mb-2" style={{ color: active.color }}>
                {active.subtitle}
              </p>
              <h3 className="text-4xl font-serif text-[#F5F0E8] mb-6">
                {active.title}
              </h3>
              <p className="text-[#F5F0E8]/50 text-lg leading-relaxed mb-8">
                {active.description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {active.highlights.map((h, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-sm mt-0.5" style={{ color: active.color }}>✓</span>
                    <span className="text-[#F5F0E8]/60 text-sm leading-tight">{h}</span>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-[#F5F0E8]/20 text-[10px] uppercase font-mono tracking-wider mb-2">Powered By</p>
                <div className="flex flex-wrap gap-2">
                  {active.poweredBy.map((p, idx) => (
                    <span key={idx} className="text-[#F5F0E8]/40 text-xs px-2.5 py-1 border border-[#2A2720] rounded-full bg-[#111008]">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <ParallaxMockup screenshot={active.screenshot} color={active.color} />
          </motion.div>
        </AnimatePresence>

        {/* Before / After */}
        <div className="mt-20">
          <motion.h3 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center font-serif text-3xl text-[#F5F0E8] mb-12"
          >
            The difference it makes.
          </motion.h3>
          <BeforeAfter />
        </div>

      </div>
    </section>
  );
};
