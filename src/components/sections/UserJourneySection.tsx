import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { LAYOUT_SPRING } from "../../constants/springs";
import { useAudio } from "../../hooks/useAudio";

const journeySteps = [
  { icon: "📱", step: "1", title: "Opens AgriCompass", detail: "Farmer opens the app on any Android phone. Loads in under 3 seconds from Vercel's global CDN." },
  { icon: "🔑", step: "2", title: "Signs in with Clerk", detail: "One-tap Google login or phone OTP. JWT token issued automatically. Session lasts 30 days." },
  { icon: "🌾", step: "3", title: "Sets up farm profile", detail: "Enters district, farm size, and soil type. One-time onboarding — never asked again." },
  { icon: "🌦", step: "4", title: "Checks weather advisory", detail: "Sees hyper-local 5-day forecast. AI tells exactly what farming action to take today." },
  { icon: "🧪", step: "5", title: "Gets crop recommendation", detail: "Enters NPK values. Receives AI-ranked crop list with confidence scores and profit forecasts." },
  { icon: "📚", step: "6", title: "Reads cultivation guide", detail: "Opens the crop guide. Gets step-by-step instructions from land prep to harvest to selling." },
  { icon: "🤖", step: "7", title: "Asks Krishi Mitra AI", detail: "Types or speaks a question in Kannada. Gemini responds with farm-specific advice in seconds." },
  { icon: "📈", step: "8", title: "Checks mandi prices", detail: "Sees live APMC prices for their district. Compares vs MSP. Decides when to sell." },
  { icon: "👥", step: "9", title: "Shares with community", detail: "Posts their experience to Kisan Feed. Other farmers in their district see it first." },
  { icon: "✅", step: "10", title: "Better farming decisions", detail: "Every step backed by data. Every season more informed than the last." },
];

export const UserJourneySection = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { playClick, playGlass } = useAudio();

  return (
    <section ref={ref} className="py-24 bg-transparent border-y border-white/10 z-10 relative">
      <div className="max-w-7xl mx-auto px-6">

        <motion.div className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={LAYOUT_SPRING}>
          <p className="text-[#E5D08F] text-xs tracking-[0.3em] uppercase font-mono mb-3">
            Farmer Journey
          </p>
          <h2 className="text-display-2 mb-6">
            From opening the app to a{" "}
            <span className="text-[#E5D08F]">better harvest.</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Vertical connecting line on desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#E5D08F]/20 via-[#E5D08F]/10 to-transparent" aria-hidden="true" />

          <div className="space-y-4">
            {journeySteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ ...LAYOUT_SPRING, delay: i * 0.08 }}
                onClick={() => { playClick(); setActiveStep(activeStep === i ? null : i); }}
                onHoverStart={playGlass}
                className={`flex items-start gap-4 cursor-pointer group ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
                role="button"
                aria-expanded={activeStep === i}
                aria-controls={`step-detail-${i}`}
              >
                {/* Content */}
                <motion.div
                  whileHover={{ borderColor: "rgba(201,168,76,0.25)" }}
                  className={`flex-1 premium-card p-5 transition-all duration-300 ${
                    activeStep === i ? "border-[#E5D08F]/40 shadow-[0_0_25px_rgba(201,168,76,0.2)] scale-[1.02]" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl" aria-hidden="true">{step.icon}</span>
                    <div>
                      <span className="text-[10px] font-mono text-[#E5D08F]/50">Step {step.step}</span>
                      <p className="text-[#F5F0E8]/70 text-sm font-semibold">{step.title}</p>
                    </div>
                  </div>
                  <AnimatePresence>
                    {activeStep === i && (
                      <motion.p
                        id={`step-detail-${i}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-[#F5F0E8]/38 text-xs leading-relaxed overflow-hidden"
                      >
                        {step.detail}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Centre dot */}
                <div className="hidden md:flex w-4 flex-shrink-0 items-center justify-center mt-5" aria-hidden="true">
                  <div className={`w-3 h-3 rounded-full border-2 transition-all ${
                    activeStep === i
                      ? "bg-[#E5D08F] border-[#E5D08F] shadow-[0_0_10px_rgba(201,168,76,0.5)]"
                      : "bg-black/50 border-white/20"
                  }`} />
                </div>

                {/* Empty opposite side spacer */}
                <div className="hidden md:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>

        <motion.p className="text-center text-[#F5F0E8]/18 text-xs font-mono mt-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ ...LAYOUT_SPRING, delay: 1 }}>
          Click any step to expand · Full experience at agri-compass-v3.vercel.app
        </motion.p>
      </div>
    </section>
  );
};
