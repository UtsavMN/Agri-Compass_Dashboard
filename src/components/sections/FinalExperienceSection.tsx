import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { LAYOUT_SPRING } from "../../constants/springs";
import { FramerCounter } from "../ui/FramerCounter";

const highlights = [
  { icon: "🤖", title: "AI Powered", desc: "Gemini AI for contextual farm advice" },
  { icon: "🌦", title: "Weather Intelligence", desc: "Hyper-local 5-day forecasts" },
  { icon: "📈", title: "Market Insights", desc: "Live APMC mandi prices daily" },
  { icon: "👥", title: "Community Platform", desc: "Real-time farmer social network" },
  { icon: "🎙", title: "Voice Navigation", desc: "Full Kannada voice control" },
  { icon: "🏛", title: "Government Schemes", desc: "25+ schemes personalised for you" },
  { icon: "⚡", title: "Real-time Messaging", desc: "WebSocket STOMP direct messaging" },
  { icon: "🔐", title: "Secure & Private", desc: "JWT auth via Clerk — zero-trust" },
];

const achievements = [
  { value: 8,   suffix: "",  label: "Core features" },
  { value: 15,  suffix: "+", label: "API integrations" },
  { value: 31,  suffix: "",  label: "Districts covered" },
  { value: 4,   suffix: "",  label: "Team members" },
];

export const FinalExperienceSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="relative bg-transparent">

      {/* Highlight cards grid */}
      <div className="py-24 border-y border-[#2A2720] bg-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div className="text-center mb-14"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={LAYOUT_SPRING}>
            <p className="text-[#E5D08F] text-xs tracking-[0.3em] uppercase font-mono mb-4">
              Project Highlights
            </p>
            <h2 className="text-display-2 mb-4">
              Built for scale. Ready for farmers.
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {highlights.map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ ...LAYOUT_SPRING, delay: i * 0.07 }}
                className="pointer-events-auto">
                <div className="premium-card p-6 h-full flex flex-col justify-center transition-transform duration-500 hover:scale-[1.02]">
                  <div className="text-3xl mb-4">{item.icon}</div>
                  <p className="text-[#F5F0E8]/80 text-base font-semibold mb-2">{item.title}</p>
                  <p className="text-[#F5F0E8]/40 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievement Numbers */}
      <div className="py-20 border-b border-[#2A2720] bg-transparent">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {achievements.map((stat, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...LAYOUT_SPRING, delay: i * 0.1 }}
              className="text-center">
              <div className="font-serif text-5xl text-[#E5D08F] mb-2">
                <FramerCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-[#F5F0E8]/28 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Open Source block */}
      <div className="py-20 border-b border-[#2A2720] bg-transparent">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={LAYOUT_SPRING}
          >
            <p className="text-[#E5D08F] text-xs font-mono uppercase tracking-[0.3em] mb-8">
              Project Resources
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {[
                {
                  label: "Open Live App",
                  href: "https://agri-compass-v3.vercel.app",
                  primary: true,
                },
                {
                  label: "GitHub Repository",
                  href: "https://github.com/UtsavMN/Agri-compass_v3",
                  primary: false,
                },
                {
                  label: "Team Lead LinkedIn",
                  href: "https://www.linkedin.com/in/utsavmn06/",
                  primary: false,
                },
              ].map((btn) => (
                <motion.a
                  key={btn.label}
                  href={btn.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: btn.primary
                      ? "0 0 36px rgba(201,168,76,0.4)"
                      : "none",
                  }}
                  whileTap={{ scale: 0.97 }}
                  className={`px-7 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                    btn.primary
                      ? "bg-[#E5D08F] text-[#0A0900]"
                      : "border border-[#2A2720] text-[#F5F0E8]/50 hover:border-[#E5D08F]/30 hover:text-[#F5F0E8]"
                  }`}
                >
                  {btn.label} →
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Massive CTA */}
      <div className="relative py-48 overflow-hidden bg-transparent">
        {/* Ambient gold glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[700px] bg-[#E5D08F] rounded-full opacity-[0.035] blur-[140px]" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <motion.p
            className="text-[#E5D08F] text-xs tracking-[0.35em] uppercase font-mono mb-7"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}>
            Live Now · Free for Karnataka Farmers
          </motion.p>

          <motion.h2
            className="font-serif text-6xl md:text-7xl text-[#F5F0E8] mb-7 leading-tight"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={LAYOUT_SPRING}>
            The fields of Karnataka<br />
            <span className="text-[#E5D08F]">are waiting.</span>
          </motion.h2>

          <motion.p
            className="text-[#F5F0E8]/38 text-lg mb-14 leading-relaxed max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ ...LAYOUT_SPRING, delay: 0.3 }}>
            AgriCompass is live and free. 12 million farmers in Karnataka
            deserve intelligent tools. We built this to help reach them.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-5 justify-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...LAYOUT_SPRING, delay: 0.5 }}>
            <motion.a
              href="https://agri-compass-v3.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(201,168,76,0.4)" }}
              whileTap={{ scale: 0.97 }}
              className="px-12 py-5 bg-[#E5D08F] text-[#0A0900] font-semibold text-lg rounded-xl transition-all hover:bg-[#F6E6B8] hover:shadow-[0_0_20px_rgba(229,208,143,0.4)]">
              Open AgriCompass →
            </motion.a>
            <motion.a
              href="https://github.com/UtsavMN/Agri-compass_v3"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ borderColor: "rgba(201,168,76,0.45)" }}
              className="px-12 py-5 border border-[#2A2720] text-[#F5F0E8]/50 text-lg
                         rounded-xl hover:text-[#F5F0E8] transition-all">
              View on GitHub
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
