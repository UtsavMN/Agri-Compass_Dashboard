import { useRef } from"react";
import { motion, useInView } from"framer-motion";
import { LAYOUT_SPRING } from"../../constants/springs";
import { FramerCounter } from "../ui/FramerCounter";
import { GlassPanel } from "../primitives/GlassPanel";
import { Button } from "../primitives/Button";

const highlights = [
  { icon:"🤖", title:"AI Powered", desc:"Gemini AI for contextual farm advice" },
  { icon:"🌦", title:"Weather Intelligence", desc:"Hyper-local 5-day forecasts" },
  { icon:"📈", title:"Market Insights", desc:"Live APMC mandi prices daily" },
  { icon:"👥", title:"Community Platform", desc:"Real-time farmer social network" },
  { icon:"🎙", title:"Voice Navigation", desc:"Full Kannada voice control" },
  { icon:"🏛", title:"Government Schemes", desc:"25+ schemes personalised for you" },
  { icon:"⚡", title:"Real-time Messaging", desc:"WebSocket STOMP direct messaging" },
  { icon:"🔐", title:"Secure & Private", desc:"JWT auth via Clerk — zero-trust" },
];

const achievements = [
  { value: 8,   suffix:"",  label:"Core features" },
  { value: 15,  suffix:"+", label:"API integrations" },
  { value: 31,  suffix:"",  label:"Districts covered" },
  { value: 4,   suffix:"",  label:"Team members" },
];

export const FinalExperienceSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin:"-60px" });

  return (
    <section ref={ref} className="relative bg-transparent">

      {/* Highlight cards grid */}
      <div className="py-16 border-y border-[#2A2720] bg-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div className="text-center mb-14"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={LAYOUT_SPRING}>
            <p className="label-super">
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
                <GlassPanel className="p-6 h-full flex flex-col justify-center" interaction="hover">
                  <div className="text-3xl mb-4">{item.icon}</div>
                  <p className="text-[#F5F0E8]/80 text-base font-semibold mb-2">{item.title}</p>
                  <p className="text-[#F5F0E8]/40 text-sm leading-relaxed">{item.desc}</p>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievement Numbers */}
      <div className="py-12 border-b border-[#2A2720] bg-transparent">
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
      <div className="py-12 border-b border-[#2A2720] bg-transparent">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={LAYOUT_SPRING}
          >
            <p className="label-super">
              Project Resources
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {[
                {
                  label:"Open Live App",
                  href:"https://agri-compass-v3.vercel.app",
                  primary: true,
                },
                {
                  label:"GitHub Repository",
                  href:"https://github.com/UtsavMN/Agri-Compass_Dashboard",
                  primary: false,
                },
                {
                  label:"Team Lead LinkedIn",
                  href:"https://www.linkedin.com/in/utsavmn06/",
                  primary: false,
                },
              ].map((btn) => (
                <a
                  key={btn.label}
                  href={btn.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant={btn.primary ? "primary" : "ghost"}
                    className="px-7 py-3.5"
                  >
                    {btn.label} →
                  </Button>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Massive CTA */}
      <div className="relative py-20 overflow-hidden bg-transparent">
        {/* Ambient gold glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[700px] bg-[#E5D08F] rounded-full opacity-[0.035] blur-[140px]" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <motion.p
            className="label-super mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}>
            Live Now · Free for Karnataka Farmers
          </motion.p>

          <motion.h2
            className="font-serif text-6xl md:text-7xl text-[#F5F0E8] mb-8 leading-tight"
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

          <motion.div className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...LAYOUT_SPRING, delay: 0.5 }}>
            <a href="https://agri-compass-v3.vercel.app" target="_blank" rel="noopener noreferrer">
              <Button variant="primary" className="px-12 py-5 text-lg">
                Open AgriCompass →
              </Button>
            </a>
            <a href="https://github.com/UtsavMN/Agri-Compass_Dashboard" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" className="px-12 py-5 border border-[#2A2720] text-lg">
                View on GitHub
              </Button>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
